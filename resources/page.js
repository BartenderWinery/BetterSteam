window.onload=function(){
    if(navigator.userAgent.includes("Electron")){
        var p=document.createElement("style")
        p.appendChild(document.createTextNode(".desktop{display:flex}"))
        p.appendChild(document.createTextNode(".web{display:none}"))
        document.head.appendChild(p)
    }else{
        setTimeout(function(){SYS.compile(["Unfortunally, it doesn't seem like you have installed the application",])},10000)
        setTimeout(function(){SYS.compile(["If you're not sure, you can install it here: https://somewebsite.com/install",""])},12000)}}
function dis(){
    setTimeout(function(){SYS.compile(["Welcome to BetterSteam, you can edit how your steam behaves or looks here!"])},500)
    setTimeout(function(){SYS.compile(["","To get started, you can click the first button in the row to the left"])},3000)
    setTimeout(function(){SYS.compile(["You can find themes and plugins here: https://somewebsite.com/"])},5500)
    setTimeout(function(){SYS.compile(["It's suggested that you understand CSS before continuing to edit values in the menu yourself",""])},7500)
    setTimeout(function(){SYS.compile(["Unfortunally, we do not have a solution to force update the steam client yet."])},9500)
    setTimeout(function(){SYS.compile(["This means you have to log out of steam and then install it while on the login prompt.",""])},10000)}
var API={
    menu:function(e){
        if(e.children[3].style.width!="95px"){
            e.children[2].style.width="0"
            e.children[3].style.width="95px"
        }else{
            e.children[2].style.width="15px"
            e.children[3].style.width="0px"}}}