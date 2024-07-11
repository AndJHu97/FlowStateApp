
const { app, BrowserWindow, ipcMain } = require('electron')
const electronReload = require('electron-reloader');
const path = require('path');
const fs = require('fs');

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })




  //load the index.html from a url
  win.loadURL('http://localhost:3000');
  //win.loadFile('/src/Pages/Main.tsx')

  // Open the DevTools.
  win.webContents.openDevTools()
}
console.log("test")
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Get the card data in deck
ipcMain.handle('fetch-card-data', (event) => {
  //this is where all the cards are stored
  const directoryPath = path.join(__dirname, '..', 'src', 'cardData');

  //try readdirSync
  try {
    const fileNames = fs.readdirSync(directoryPath);
    console.log("Files in directory:", fileNames);
  
    // Filter out only .json files
    const jsonFiles = fileNames.filter(fileName => fileName.endsWith('.json'));
    console.log("JSON files:", jsonFiles);
  
    // Read and parse each filename to get the JSON info
    const cardData = jsonFiles.map(fileName => {
      //get the filename to get directory
      const filePath = path.join(directoryPath, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      console.log(`Content of ${fileName}:`, fileContent);
      // Parse JSON content
      const jsonData = JSON.parse(fileContent);
      console.log(`Parsed data from ${fileName}:`, jsonData);
      return jsonData; // Return parsed JSON data to cardData
    });

    console.log("Card data:", cardData);
    return cardData; // Return the array of parsed JSON objects
  } catch (error) {
    console.error("Error reading directory:", error);
    return []; // Return an empty array or handle the error as needed
  }
});

  //save-card from NewCardPage
  ipcMain.on('save-card', (event, cardInfo) => {
    //this is where all the cards are stored
    const directoryPath = path.join(__dirname, '..', 'src', 'CardData');
    const directoryImagePath = path.join(__dirname, '..', 'src', 'CardImages');
    const {title, description, note, image } = cardInfo;
    console.log('Received card info:', cardInfo); // Check what properties are present
    
    // Save image file to cardData directory
    const imageFileName = `${title.replace(/\s+/g, '-')}.jpg`; // Example: converting title to filename
    const imagePath = path.join(directoryImagePath, imageFileName);

   // Decode base64 image data (if necessary)
   const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
   const buffer = Buffer.from(base64Data, 'base64');

   // Write image file
   fs.writeFile(imagePath, buffer, (err) => {
       if (err) {
           console.error('Error saving image:', err);
           event.reply('save-card-error', err.message); // Send error message back to renderer process
           return;
       }
       console.log('Image saved successfully:', imagePath);

       // Save metadata (title, description, note) to a JSON file
       const metaData = {
           title,
           description,
           note,
           image: imagePath // Store the path to the image file
       };
       const metaDataPath = path.join(directoryPath, `${title.replace(/\s+/g, '-')}.json`);

       fs.writeFile(metaDataPath, JSON.stringify(metaData), (err) => {
           if (err) {
               console.error('Error saving metadata:', err);
               event.reply('save-card-error', err.message); // Send error message back to renderer process
               return;
           }
           console.log('Metadata saved successfully:', metaDataPath);
           event.reply('save-card-success', metaData); // Send success message and metadata back to renderer process
       });
   });
});
