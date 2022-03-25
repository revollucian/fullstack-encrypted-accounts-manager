const { app, BrowserWindow } = require('electron')


const createWindow = () => {
    const win = new BrowserWindow({
      autoHideMenuBar: true,
      width: 1000,
      height: 1000
    })
  
    win.loadFile('index.html')
  }
  

  app.whenReady().then(() => {
    createWindow()
  })