const{app,BrowserWindow,ipcMain}=require("electron")
//require("electron-reload")(__dirname)
require("electron-reload")(__dirname, {
    electron:require(`${__dirname}/node_modules/electron`)})
const path=require("path")
const fs=require("fs")

var win=[]
function popout(bounds,page){
    win[win.length]=new BrowserWindow({
        width:bounds[0],
        height:bounds[1],
        frame:false,
        show:false,
        backgroundColor:"#383838",
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            enableRemoteModule:false,
            preload:path.join(__dirname,"preload.js")}})
        win[win.length-1].loadFile(path.join(__dirname,page))
        setTimeout(function(){win[win.length-1].show()}),500}
async function main(){popout([580,300],"index.html")}
app.on("ready",main)
var rcon={
    verify:function(path,keyword){fs.access(path,fs.constants.R_OK|fs.constants.W_OK,(err,data)=>{if(data.includes(keyword)){return true}})},
    inject:function(path,k,d){}}
ipcMain.on("minimize",()=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",()=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",()=>{BrowserWindow.getFocusedWindow().close()})
ipcMain.on("popout",()=>{popout([400,220],"resources/install.html")})
ipcMain.on("build",(events,args)=>{
    fs.access(args,fs.constants.R_OK|fs.constants.W_OK,(err,data)=>{
        if(!err){
            BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Build dictionary verified.');document.activeElement.parentElement.innerText='"+args+"';document.activeElement.value=''")
            rcon.inject("D:/Steam/resource/menus/steam.menu")
            //BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Steam modified; Appended script');document.body.children[1].children[1].children[1].children[0].style.color='#00eb00'")
            //BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Steamui modified; Injected script');document.body.children[1].children[1].children[1].children[1].style.color='#00eb00'")
            //BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Tenfoot modified; Injected script');document.body.children[1].children[1].children[1].children[7].style.color='#00eb00'")
            return}
        BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log(\"Build dictionary wasn't found, please check the path.\");document.activeElement.value=''")})})