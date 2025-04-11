#!/usr/bin/env python3  

import os  
import tempfile  
import whisper  
import sounddevice as sd  
import numpy as np  
import wave  
import subprocess  
import traceback  
import time

DURATION = 60  # секунд записи (максимум)  
SAMPLERATE = 16000  # частота  
STOP_FLAG_PATH = "/tmp/voice_typing_stop.flag"  # флаг для остановки
STATUS_PATH = "/tmp/voice_typing_status"  # файл-индикатор для GNOME

def notify(title, message=""):  
    env = os.environ.copy()  
    env["DBUS_SESSION_BUS_ADDRESS"] = f"unix:path=/run/user/{os.getuid()}/bus"  
    subprocess.run(["notify-send", title, message], env=env)  

def should_stop():
    return os.path.exists(STOP_FLAG_PATH)

def clear_stop_flag():
    if os.path.exists(STOP_FLAG_PATH):
        os.remove(STOP_FLAG_PATH)

def set_status(value):
    try:
        with open(STATUS_PATH, "w") as f:
            f.write(value)
    except Exception as e:
        print("[ERROR] Could not write status file:", e)

def record_audio(filename, duration=DURATION, samplerate=SAMPLERATE):
    notify("Recording started", f"You may speak up to {duration} seconds. Press Stop to end early.")
    print("[INFO] Recording started...")
    set_status("recording")

    total_frames = int(duration * samplerate)
    recorded = np.zeros((total_frames, 1), dtype='int16')

    try:
        start_time = time.time()
        audio = sd.rec(total_frames, samplerate=samplerate, channels=1, dtype='int16')

        while True:
            elapsed = time.time() - start_time
            if should_stop():
                frames_recorded = int(elapsed * samplerate)
                print("[INFO] Stop flag detected. Stopping early.")
                break
            if elapsed >= duration:
                frames_recorded = total_frames
                break
            time.sleep(0.1)

        sd.stop()
        recorded = audio[:frames_recorded]

    except Exception as e:
        error_message = traceback.format_exc()
        notify("Recording Error", error_message)
        print("[ERROR] Recording exception:\n", error_message)
        set_status("idle")
        return False

    print(f"[INFO] Total recorded: {len(recorded)} samples, duration: {len(recorded)/samplerate:.2f} seconds")

    try:
        with wave.open("debug_audio.wav", 'wb') as debug_wav:
            debug_wav.setnchannels(1)
            debug_wav.setsampwidth(2)
            debug_wav.setframerate(samplerate)
            debug_wav.writeframes(recorded.tobytes())
        print("[DEBUG] Saved debug audio to debug_audio.wav")
    except Exception as e:
        print("[ERROR] Failed to save debug_audio.wav:", e)

    try:
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(samplerate)
            wf.writeframes(recorded.tobytes())
    except Exception as e:
        error_message = traceback.format_exc()
        notify("Error saving audio", error_message)
        print("[ERROR] WAV save error:\n", error_message)
        set_status("idle")
        return False

    clear_stop_flag()
    set_status("idle")
    notify("Processing speech...", "Transcribing audio...")
    return True

def transcribe_audio(filename):
    model = whisper.load_model("base")
    result = model.transcribe(filename, language="ru")
    text = result["text"]
    print("🧠 Recognized text:", text)
    return text

def copy_to_clipboard(text):
    if not text:
        notify("Error", "No speech was recognized.")
        return

    process = subprocess.Popen(['wl-copy'], stdin=subprocess.PIPE)
    process.communicate(input=text.encode('utf-8'))
    notify("Text copied to clipboard", text)

def main():
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmpfile:
        success = record_audio(tmpfile.name)
        if success and os.path.exists(tmpfile.name):
            try:
                text = transcribe_audio(tmpfile.name)
                copy_to_clipboard(text)
            except Exception as e:
                error_message = traceback.format_exc()
                notify("Transcription Error", error_message)
                print(error_message)
        os.unlink(tmpfile.name)

if __name__ == "__main__":
    main()
