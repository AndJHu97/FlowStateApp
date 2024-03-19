const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: "Flow State",
        width: 1500,
        height: 800
    });

    // Load the HTML file
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}


app.whenReady().then(createMainWindow);
 