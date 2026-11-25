/**
 * @type {CanvasRenderingContext2D}
 */
let drw=document.getElementById("graph").getContext("2d")

let graph=new OffscreenCanvas(640,480).getContext("2d")

function drawGraph(drw,f=fastWAct,startX=300,startY=30,w=30,
h=120,start=-6,end=6,spacing=2,step=1/1000,fontSize=10,
font="sans-serif",textStep=1.2,
precise=10,textStepY=0.5,textColor="#0084ff"){
    let textSh=startY+fontSize

let min=Infinity//(findMaxOnXY(f,start,end,0.1,4,100,false,1e-8)).v
let max=-Infinity//(findMaxOnXY(f,start,end,0.1,4,100,true,1e-8)).v
//11111111111111
let oldF=drw.font
let oldC=drw.fillStyle
let oldS=drw.strokeStyle
drw.font=`${fontSize}px ${font}`
drw.wordSpacing=`${spacing}px`
drw.fillStyle="#000000"
let y=0

let dots=[]
for(let d=start;d<end;d+=step){
    let v=f(d)
dots[dots.length]=[v,d]
if(v>max){
    max=v;
}
if(v<min){
    min=v;
}
}
let mx2=max
let min2=min
h/=(mx2-min2)
w/=(start-end)
console.log(textStepY)
textStepY*=(mx2-min2)
console.log(textStepY)
for(let d=0;d<dots.length;d++){
        let dot=dots[d]
    let dN=dot[1]
    let vN=dot[0]
    y=startY-vN*h
drw.fillStyle="#000000"
//    y=yB+(fastWAct(d+5/4)*2-1)*30
drw.fillRect(startX-dN*w,y,1,1)
}

for(let x=start;x<=end;x+=textStep){
  //  console.log(x)
       drw.fillStyle=textColor 
     drw.fillText(Math.round(x*precise)/precise,startX-(x)*w,textSh)
}
for(let y=min2;y<mx2;y+=textStepY){
    drw.fillStyle=textColor
   // console.log(y,min,mx2,textStepY)

    drw.fillText(Math.round(y*precise)/precise,startX,startY-y*h+fontSize)
}
drw.font=oldF
drw.fillStyle=oldC
drw.strokeStyle=oldS
return {min:min2,max:mx2}
}
function drawTuporadient(drw,f,w,h,startX,startY,fontSize,font,start,end,xw=0.1,yM=0.8,lineFillStyle="#E72042FA",startColor="#0011ff",
endColor="#5eff00",lineWidth=2,dotSize=4,maxY,minY,precise,step)
{//доп функция : рисует визуализацию тупорадиента, без рисования графика
    
let oldF=drw.font
let oldC=drw.fillStyle
let oldS=drw.strokeStyle

let mx2=maxY
let min2=minY

h/=(mx2-min2)
w/=(start-end)
    let textSh=startY+fontSize
    drw.fillStyle=lineFillStyle
drw.font=`${fontSize}px ${font}`
    
drw.fillText(Math.round(xw*precise)/precise,startX-xw*w,textSh- fontSize)
let xw2=xw*(1-yM)

drw.fillText(Math.round(xw2*precise)/precise,startX-xw2*w,textSh- fontSize)

let x1 = startX - xw * w;
let y1 = startY - f(xw) * h;

let x2 = startX - xw2  * w;
let y2 = startY - f(xw2)* h;

drw.beginPath();
drw.strokeStyle = lineFillStyle;
drw.lineWidth = lineWidth;
drw.moveTo(x1, y1);
drw.lineTo(x2, y2);
drw.stroke();
drw.closePath();

drw.fillStyle = startColor;
drw.fillRect(x1 - dotSize / 2, y1 - dotSize / 2, dotSize, dotSize);

drw.fillStyle = endColor;
drw.fillRect(x2 - dotSize / 2, y2 - dotSize / 2, dotSize, dotSize);

drw.fillStyle=lineFillStyle

drw.fillText(`Функция:${f.name}\n`,startX,textSh+fontSize)
drw.fillText(`Точка:${xw}\n`,startX,textSh+fontSize*3)
drw.fillText(`Шаг:${step}`,startX,textSh+fontSize*4)
drw.fillText(`Значение функции в точке:${f(xw)}\n`,startX,textSh+fontSize*5)
drw.fillText(`Значение в сдвинутой:${f(xw2)}\n`,startX,textSh+fontSize*6)
drw.fillText(`Тупорадиент:${f(xw)-f(xw2)}`,startX,textSh+fontSize*7)

drw.font=oldF
drw.fillStyle=oldC
drw.strokeStyle=oldS
return true;
}
function fastWAct(k){
    let m=k*(3-k)
    let d=m*m
    return d/(d+1)
}
let state={
    needRedraw:true,
    selectedF:"fastWact",
    selectedFFunc:fastWAct,
    x:0,
    y:0.1,
    speed:0.01,
    speedY:0.01,
    baseX:0,
    baseY:0
}
let settings={
    startX:300,
    startY:350,
    w:600,
    h:200,
    diaposon:[-8,8],
    stepDraw:0.00125,
    font:"sans-serif",
    lineFillStyle:"#E72042FA",
    dotStartC:"#0011ff",
    dotEndC:"#5eff00",
    textStep:1.2,
    lineWidth:2,
    precise:10,
    dotSize:4,
    textStepY:0.25,
    textColor:"#0084ff",
    resetYm:true
}
let cache={
    min:0,
    max:0
}
function render(startCycle,changeXYm=true){
    render.running=true
drw.clearRect(0,0,640,480)
if(state.needRedraw){
    graph.clearRect(0,0,640,480)
let d=drawGraph(
   graph,state.selectedFFunc,settings.startX,settings.startY,
    settings.w,settings.h,settings.diaposon[0],settings.diaposon[1],
    0,settings.stepDraw,10,settings.font,settings.textStep,settings.precise,
    settings.textStepY,settings.textColor
)
cache.min=d.min
cache.max=d.max
state.needRedraw=false
}
drw.drawImage(graph.canvas,0,0)

drawTuporadient(
    drw,state.selectedFFunc,settings.w,settings.h,
    settings.startX,settings.startY,10,"sans-serif",
    settings.diaposon[0],settings.diaposon[1],state.x,
    state.y,settings.lineFillStyle,settings.dotStartC,
    settings.dotEndC,settings.lineWidth,settings.dotSize,
    cache.max,cache.min,settings.precise,settings.stepDraw)
if(changeXYm){
    state.x+=state.speed
state.y+=state.speedY
if(state.x>settings.diaposon[1]){
    state.x=settings.diaposon[0]
    if(settings.resetYm){
        state.y=0
    }
}else if (state.x<settings.diaposon[0]){
    state.x=settings.diaposon[1]
  if(settings.resetYm){
        state.y=0
    }
}
}
if(startCycle){
last=requestAnimationFrame(render)
}else{
    render.running=false
}

}
function downloadData(data, filename = 'save.json',type) {
    let blob=new Blob([data],{type:type})
    let url=URL.createObjectURL(blob)
    let a=document.createElement("a")
    a.href=url
    console.log(a)
    a.download=filename
    a.click()
}
let funcs={
    fastWAct:fastWAct,
    tanh:Math.tanh,
    sin:Math.sin,
    cos:Math.cos,
    parobola:x=>x**2-x-1,//!--да,это паробала которая создает число золотого сечения!-->
    sqrt:Math.sqrt,
    abs:Math.abs,
    exp:Math.exp,
    log:Math.log,
    sigmoid:x=>1/(1+Math.exp(-x)),
    relu:x=>Math.max(0,x),
    identity: x => x,
neg: x => -x,
cube: x => x**3,
softplus: x => Math.log1p(Math.exp(x)),
elu: x => x >= 0 ? x : Math.expm1(x),
}
function changeFunc(val){
    state.needRedraw=true
    state.selectedF=val
    state.selectedFFunc=funcs[val]
}
function coolSettings(){
    state.speed=document.getElementById("speed").valueAsNumber///<input id="speed" type="text" value="100" class="fixed-input fw50">
    state.speedY=document.getElementById("speedY").valueAsNumber //Скорость по y<input id="speedY" type="number" value="20" class="fixed-input fw50" >
    settings.diaposon[0]=document.getElementById("start").valueAsNumber              //Начало графика по x:<input id="start" type="text" value="0.5" class="fixed-input fw50" >
    settings.diaposon[1]=document.getElementById("end").valueAsNumber//ntBu                //Конец графика по x<input id="end" type="number" step="0.1" value="0.7" class="fixed-input fw50" >
    settings.textStep=document.getElementById("textStep").valueAsNumber//Шаг сетки по x<input id="stepDraw" type="text" value="3" class="fixed-input fw50">
    settings.textStepY=document.getElementById("textStepY").valueAsNumber//Шаг сетки по y<input id="stepDrawY" type="checkbox">
    settings.stepDraw=document.getElementById("stepDraw").valueAsNumber              //Ресетить ли yMul если вылетел за пределы начала графика?<input id="resetYm" type="checkbox" checked="true">
    settings.resetYm=document.getElementById("resetYm").checked              //Ресетить ли yMul если вылетел за пределы начала графика?<input id="resetYm" type="checkbox" checked="true">
    settings.precise=Math.round((10**document.getElementById("precise").valueAsNumber))
    state.needRedraw=true
}