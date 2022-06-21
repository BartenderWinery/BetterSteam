const{app,BrowserWindow,ipcMain}=require("electron")
//require("electron-reload")(__dirname)
require("electron-reload")(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)})
const path=require("path")

var win=[]
function popout(bounds,page){
    win[win.length]=new BrowserWindow({
        width: bounds[0],
        height: bounds[1],
        frame: false,
        show: false,
        webPreferences:{
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname,"preload.js")}})
        win[win.length-1].loadFile(path.join(__dirname,page))
        setTimeout(function(){win[win.length-1].show()}),500}
async function main(){popout([580,300],"index.html")}
app.on("ready",main)
ipcMain.on("minimize",(event,args)=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",(event,args)=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",(event,args)=>{BrowserWindow.getFocusedWindow().close()})
ipcMain.on("popout",(event,args)=>{popout([400,220],"resources/install.html")})