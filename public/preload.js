//Context isolation is even though preload and renderer have separate windows, context bridge can bridge it and send to the window of renderer
const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('cardData', {
    fetchCards: () => ipcRenderer.invoke('fetch-card-data'),
    saveCard: (cardInfo) => ipcRenderer.send('save-card', cardInfo)
})