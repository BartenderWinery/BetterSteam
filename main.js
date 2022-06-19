const{app,BrowserWindow,ipcMain}=require('electron')
require('electron-reload')(__dirname)
const path=require('path')

let win
async function createWindow(){
    win=new BrowserWindow({
        width: 580,
        height: 300,
        frame: false,
        webPreferences:{
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname,'preload.js')}})
        win.loadFile(path.join(__dirname,'index.html'))}
app.on("ready", createWindow)
ipcMain.on("minimize",(event,args)=>{win.getFocusedWindow().minimize()})
ipcMain.on("maximize",(event,args)=>{win.getFocusedWindow().maximize()})
ipcMain.on("close",(event,args)=>{win.getFocusedWindow().close()});