import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js';

import {Maze1} from './maze3.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import {CharacterControls} from './CharacterControls.js';




let finish;

//////////////
let clouds = [], cloudMaterial, cloudgeo, rain, flash, raingeo, rainMaterial, rainCount = 15000;
let insertWidth, insertHeight;
let bgWind, bgFoot, bgTheme, light1;
//////////////

//load scene
const scene = new THREE.Scene();


//add camera (main/third person)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
//camera.position.set(0,0.5,0.2); original
//camera.lookAt(0,0.5,-0.2); original
//camera.position.set(-0.1,0.5,0.6);
camera.position.set(0,100,0);
camera.lookAt(0,0,0);
camera.name = "playerCam";

//add second camera (top view/map)
const cameraTop = new  THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
cameraTop.position.set(20,25,20);
cameraTop.lookAt(20,0,20);
cameraTop.name = "overheadCam";

scene.add(cameraTop);

scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.context.disable(renderer.getContext().DEPTH_TEST);

const orbitControls=new OrbitControls(camera,renderer.domElement);
orbitControls.enableDamping=true;
orbitControls.minDistance=-0.5;
orbitControls.maxDistance=0.5;
orbitControls.enablePan=false;
orbitControls.maxPolarAngle=Math.PI/2 -0.1;
orbitControls.update();
//renderer.shadowMap.type=THREE.BasicShadowMap;
document.body.appendChild( renderer.domElement );
//Resize the window
function OnWindowResize() 
{	
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);


//TOP VIEW CAM
insertWidth = window.innerWidth/6;
insertHeight = window.innerHeight/4;
cameraTop.aspect = insertWidth/insertHeight;
cameraTop.updateProjectionMatrix();

//console.log(window.innerWidth);
}
//Ambient Light and Directional Light
{
  const color = 'grey';
  const intensity = 1;
  const light = new THREE.AmbientLight(color, intensity);
  scene.add(light);
} 
{
  //const color1=0xFFFFFF;
  const color1="grey";
  const intensity1=0.5;
  light1 = new THREE.DirectionalLight(color1, intensity1);
  //light1.position.set(-3, 2, 4);
  light1.position.set(50, 10, 20);
  //light1.target.position.set(-3, 0, -3);
  light1.target.position.set(20, 0, 20);
  light1.castShadow = true;
  light1.shadow.camera.near=0.1;
  light1.shadow.camera.far=100;
  scene.add(light1);
  scene.add(light1.target);
}
{
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    './xneg_2.png',
    './xneg_2.png',
    './xneg_2.png',
    './xneg_2.png',
    './xneg_2.png',
    './xneg_2.png'
  ]);
  scene.background = texture;
}
const loader = new THREE.TextureLoader();
{
  
  const meshFloor=new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,10,10),
    //new THREE.MeshPhongMaterial({map: loader.load('floor.jpg')})
    //new THREE.MeshPhongMaterial({color: "white"})
    new THREE.MeshPhongMaterial({color: '#2C2D31'})
  );
  meshFloor.rotation.x-=Math.PI/2;
  meshFloor.receiveShadow = true;
  meshFloor.position.y = -1;
  scene.add(meshFloor);
}

//////////////////// AUDIO ////////////////////
{

  const listener = new THREE.AudioListener();
  cameraTop.add(listener); 

  const audloader = new THREE.AudioLoader();

  //Theme
  bgTheme = new THREE.Audio(listener);

  audloader.load("The Calm Unknown (loop) +Drums.mp3", function(buffer){
    bgTheme.setBuffer(buffer);
    bgTheme.setLoop(true);
    bgTheme.setVolume(0.2);
    bgTheme.play();
  });

  //footsteps
  bgFoot = new THREE.Audio(listener);

  audloader.load("Fantozzi-SandL1.mp3", function(buffer){
    bgFoot.setBuffer(buffer);
    bgFoot.setLoop(true);
    bgFoot.setVolume(0.3);
    //bgFoot.play();
  });

  //wind sound
  bgWind = new THREE.Audio(listener);

  audloader.load("AmbientNatureStormRainThunder.mp3", function(buffer){
    bgWind.setBuffer(buffer);
    bgWind.setLoop(true);
    bgWind.setVolume(0.5);
    //bgWind.play();
  });


}
//////////////////// AUDIO ////////////////////


