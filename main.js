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
    inject:function(path,k,d){
        try{
            fs.readFile(path,'utf8',(err,data)=>{
                if(err)return
                //Change comments to start/end comments per line to reserve comments instead of removing them
                var pack=data.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').replace(/[\r\n]+/g,"")
                fs.writeFile(path,pack.replace(k,d),(err)=>{
                    if(err)return})})
            return true
        }catch(e){}}}
ipcMain.on("minimize",()=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",()=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",()=>{BrowserWindow.getFocusedWindow().close()})
ipcMain.on("popout",()=>{popout([400,220],"resources/install.html")})

//CONVERT INTO POLYTHESIM OR FUNCTION FOR PERFORMANCE
    //create callback function to update the other if one is executed, such as uninstaller decolorizing APIs dyanmically if install is open
ipcMain.on("build",(events,args)=>{
    fs.access(args,fs.constants.R_OK|fs.constants.W_OK,(err,data)=>{
        if(err){BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log(\"Build dictionary wasn't found, please check the path.\");document.activeElement.value=''");return}
            BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Build dictionary verified.');document.activeElement.parentElement.innerText='"+args+"';document.activeElement.value=''")
            if(rcon.inject(args+"/steamui/index.html","</body>","<div id=\"debug\" style=\"position:absolute;height:100%;width:400px;right:0;top:0\"></div><script>function traceMethodCalls(obj){;return new Proxy(obj, {get(target, methodName, receiver) {const originMethod = target[methodName];return function(...args) {document.body.children[\"debug\"].insertAdjacentHTML(\"afterbegin\",\"<p style='font-size:10px;margin:0;text-align:right;color:red;white-space:nowrap'>\"+args+\"</p>\");return originMethod.apply(this, args);}}})}console = traceMethodCalls(console)</script></body>"))
                BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Steamui modified;Dev-only currently');document.body.children[1].children[1].children[1].children[1].style.color='#00eb00'")})})
ipcMain.on("uninstall",(events,args)=>{
    fs.access(args,fs.constants.R_OK|fs.constants.W_OK,(err,data)=>{
        if(err){BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log(\"Built dictionary wasn't found, please check the path.\");document.activeElement.value=''");return}
            BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Built dictionary verified.');document.activeElement.parentElement.innerText='"+args+"';document.activeElement.value=''")
            if(rcon.inject(args+"/steamui/index.html","<div id=\"debug\" style=\"position:absolute;height:100%;width:400px;right:0;top:0\"></div><script>function traceMethodCalls(obj){;return new Proxy(obj, {get(target, methodName, receiver) {const originMethod = target[methodName];return function(...args) {document.body.children[\"debug\"].insertAdjacentHTML(\"afterbegin\",\"<p style='font-size:10px;margin:0;text-align:right;color:red;white-space:nowrap'>\"+args+\"</p>\");return originMethod.apply(this, args);}}})}console = traceMethodCalls(console)</script></body>","</body>"))
                BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Steamui recovered');document.body.children[1].children[1].children[1].children[1].style.color='red'")})})