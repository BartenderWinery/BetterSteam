const {
    contextBridge,
    ipcRenderer
} = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            let validChannels = "minimize;maximize;close;popout;modify;verify;mod;reboot";
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)}},})