//////////////////////////// RAIN AND CLOUDS ////////////////////////////////
scene.fog = new THREE.FogExp2(0x11111f, 0.002);
renderer.setClearColor(scene.fog.color);

flash = new THREE.PointLight(0xffffff, 0.5, 500);
flash.position.set(200,300,100);



//let loader = new THREE.TextureLoader();
loader.load("smoke.jpeg", function(texture){

  cloudgeo = new THREE.PlaneBufferGeometry(500,500);
  cloudMaterial = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true
  });

  for(let p=0; p<25; p++) {
    let cloud = new THREE.Mesh(cloudgeo,cloudMaterial);
    cloud.position.set(
      Math.random()*800 -400,
      500,
      Math.random()*500 - 450
    );
    cloud.rotation.x = 1.16;
    cloud.rotation.y = -0.12;
    cloud.rotation.z = Math.random()*360;
    cloud.material.opacity = 0.6;
    clouds.push(cloud);

    cloud.castShadow = true;

    scene.add(cloud);
  }
});

raingeo = new THREE.Geometry();
for(let i=0;i<rainCount;i++) {
  let rainDrop = new THREE.Vector3(
    Math.random() * 400 -390,
    Math.random() * 500 - 250,
    Math.random() * 400 - 200
  );

  rainDrop.velocity = {};
  rainDrop.velocity = 0;
  raingeo.vertices.push(rainDrop);
}

rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.15,
  transparent: true
});
rain = new THREE.Points(raingeo,rainMaterial);
rain.castShadow = true;
scene.add(rain);

//////////////////////////// RAIN AND CLOUDS ////////////////////////////////
let drawmaze=new Maze1({scene: scene});
//drawmaze._DrawMaze();
let maze=drawmaze.genMaze(-16.5,0,-17, "green");
maze.maze.position.set(0,0,0);
maze.maze.castShadow = true;
//maze.boundingbox.castShadow = true;
maze.maze.receiveShadow = true;
//maze.boundingbox.receiveShadow = true;
scene.add(maze.maze);
scene.add(maze.boundingbox);
maze.helper.forEach((item)=>{
  //scene.add(item);
})

const mesh=new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshPhongMaterial({
      color: "black",
  })
);
mesh.position.set(0,1.5,0);
mesh.scale.set(1,1,1);
scene.add(mesh);

var CharacterControls1;
var modelBox;
const loaderfbx=new GLTFLoader();
loaderfbx.setPath('./resources/');
loaderfbx.load('Soldier.glb',function(gltf){
  gltf.scene.traverse(function(any){
   any.castShadow=true;
  });
  gltf.scene.scale.set(0.2,0.2,0.2);
  gltf.scene.translateOnAxis(new THREE.Vector3(0,-0.5,1),2)
  scene.add(gltf.scene);
  const gltfanimations=gltf.animations;
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const animationsMap=new Map();
    gltfanimations.filter(a=>a.name!='TPose').forEach((a)=>{
        animationsMap.set(a.name,mixer.clipAction(a));
    })
    
    modelBox=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
    modelBox.setFromObject(gltf.scene);

    CharacterControls1=new CharacterControls(gltf.scene,mixer,animationsMap,orbitControls,camera,'Idle',mesh,maze.boundingbox,modelBox);
    CharacterControls1.startingMin=5;
  

})
var modelBoxCoin;
const CoinModel = new GLTFLoader();
CoinModel.setPath('./resources/stylized_coin/');
CoinModel.load('coin.gltf', function(stylized_coin){
  stylized_coin.scene.traverse(function(any){
    any.castShadow=true;
  });
  
  stylized_coin.scene.scale.set(1.5,1.5,1.5);
  stylized_coin.scene.rotateY(Math.PI/180);
  stylized_coin.scene.position.setX(36);
  stylized_coin.scene.position.setY(-1.5);
  stylized_coin.scene.position.setZ(38);
  scene.add(stylized_coin.scene);
  modelBoxCoin=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
  modelBoxCoin.setFromObject(stylized_coin.scene);
 
})

