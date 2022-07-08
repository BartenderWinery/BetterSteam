const{app,BrowserWindow,ipcMain}=require("electron")
const fs=require("fs")

//require("electron-reload")(__dirname)
//require("electron-reload")(__dirname, {
//    electron:require(`${__dirname}/node_modules/electron`)})

//create loading screen later
//file method doesnt work, use local file path instead.
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
            preload:(__dirname+"/preload.js")}})
        win.loadFile(__dirname+"/"+page)
        setTimeout(function(){win.show()}),500}
async function main(){
    popout([580,300],"index.html")
    fs.readFile(__dirname+"/config/app.txt",(e,data)=>{
        if(e||!String(data).includes("active")){
            BrowserWindow.getAllWindows()[0].webContents.executeJavaScript("dis()")
            fs.appendFile(__dirname+"/config/app.txt",";active",(e)=>{if(e)return})}})}
app.on("ready",main)
var sys={
    callback:function(i){
        return BrowserWindow.getAllWindows().find(win=>win.getTitle()==i)},
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
ipcMain.on("reboot",()=>{
    app.relaunch()
	app.exit(0)})
ipcMain.on("verify",()=>{
    fs.readFile(__dirname+"/config/path.txt",(e,d)=>{
        if(e||!d){
            sys.callback("Install for Steam").webContents.executeJavaScript("log(\"No API access detected, Build required.\")")
            return}
        fs.readdir(__dirname+"/resources/libraries",(e,lib)=>{
            if(e)return
            for(var i=0;i<lib.length;i++)
                fs.readFile(__dirname+"/resources/libraries/"+lib[i],'utf8',(e,dat)=>{
                    if(e)return
                    var j=JSON.parse(dat)
                    fs.readFile(d+j["path"],(e,data)=>{
                        if(e)return
                        if(String(data).includes("<meta bettersteam>")){
                            var ids=j["success"]["ids"].split(";")
                            for(var i=0;i<ids.length;i++)
                                sys.callback("Install for Steam").webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='#00eb00'")}})})})})})
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
                    sys.callback("Install for Steam").webContents.executeJavaScript("log(\"Build dictionary wasn\'t found, please check the path.\");document.activeElement.value=''")
                    return}
                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Build dictionary verified.',''])")
                sys.callback("Install for Steam").webContents.executeJavaScript("log(\"Build dictionary verified.\")")
                fs.readdir(__dirname+"/resources/libraries",function(e,lib){
                    var j,file,c
                    if(e){
                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Library failure, please vaildate your files.'])")
                        return}
                    for(var i=0;i<lib.length;i++){
                        file=lib[i]
                        fs.readFile(__dirname+"/resources/libraries/"+file,'utf8',(e,data)=>{
                            if(e){
                                wins.at(-1).webContents.executeJavaScript("SYS.compile(['Failure, please check permissions.'])")
                                return}
                            j=JSON.parse(data)
                            var ids=j["success"]["ids"].split(";")
                            if(sys.overwrite(args[1]+j["path"],j[args[0]].replace("{PATH}","/"+file.split(".")[0]+".js"))){
                                switch(args[0]){
                                    case "uninstall":
                                        fs.writeFile(__dirname+"/config/path.txt","",(e)=>{
                                            if(e)return})
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam modifications uninstalled; Files recovered'])")
                                        c="red"
                                        break
                                    case "install":
                                        fs.writeFile(__dirname+"/config/path.txt",args[1],(e)=>{
                                            if(e)return})
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['Steam has been successfully modified'])")
                                        sys.callback("Install for Steam").webContents.executeJavaScript("log('"+j["success"]["log"]+"');document.activeElement.value='';document.activeElement.parentElement.innerText='"+args[1]+"'")
                                        wins.at(-1).webContents.executeJavaScript("SYS.compile(['"+j["success"]["log"]+"'])")
                                        c="#00eb00"
                                        break}
                                for(var i=0;i<ids.length;i++)
                                    sys.callback("Install for Steam").webContents.executeJavaScript("document.body.children[1].children["+ids[i][0]+"].children[1].children["+ids[i][2]+"].style.color='"+c+"'")
                                fs.readdir(__dirname+"/mods",function(e,pack){
                                    if(e)return
                                    for(var i=0;i<pack.length;i++){
                                        var mod=pack[i]
                                        var json,dat
                                        fs.readFile(__dirname+"/mods/"+mod,(e,d)=>{
                                            if(e)return
                                            json=JSON.parse(d)
                                            dat=Object.keys(json)
                                            for(var _i=0;_i<dat.length;_i++){
                                                var p=args[1]+j["path"].replace(j["path"].split("/").at(-1),file.split(".")[0]+".js")
                                                switch(args[0]){
                                                    case "install":
                                                        fs.appendFile(p,json[dat[_i]],(e)=>{
                                                            if(e)return})
                                                        return
                                                    case "uninstall":
                                                        fs.unlink(p,(e)=>{
                                                            if(e)return})
                                                        return}}})}})}})}})})}})