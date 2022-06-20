const{app,BrowserWindow,ipcMain}=require('electron')
require('electron-reload')(__dirname)
//require('electron-reload')(__dirname, {
//    electron: require(`${__dirname}/node_modules/electron`)})
const path=require('path')

let win
async function createWindow(){
    win=new BrowserWindow({
        width: 580,
        height: 300,
        frame: false,
        show: false,
        webPreferences:{
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname,'preload.js')}})
        win.loadFile(path.join(__dirname,'index.html'))
        setTimeout(function(){win.show()}),500}
app.on("ready", createWindow)
ipcMain.on("minimize",(event,args)=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",(event,args)=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",(event,args)=>{BrowserWindow.getFocusedWindow().close()})