const keyPressed={};
document.addEventListener('keydown',(event)=>{
    if(event.shiftKey && CharacterControls1){
        //TOGGLE
        CharacterControls1.switchRunToggle();
    }else{
        keyPressed[event.key.toLowerCase()]=true;
        CharacterControls1.directionPressed= true;
        bgFoot.playbackRate = 1.2;
        bgFoot.play();
    }
    
},false);
document.addEventListener('keyup',(event)=>{
    keyPressed[event.key.toLowerCase()]=false;
    CharacterControls1.directionPressed= false;
    bgFoot.stop();
},false);



document.getElementById("play").addEventListener("click", function(){
  bgTheme.stop();
  bgWind.play();
  scene.add(flash);
  document.getElementById("startgamebody").style.visibility= 'hidden';
  document.getElementById("startgamebody").style.display= 'none';
  CharacterControls1.gameStarted=true;
});

window.onbeforeunload = function() {
  return "onbeforeunload";
}
//console.log(cube28);
let clock = new THREE.Clock();
function animate() {

    if(CharacterControls1 && CharacterControls1.gameStarted && !CharacterControls1.gameWon && !CharacterControls1.gameLost){
        let mixerDelta=clock.getDelta();
        let timeElapsed=clock.getElapsedTime();
        CharacterControls1.update(mixerDelta,keyPressed,timeElapsed);

        if(CharacterControls1.gameLost){
            document.getElementById("youlostbody").style.visibility= 'visible';
            document.getElementById("youlostbody").style.display= 'block';
            document.getElementById("restartlost").addEventListener("click", function(){
            document.getElementById("youlostbody").style.visibility= 'hidden';
            document.getElementById("youlostbody").style.display= 'none';
          });
          
        }
        if(CharacterControls1.boundingbox.intersectsBox(modelBoxCoin)){
          CharacterControls1.gameWon=true;
        }
       if(CharacterControls1.gameWon){
         //window.alert("You Won");
         document.getElementById("youwonbody").style.visibility= 'visible';
           document.getElementById("youwonbody").style.display= 'block';
           document.getElementById("restartwon").addEventListener("click", function(){
           document.getElementById("youwonbody").style.visibility= 'hidden';
           document.getElementById("youwonbody").style.display= 'none';
           CharacterControls1.gameStarted=false;
         });
         document.getElementById("nextgamewon").addEventListener("click", function(){
           document.getElementById("youwonbody").style.visibility= 'hidden';
           document.getElementById("youwonbody").style.display= 'none';
           CharacterControls1.gameStarted=false;
         });
         document.getElementById("quitwon").addEventListener("click", function(){
           document.getElementById("youwonbody").style.visibility= 'hidden';
           document.getElementById("youwonbody").style.display= 'none';
           CharacterControls1.gameStarted=false;
         });



       }
    }

    

  //////////////////// RAIN ANIME /////////////////////////
  clouds.forEach(p => {
    p.rotation.z -=0.002;
  });

  raingeo.vertices.forEach(p => {
    p.velocity -= 0.1 + Math.random() * 0.1;
    p.y += p.velocity;
    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  raingeo.verticesNeedUpdate = true;
  rain.rotation.y +=0.002;

  if(Math.random() > 0.93 || flash.power > 100) {
    if(flash.power < 100) 
      flash.position.set(
        Math.random()*400,
        300 + Math.random() *200,
        100
      );
    flash.power = 2 + Math.random() ;//* 100;
  }
//////////////////// RAIN ANIME /////////////////////////

//mzbb.copy(bbMesh.geometry.boundingBox).applyMatrix4(bbMesh.matrixWorld);
orbitControls.update();
requestAnimationFrame( animate );
  //if(count1){
  //  renderer.setAnimationLoop(null);
  //}else{

  renderer.setViewport(0,0, window.innerWidth, window.innerHeight);
  renderer.render( scene,camera );

  renderer.clearDepth();
  renderer.setScissorTest(true);

  renderer.setScissor(
    window.innerWidth - insertWidth - 16,
    window.innerHeight - insertHeight - 16,
    insertWidth, 
    insertHeight
  );

  renderer.setViewport(
    window.innerWidth - insertWidth - 16,
    window.innerHeight - insertHeight - 16,
    insertWidth, 
    insertHeight
  );

  renderer.render(scene, cameraTop);

  renderer.setScissorTest(false);
  
  //}
  

};
window.addEventListener('resize',OnWindowResize);
//function calls
OnWindowResize();
animate();
