const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
const isDev = !app.isPackaged;

function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: "Flow State",
        width: 1500,
        height: 800,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    mainWindow.webContents.openDevTools();

    const startUrl = url.format({
        pathname: path.join(__dirname, './FlowReact/build/index.html'),
        protocol: 'file'
    });
    // Load the HTML file
    //if development then localhost, when production runs the url
    mainWindow.loadURL(
        isDev
        ? 'http://localhost:3000':
        startUrl
        );
}


app.whenReady().then(createMainWindow);
