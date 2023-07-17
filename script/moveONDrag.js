class Trigo{
  static obj={
      'cosec':'sin',
      'sec':'cos',
      'cot':'tan'
    };

  static filter(val,digit=16){
    digit=Math.pow(10,digit);
    return Math.round(val*digit)/digit;
  }

  static val(fn,deg,digit){
    if(Trigo.obj[fn]){
      return Trigo.filter(1/Math[Trigo.obj[fn]](deg*Math.PI/180),digit);
    }
    return Trigo.filter(Math[fn](deg*Math.PI/180),digit);
  }

  static fromVal(fn,val,digit){
    if(Trigo.obj[fn]){
      return Trigo.filter(1/Math['a'+Trigo.obj[fn]](val)*180/Math.PI,digit);
    }
    return Trigo.filter(Math['a'+fn](val)*180/Math.PI,digit);
  }
}

function moveElementWithMouse(element) {
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  element.addEventListener('mousedown', onMouseDown);
  element.addEventListener('mouseup', onMouseUp);

  element.addEventListener('touchstart', onTouchStart);
  element.addEventListener('touchend', onTouchEnd);

  function onMouseDown(event) {
    isDragging = true;
    offset = getOffset(event);
    window.addEventListener('mousemove', onMouseMove);
  }

  function onMouseMove(event) {
    if (!isDragging) return;
    const { clientX, clientY } = event;
    element.style.left = `${clientX - offset.x}px`;
    element.style.top = `${clientY - offset.y}px`;

    dragData(clientX,clientY);
  }

  function onMouseUp() {
    isDragging = false;
    window.removeEventListener('mousemove', onMouseMove);
  }

  function onTouchStart(event) {
    isDragging = true;
    offset = getOffset(event.touches[0]);
    window.addEventListener('touchmove', onTouchMove);
  }

  function onTouchMove(event) {
    if (!isDragging) return;
    const { clientX, clientY } = event.touches[0];
    element.style.left = `${clientX - offset.x}px`;
    element.style.top = `${clientY - offset.y}px`;

    dragData(clientX,clientY);
  }

  function onTouchEnd() {
    isDragging = false;
    window.removeEventListener('touchmove', onTouchMove);
  }

  function getOffset(event) {
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}


function dragData(x,y){
  var xy=round2d(Math.sqrt(x**2+(window.innerHeight-10 -y)**2));
  var angles=360 - calculateAngle(0,window.innerHeight - 10,x,y);

  var agl=op(".angleLine");
  agl.style.width=xy+'px';
  agl.style.transform=`rotate(${-angles}deg)`;
  makeData(angles,xy,x,window.innerHeight - 10-y);
}

var dataPan=op(".dataPan"),rlDataPan=op(".dataPanReal"),
pathLine=op("#path"),
rangeVal=op("#rangeVal");

function makeData(theta,u,ux,uy){
  window.g=10;
  window.scale=op("#scaleVal").value;
  window.theta=round2d(theta);
  window.u=round2d(u/scale);
  window.ux=round2d(ux/scale);
  window.uy=round2d(uy/scale);
  var data=`
  g = 10 m/s<sup>2</sup><br>
  θ<sub>u</sub> = ${window.theta}°<br>
  u = ${window.u} m/s<br>
  u<sub>x</sub> = ${window.ux} m/s<br>
  u<sub>y</sub> = ${window.uy} m/s<br>
  `;

  dataPan.innerHTML=data;
}



function shoot() {
  rangeVal.style.display='none';

  var realBall=op(".realBall");

  window.realBallPosi={
    x:0,
    y:0,
    shootTimems:0,
    totalTimems:2*uy/g*1000,
    range: (u**2)*Trigo.val('sin',2*theta,3)/g,
    pathPoints: '',
    range:round2d(u**2*Trigo.val('sin',2*theta,3)/g),
    hmax:round2d(uy**2/(2*g)),
  };


  var interval=setInterval(()=>{
    realBallPosi.x+=(ux*1/100);
    realBallPosi.shootTimems+=10;

    var t=realBallPosi.shootTimems/1000;
    realBallPosi.y=uy*t- (g*(t**2)/2);

    realBall.style.left=realBallPosi.x*scale+'px';
    realBall.style.bottom=realBallPosi.y*scale+'px';
    makeRealTimeData();

    realBallPosi.pathPoints+=" "+realBallPosi.x*scale+','+(window.innerHeight - (realBallPosi.y*scale))+" ";
    pathLine.setAttribute('points',realBallPosi.pathPoints);

    if(realBallPosi.y<=0){
      clearInterval(interval);
      makeFinalData();
    }
  },10)

}

function makeFinalData(){
  var data=`
  H<sub>max</sub> = ${round2d(uy**2/(2*g))}<br>
  Range = ${realBallPosi.range}<br>
  `
  rlDataPan.innerHTML+=data;

  rangeVal.style.display="block";
  rangeVal.setAttribute("max",realBallPosi.range);
  rangeVal.setAttribute("step",realBallPosi.range/1000);
  rangeVal.style.width=realBallPosi.range*scale+'px';
}


function makeRealTimeData(){
  var vy=uy - g*realBallPosi.shootTimems/1000;
  var theta2=Trigo.fromVal('tan',vy/ux,3);
  var data=`
H = ${round2d(realBallPosi.y)} m<br>
X = ${round2d(realBallPosi.x)} m<br>
θ<sub>v</sub> = ${theta2}°<br>
v<sub>x</sub> = ${round2d(ux)} m/s<br>
v<sub>y</sub> = ${round2d(vy)} m/s<br>
t = ${realBallPosi.shootTimems/1000} s<br>
  `
  rlDataPan.innerHTML=data;
}


function showDataAtRange(x) {
  var time=x/ux,
  cx=ux,
  cy=uy-g*time,
  ctheta=Trigo.fromVal('tan',cy/cx,3),
  H=uy*time-g*time*time/2;


  var data=`
H = ${round2d(H)} m<br>
X = ${round2d(x)} m<br>
θ<sub>v</sub> = ${ctheta}°<br>
v<sub>x</sub> = ${round2d(cx)} m/s<br>
v<sub>y</sub> = ${round2d(cy)} m/s<br>
t = ${round2d(time)} s<br>
H<sub>max</sub> = ${realBallPosi.hmax}<br>
Range = ${realBallPosi.range}<br>
  `
  rlDataPan.innerHTML=data;
}
function round2d(n){return Math.round(n*100)/100}

