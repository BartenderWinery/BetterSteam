const{app,BrowserWindow,ipcMain}=require("electron")
const path=require("path")
const fs=require("fs")
//Important. Clean up imports so it doesn't slow down loading times.

//require("electron-reload")(__dirname)
//require("electron-reload")(__dirname, {
//    electron:require(`${__dirname}/node_modules/electron`)})

function popout(bounds,page){
    var win=new BrowserWindow({
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
        win.loadFile(path.join(__dirname,page))
        setTimeout(function(){win.show()}),500}
async function main(){
    popout([580,300],"index.html")
    fs.readFile(path.join(__dirname,"config/app.txt"),'utf8',(e,data)=>{
        if(e)return
        if(!String(data).includes("active")){
            BrowserWindow.getAllWindows()[0].webContents.executeJavaScript("dis()")
            fs.appendFile(path.join(__dirname,"config/app.txt"),";active",(e)=>{if(e)return})}})}
app.on("ready",main)
var sys={
    inject:function(path,k,d){
        try{
            fs.readFile(path,'utf8',(e,data)=>{
                if(e)return
                //Change comments to start/end comments per line to reserve comments instead of removing them
                var pack=data.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').replace(/[\r\n]+/g,"")
                fs.writeFile(path,pack.replace(k,d),(e)=>{
                    if(e)return})})
            return true
        }catch(e){}},
    overwrite:function(path,d){
        try{
            fs.writeFile(path,d,(e)=>{
                if(e)return}) 
            return true
        }catch(e){}}}
ipcMain.on("minimize",()=>{BrowserWindow.getFocusedWindow().minimize()})
ipcMain.on("maximize",()=>{BrowserWindow.getFocusedWindow().maximize()})
ipcMain.on("close",()=>{BrowserWindow.getFocusedWindow().close()})
ipcMain.on("popout",(events,args)=>{popout([400,220],args)})
ipcMain.on("modded",(events,args)=>{
    fs.readdir(path.join(__dirname+"/mods"),function(e,lib){
        if(e)return
            for(var i=0;i<lib.length;i++){
                fs.readFile(path.join(__dirname+"/mods/"+lib[i]),'utf8',(e,dat)=>{
                    if(e)return
                        })}})})
    //BrowserWindow.getAllWindows()[0].webContents.executeJavaScript()
ipcMain.on("verify",()=>{
    var wins=BrowserWindow.getAllWindows()
    fs.readFile(path.join(__dirname+"/config/path.txt"),'utf8',(e,d)=>{
        if(e||!d){wins.at(0).webContents.executeJavaScript("log(\"No API access detected, Build required.\")");return}
        fs.readdir(path.join(__dirname+"/resources/libraries"),function(e,lib){
            if(e){
                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Library failure, please vaildate your files.'])")
                return}
            for(var i=0;i<lib.length;i++){
                fs.readFile(path.join(__dirname+"/resources/libraries/"+lib[i]),'utf8',(e,dat)=>{
                    if(e){
                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Failure, please check permissions.'])")
                        return}
                    var j=JSON.parse(dat)
                    fs.readFile(path.join(d+j["path"]),(e,data)=>{
                        if(e)return
                        if(String(data).includes("<meta bettersteam>")){
                            var ids=j["success"]["ids"].split(";")
                            for(var i=0;i<ids.length;i++){
                                    wins[0].webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='#00eb00'")}}})})}})})})
ipcMain.on("modify",(events,args)=>{
    switch(args[0],args[1]){
        case "install","undefined":
            popout([400,220],"resources/install.html")
            return
        default:
            var wins=BrowserWindow.getAllWindows()
            fs.access(args[1],fs.constants.R_OK|fs.constants.W_OK,(e,d)=>{
                if(e){
                    wins.at(-1).webContents.executeJavaScript("SYS.compile(['Build dictionary wasn't found, please check the path.',''])")
                    wins[0].webContents.executeJavaScript("log(\"Build dictionary wasn\'t found, please check the path.\");document.activeElement.value=''")
                    return}
                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Build dictionary verified.',''])")
                wins[0].webContents.executeJavaScript("log(\"Build dictionary verified.\")")
                fs.readdir(path.join(__dirname+"/resources/libraries"),function(e,lib){
                    if(e){
                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Library failure, please vaildate your files.'])")
                        return}
                    for(var i=0;i<lib.length;i++){
                        fs.readFile(path.join(__dirname+"/resources/libraries/"+lib[i]),'utf8',(e,data)=>{
                            if(e){
                                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Failure, please check permissions.'])")
                                return}
                            var j=JSON.parse(data)
                            var ids=j["success"]["ids"].split(";")
                            if(sys.overwrite(args[1]+j["path"],j[args[0]])){
                                switch(args[0]){
                                    case "uninstall":
                                        fs.writeFile(path.join(__dirname+"/config/path.txt"),"",(e)=>{
                                            if(e)return})
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam modifications uninstalled; Files recovered'])")
                                        if(wins[0])
                                            for(var i=0;i<ids.length;i++){
                                                wins[0].webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='red'")}
                                        break
                                    case "install":
                                        fs.writeFile(path.join(__dirname+"/config/path.txt"),args[1],(e)=>{
                                            if(e)return})
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam has been successfully modified'])")
                                        wins[0].webContents.executeJavaScript("log('"+j["success"]["log"]+"');"+(wins[0].getTitle()=="Install for Steam"?"document.activeElement.value='';document.activeElement.parentElement.innerText='"+args[1]+"'":""))
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['"+j["success"]["log"]+"'])")
                                        for(var i=0;i<ids.length;i++){
                                            if(wins[0])wins[0].webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='#00eb00'")}
                                        break}
                                return}})}})})}})
    
//replace <script injected>(keep name attrbute) and </script injected> with | and split; move to index 1 and you have your index