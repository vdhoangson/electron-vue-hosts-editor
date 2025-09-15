const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  readHosts: () => ipcRenderer.invoke("read-hosts"),
  writeHosts: (content) => ipcRenderer.invoke("write-hosts", content),
  // Subscribe to hosts pushed from the main process when the window loads
  onHostsLoaded: (callback) => {
    const listener = (event, data) => callback(data);
    ipcRenderer.on("hosts-loaded", listener);
    return () => ipcRenderer.removeListener("hosts-loaded", listener);
  },
  // Menu actions
  onMenuNewEntry: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("menu-new-entry", listener);
    return () => ipcRenderer.removeListener("menu-new-entry", listener);
  },
  onMenuSave: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("menu-save", listener);
    return () => ipcRenderer.removeListener("menu-save", listener);
  },
  onMenuReload: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("menu-reload", listener);
    return () => ipcRenderer.removeListener("menu-reload", listener);
  },
});
