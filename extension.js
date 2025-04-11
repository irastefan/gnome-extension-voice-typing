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
        return GLib.file_get_contents(STATUS_FILE)[1].toString().trim();
    } catch (e) {
        log('Voice Typing: Failed to read status file: ' + e);
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

        const startItem = new PopupMenu.PopupMenuItem('Start Recording');
        startItem.connect('activate', () => {
            GLib.spawn_command_line_async('python3 voice_typing_toggle.py');
        });
        indicator.menu.addMenuItem(startItem);

        const stopItem = new PopupMenu.PopupMenuItem('Stop Recording');
        stopItem.connect('activate', () => {
            GLib.file_set_contents('/tmp/voice_typing_stop.flag', 'stop');
        });
        indicator.menu.addMenuItem(stopItem);

        const forceStopItem = new PopupMenu.PopupMenuItem('Force Stop (Kill)');
        forceStopItem.connect('activate', () => {
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

