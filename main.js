const{app,BrowserWindow,ipcMain}=require("electron")
const path=require("path")
const fs=require("fs")
//require("electron-reload")(__dirname)
require("electron-reload")(__dirname, {
    electron:require(`${__dirname}/node_modules/electron`)})

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
        }catch(e){}},
    overwrite:function(path,d){
        fs.writeFile(path,d,(err)=>{
            if(err)return})}}
ipcMain.on("minimize",()=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",()=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",()=>{BrowserWindow.getFocusedWindow().close()})
ipcMain.on("popout",(events,args)=>{popout([400,220],args)})

    //create callback function to update the other if one is executed, such as uninstaller decolorizing APIs dyanmically if install is open
ipcMain.on("modify",(events,args)=>{
    switch(args[0]){
        case "uninstall":
            rcon.overwrite(args[1]+"/steamui/index.html","<!doctype html><html style=\"width: 100%; height: 100%\"><head><title>Steam</title><meta charset=\"utf-8\"><link href=\"/css/library.css\" rel=\"stylesheet\"></head><body style=\"width: 100%; height: 100%; margin: 0; overflow: hidden;\"><div id=\"root\" style=\"height:100%; width: 100%\"></div><div style=\"display:none\"></div><script src=\"/libraries/libraries.js\"></script><script src=\"/libraries/libraries_cm.js\"></script><script src=\"/library.js\"></script></body></html>");return
        case "install":
            if(args[1]=="undefined"){popout([400,220],"resources/install.html");return}
            fs.access(args[1],fs.constants.R_OK|fs.constants.W_OK,(err,data)=>{
            if(err){BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log(\"Build dictionary wasn't found, please check the path.\");document.activeElement.value=''");return}
                BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Build dictionary verified.');document.activeElement.parentElement.innerText='"+args[1]+"';document.activeElement.value=''")
                if(rcon.inject(args[1]+"/steamui/index.html","</body>","<div id=\"debug\" style=\"position:absolute;height:100%;width:400px;right:0;top:0\"></div><script>function traceMethodCalls(obj){;return new Proxy(obj, {get(target, methodName, receiver) {const originMethod = target[methodName];return function(...args) {document.body.children[\"debug\"].insertAdjacentHTML(\"afterbegin\",\"<p style='font-size:10px;margin:0;text-align:right;color:red;white-space:nowrap'>\"+args+\"</p>\");return originMethod.apply(this, args);}}})}console = traceMethodCalls(console)</script></body>"))
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript("log('Steamui modified;Dev-only currently');document.body.children[1].children[1].children[1].children[1].style.color='#00eb00'")})
        case "mod":
            }})

//replace <script injected>(keep name attrbute) and </script injected> with | and split; move to index 1 and you have your index