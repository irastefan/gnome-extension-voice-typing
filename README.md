# Voice Typing for GNOME (Fedora + Whisper)

## 🧠 Description
This GNOME Shell extension lets you use your voice to type text anywhere — with a single click.
It uses [OpenAI Whisper](https://github.com/openai/whisper) running **entirely locally**, with no internet connection required.

## 🖥️ Components
- **Python script**: records voice, transcribes it, copies result to clipboard
- **GNOME extension**: microphone icon with menu — Start / Stop / Force Stop

## 📦 Installation

### 1. Install dependencies:
```bash
sudo dnf install python3-pip ffmpeg
pip install --upgrade pip
pip install openai-whisper sounddevice numpy torch
```

> Ensure `wl-clipboard` is installed (for Wayland):
```bash
sudo dnf install wl-clipboard
```

### 2. Clone the project
```bash
git clone https://github.com/yourusername/voice-typing-gnome.git
cd voice-typing-gnome
```

### 3. Install GNOME extension
Copy files to the GNOME extension folder:
```bash
mkdir -p ~/.local/share/gnome-shell/extensions/voice-typing@irastefan
cp extension.js metadata.json ~/.local/share/gnome-shell/extensions/voice-typing@irastefan/
```

Enable the extension:
```bash
gnome-extensions enable voice-typing@irastefan
```

Restart GNOME (X11: `Alt + F2`, then `r`)

### 4. (Optional) Add keyboard shortcut
To launch voice typing from anywhere using a custom hotkey:

1. Open **Settings → Keyboard → View and Customize Shortcuts**
2. Scroll to the bottom and click **Custom Shortcuts**
3. Add a new shortcut:
   - **Name**: Voice Typing
   - **Command**: `gtk-launch voice-typing`
   - **Shortcut**: Set to e.g. <kbd>Super</kbd> + <kbd>V</kbd>

> Make sure you have a `.desktop` file for this command:

Create `~/.local/share/applications/voice-typing.desktop`:
```ini
[Desktop Entry]
Name=Voice Typing
Exec=python3 /home/irastefan/Documents/projects/whisper-fedora/voice_typing_toggle.py
Type=Application
Terminal=false
```

This allows launching the script with `gtk-launch voice-typing`.

## 🚀 Usage
1. Click the microphone icon in the GNOME panel
2. Choose **Start Recording**
3. Speak into your microphone (up to 60 seconds)
4. Click **Stop Recording** — the recognized text is copied to clipboard

## ⚙️ Script: voice_typing_toggle.py

### How it works:
- Records audio using `sounddevice.rec(...)`
- Stops by timer or when Stop button is clicked
- Saves `.wav`, transcribes with Whisper, and copies result to clipboard

### Recording control:
- `Stop Recording` creates the flag `/tmp/voice_typing_stop.flag`
- The script watches this flag and stops recording when it appears
- It also writes `/tmp/voice_typing_status` to let the extension update the icon

## 🛠 Project structure
```
voice-typing-gnome/
├── voice_typing_toggle.py          # Main script for voice capture and transcription
├── extension.js                    # GNOME extension (ESM-based)
├── metadata.json                   # Extension metadata
├── debug_audio.wav                 # Last recorded audio (for debugging)
```

## 📄 License
MIT License

---

# Голосовой ввод для GNOME (Fedora + Whisper)

## 🧠 Описание
Это приложение для GNOME Shell позволяет распознавать речь и превращать её в текст одним нажатием. Идеально для тех, кто хочет вводить текст голосом в любое поле на экране.

В основе лежит модель [OpenAI Whisper](https://github.com/openai/whisper), локально выполняемая на вашем компьютере, без отправки данных в интернет.

## 🖥️ Основные компоненты
- **Python-скрипт**: записывает голос, распознаёт текст, копирует в буфер обмена
- **GNOME расширение**: иконка в панели с меню Start / Stop / Force Stop

## 📦 Установка

### 1. Установка зависимостей:
```bash
sudo dnf install python3-pip ffmpeg
pip install --upgrade pip
pip install openai-whisper sounddevice numpy torch
```

> Убедитесь, что у вас установлен `wl-clipboard` (для Wayland):
```bash
sudo dnf install wl-clipboard
```

### 2. Клонирование проекта
```bash
git clone https://github.com/yourusername/voice-typing-gnome.git
cd voice-typing-gnome
```

### 3. Установка GNOME расширения
Скопируйте расширение в директорию:
```bash
mkdir -p ~/.local/share/gnome-shell/extensions/voice-typing@irastefan
cp extension.js metadata.json ~/.local/share/gnome-shell/extensions/voice-typing@irastefan/
```

Включите расширение:
```bash
gnome-extensions enable voice-typing@irastefan
```

Перезапустите GNOME (если под X11 — `Alt + F2`, затем `r`)

### 4. (Необязательно) Добавить шорткат
Чтобы запускать голосовой ввод по сочетанию клавиш:

1. Откройте **Настройки → Клавиатура → Комбинации клавиш**
2. Пролистайте вниз и нажмите **Пользовательские сочетания**
3. Добавьте новое:
   - **Имя**: Voice Typing
   - **Команда**: `gtk-launch voice-typing`
   - **Сочетание клавиш**: например, <kbd>Super</kbd> + <kbd>V</kbd>

> Не забудьте создать `.desktop` файл:

Создайте `~/.local/share/applications/voice-typing.desktop`:
```ini
[Desktop Entry]
Name=Voice Typing
Exec=python3 /home/irastefan/Documents/projects/whisper-fedora/voice_typing_toggle.py
Type=Application
Terminal=false
```

Теперь вы можете запускать скрипт через `gtk-launch voice-typing`.

## 🚀 Использование
1. Нажмите на иконку микрофона в панели GNOME
2. Выберите **Start Recording**
3. Говорите в микрофон (до 60 секунд)
4. Нажмите **Stop Recording** — текст будет скопирован в буфер обмена

## ⚙️ Скрипт: voice_typing_toggle.py

### Как работает:
- Записывает аудио через `sounddevice.rec(...)`
- При завершении (через кнопку или таймер) сохраняет `.wav`
- Whisper распознаёт текст и результат копируется в буфер

### Контроль записи:
- `Stop Recording` создаёт флаг `/tmp/voice_typing_stop.flag`
- Скрипт отслеживает этот флаг и завершает запись
- Скрипт также пишет статус в `/tmp/voice_typing_status`, чтобы расширение меняло иконку

## 🛠 Структура проекта
```
voice-typing-gnome/
├── voice_typing_toggle.py          # Главный скрипт записи и распознавания
├── extension.js                    # GNOME расширение (ESM)
├── metadata.json                   # Описание расширения
├── debug_audio.wav                 # Последняя записанная речь (для отладки)
```

## 📄 Лицензия
MIT License

