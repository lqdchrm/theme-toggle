const handleSquirrelEvent = require("./install");
const { app, Menu, Tray } = require("electron");

const icon = require("./icon");
const { light, dark } = require("./color-scheme");
const { enableDevice, disableDevice } = require("./devices");

if (handleSquirrelEvent(app)) { return; }
try { require('electron-reloader')(module); } catch {}

function exit() { app.quit(); }

app.whenReady().then(() => {
    const singleInstance = app.requestSingleInstanceLock();

    if (!singleInstance) {
        app.quit();
    } else {
        const tray = new Tray(icon);
        const menu = Menu.buildFromTemplate([
            { label: "Light", click: light },
            { label: "Dark", click: dark },
            { label: "eGPU On", click: () => enableDevice() },
            { label: "eGPU Off", click: () => disableDevice() },
            { label: "Exit", click: exit },
        ]);
        tray.setContextMenu(menu);
    }
});
