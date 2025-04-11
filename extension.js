// Updated GNOME extension: debug notify, safe readStatus, log subprocess
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import GLib from 'gi://GLib';

const STATUS_FILE = '/tmp/voice_typing_status';

let indicator, icon;
let checkStatusLoop;

function readStatus() {
    try {
        if (!GLib.file_test(STATUS_FILE, GLib.FileTest.EXISTS)) return 'idle';
        let [ok, contents] = GLib.file_get_contents(STATUS_FILE);
        if (ok && contents instanceof Uint8Array) {
            const decoder = new TextDecoder();
            return decoder.decode(contents).trim();
        }
        return 'idle';
    } catch (e) {
        log('[Voice Typing] Failed to read status file: ' + e);
        return 'idle';
    }
}

function updateIcon() {
    const status = readStatus();
    const iconName = status === 'recording'
        ? 'microphone-sensitivity-medium-symbolic'
        : 'microphone-sensitivity-high-symbolic';
    icon.icon_name = iconName;
}

export default class Extension {
    enable() {
        indicator = new PanelMenu.Button(0.0, 'Voice Typing Indicator');

        icon = new St.Icon({
            icon_name: 'microphone-sensitivity-high-symbolic',
            style_class: 'system-status-icon',
        });

        indicator.add_child(icon);

        // Start Recording (with play icon)
        const startItem = new PopupMenu.PopupImageMenuItem('Start Recording', 'media-playback-start-symbolic');
         startItem.connect('activate', () => {
             GLib.spawn_command_line_async('python3 /home/irastefan/Documents/projects/whisper-fedora/voice_typing_toggle.py');
         });
        indicator.menu.addMenuItem(startItem);

        // Stop Recording (with stop icon)
        const stopItem = new PopupMenu.PopupImageMenuItem('Stop Recording', 'media-playback-stop-symbolic');
        stopItem.connect('activate', () => {
            log('[Voice Typing] Stop flag set');
            GLib.file_set_contents('/tmp/voice_typing_stop.flag', 'stop');
        });
        indicator.menu.addMenuItem(stopItem);

        // Force Stop (Kill) (with exit icon)
        const forceStopItem = new PopupMenu.PopupImageMenuItem('Force Stop (Kill)', 'application-exit-symbolic');
        forceStopItem.connect('activate', () => {
            log('[Voice Typing] Sending pkill to script');
            GLib.spawn_command_line_async('pkill -f voice_typing_toggle.py');
        });
        indicator.menu.addMenuItem(forceStopItem);

        Main.panel.addToStatusArea('voice-typing-indicator', indicator);

        checkStatusLoop = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            updateIcon();
            return true;
        });
    }

    disable() {
        if (checkStatusLoop) {
            GLib.source_remove(checkStatusLoop);
            checkStatusLoop = null;
        }
        if (indicator) {
            indicator.destroy();
            indicator = null;
        }
    }
}
