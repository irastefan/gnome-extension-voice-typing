# Voice Typing for GNOME (Linux + Whisper)

## 🧠 Description
This GNOME Shell extension lets you use your voice to type text anywhere — with a single click.
It uses [OpenAI Whisper](https://github.com/openai/whisper) running **entirely locally**, with no internet connection required.

This project works on **any Linux distribution** with GNOME Shell support — including Fedora, Ubuntu, Debian, Arch, etc. It has been tested on **GNOME 48**, and is expected to work with **GNOME 44 and newer**.

## 🖥️ Components
- **Python script**: records voice, transcribes it, copies result to clipboard
- **GNOME extension**: microphone icon with menu — Start / Stop / Force Stop

## 📦 Installation

### 1. Install dependencies:
#### Fedora (dnf)
```bash
sudo dnf install python3-pip ffmpeg wl-clipboard
```
#### Debian/Ubuntu (apt)
```bash
sudo apt install python3-pip ffmpeg wl-clipboard
```
#### Arch (pacman)
```bash
sudo pacman -S python-pip ffmpeg wl-clipboard
```

Then install Python packages:
```bash
pip install --upgrade pip
pip install openai-whisper sounddevice numpy torch
```

### 2. Clone the project
```bash
git clone https://github.com/irastefan/gnome-extension-voice-typing.git
cd gnome-extension-voice-typing
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

Restart GNOME (X11: `Alt + F2`, then `r`) or logout/login.

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
Exec=python3 /path/to/your/script/voice_typing_toggle.py
Type=Application
Terminal=false
```

Replace `/path/to/your/script/` with the actual location of your Python script.

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
gnome-extension-voice-typing/
├── voice_typing_toggle.py          # Main script for voice capture and transcription
├── extension.js                    # GNOME extension (ESM-based)
├── metadata.json                   # Extension metadata
├── debug_audio.wav                 # Last recorded audio (for debugging)
```

## 📄 License
MIT License

---

# Голосовой ввод для GNOME (Linux + Whisper)

## 🧠 Описание
Это расширение для GNOME Shell позволяет вводить текст голосом в любое текстовое поле.
Оно использует [OpenAI Whisper](https://github.com/openai/whisper), полностью локально, без подключения к интернету.

Проект работает на **любой Linux-системе с GNOME Shell**: Fedora, Ubuntu, Debian, Arch и др. Он протестирован на **GNOME 48**, и ожидается, что будет работать на **GNOME 44 и выше**.

## 🖥️ Компоненты
- **Python-скрипт**: записывает голос, распознаёт текст, копирует в буфер обмена
- **GNOME-расширение**: иконка с меню Start / Stop / Force Stop

## 📦 Установка

### 1. Зависимости:
#### Fedora
```bash
sudo dnf install python3-pip ffmpeg wl-clipboard
```
#### Ubuntu/Debian
```bash
sudo apt install python3-pip ffmpeg wl-clipboard
```
#### Arch Linux
```bash
sudo pacman -S python-pip ffmpeg wl-clipboard
```

Установка Python-библиотек:
```bash
pip install --upgrade pip
pip install openai-whisper sounddevice numpy torch
```

### 2. Клонирование проекта
```bash
git clone https://github.com/irastefan/gnome-extension-voice-typing.git
cd gnome-extension-voice-typing
```

### 3. Установка расширения GNOME
```bash
mkdir -p ~/.local/share/gnome-shell/extensions/voice-typing@irastefan
cp extension.js metadata.json ~/.local/share/gnome-shell/extensions/voice-typing@irastefan/
```

Включите расширение:
```bash
gnome-extensions enable voice-typing@irastefan
```

Перезапустите GNOME (X11: `Alt + F2`, затем `r`) или перелогиньтесь.

### 4. (По желанию) Добавить горячую клавишу
1. Откройте **Настройки → Клавиатура → Комбинации клавиш**
2. Добавьте новое сочетание:
   - **Имя**: Voice Typing
   - **Команда**: `gtk-launch voice-typing`
   - **Клавиши**: например, <kbd>Super</kbd> + <kbd>V</kbd>

Создайте файл `~/.local/share/applications/voice-typing.desktop`:
```ini
[Desktop Entry]
Name=Voice Typing
Exec=python3 /path/to/your/script/voice_typing_toggle.py
Type=Application
Terminal=false
```

Замените `/path/to/your/script/` на путь до скрипта.

## 🚀 Использование
1. Кликните по иконке микрофона в панели GNOME
2. Выберите **Start Recording**
3. Говорите в микрофон до 60 секунд
4. Нажмите **Stop Recording** — текст скопируется в буфер

## ⚙️ Скрипт: voice_typing_toggle.py
- Записывает голос
- Останавливается по таймеру или флагу
- Распознаёт и копирует текст в буфер
- Управляет статусом через файл `/tmp/voice_typing_status`

## 🛠 Структура проекта
```
gnome-extension-voice-typing/
├── voice_typing_toggle.py
├── extension.js
├── metadata.json
├── debug_audio.wav
```

## 📄 Лицензия
MIT License
