import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/GLTFLoader.js';
import {Maze1} from './maze1.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

import {CharacterControls} from './CharacterControls.js';




let finish;

//////////////
let clouds = [], cloudMaterial, cloudgeo, rain, flash, raingeo, rainMaterial, rainCount = 15000;
let insertWidth, insertHeight;
let bgWind, bgFoot, bgTheme;
//////////////

//load scene
const scene = new THREE.Scene();



//add camera (main/third person)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
camera.position.set(2,1,0);
camera.lookAt(-1,1,0);
camera.name = "playerCam";

//add second camera (top view/map)
const cameraTop = new  THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);
cameraTop.position.set(0,20,0);
cameraTop.lookAt(0,0,0);
cameraTop.name = "overheadCam";
scene.add(cameraTop);
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.context.disable(renderer.getContext().DEPTH_TEST);

//MOUSE CONTROLS
const orbitControls=new OrbitControls(camera,renderer.domElement);
orbitControls.enableDamping=true;
orbitControls.minDistance=-0.5;
orbitControls.maxDistance=0.5;
orbitControls.enablePan=false;
orbitControls.maxPolarAngle=Math.PI/2 - 0.2;
orbitControls.update();
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


}
//Ambient Light and Directional Light
{
  const color = 'white';
  const intensity = 0.7;
  const light = new THREE.AmbientLight(color, intensity);
  scene.add(light);
}
//DIRECTINAL LIGHT
{
  const color1="brown";
  const intensity1=0.5;
  const light1 = new THREE.DirectionalLight(color1, intensity1);
  light1.position.set(25, 10, 0);
  light1.target.position.set(-3, 0, -3);
  light1.castShadow = true;
  light1.shadow.camera.near=0.1;
  light1.shadow.camera.far=100;
  scene.add(light1);
  scene.add(light1.target);
}
//SKYBOX
{
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    './goegap_1.png',
    './goegap_3.png',
    './goegap_5.png',
    './goegap_6.png',
    './goegap_2.png',
    './goegap_4.png'
  ]);
  scene.background = texture;
}
const loader = new THREE.TextureLoader();
{
  
  const meshFloor=new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,10,10),
    new THREE.MeshPhongMaterial({color: '#c2b280'})
  );
  meshFloor.rotation.x-=Math.PI/2;
  meshFloor.receiveShadow = true;
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
    bgFoot.setVolume(0.2);
    //bgFoot.play();
  });

  //wind sound
  bgWind = new THREE.Audio(listener);

  audloader.load("caravan.ogg.mp3", function(buffer){
    bgWind.setBuffer(buffer);
    bgWind.setLoop(true);
    bgWind.setVolume(0.6);
    //bgWind.play();
  });

}
//////////////////// AUDIO ////////////////////


//////////////////////////// RAIN AND CLOUDS ////////////////////////////////
let drawmaze=new Maze1({scene: scene});
drawmaze._DrawMaze();

const mesh=new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshPhongMaterial({
        color: "black",
    })
  );
  mesh.position.set(0,2,0);
  mesh.scale.set(1,1,1);
  scene.add(mesh);

// IMPORT CHARECTER MODEL
var CharacterControls1;
var modelBox;
var modelBoxCoin;
var mixer;
var anim1;
var animations={};
const loaderfbx=new GLTFLoader();
loaderfbx.setPath('./resources/');
loaderfbx.load('Soldier.glb',function(gltf){
  gltf.scene.traverse(function(any){
   any.castShadow=true;
  });
  gltf.scene.scale.set(0.2,0.2,0.2);
  //IMPORT COIN
  let coinPosition = [[-9.5,12.5],[18,-10],[-1,8.5],[-6,-9]]
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

var pos = coinPosition[getRandomInt(4)]; 
var coins;
const CoinModel = new GLTFLoader();
CoinModel.setPath('./resources/stylized_coin/');
CoinModel.load('coin.gltf', function(stylized_coin){
  stylized_coin.scene.traverse(function(any){
    any.castShadow=true;
  });
  
  stylized_coin.scene.scale.set(1.5,1.5,1.5);
  stylized_coin.scene.rotateY(Math.PI/180);
  stylized_coin.scene.position.setX(pos[0]);
  stylized_coin.scene.position.setY(-0.5);
  stylized_coin.scene.position.setZ(pos[1]);
  scene.add(stylized_coin.scene);
  modelBoxCoin=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
  modelBoxCoin.setFromObject(stylized_coin.scene);
 
})
  //console.log(gltf.scene);
  gltf.scene.translateOnAxis(new THREE.Vector3(0,0,0),2)

  
  scene.add(gltf.scene);
  
  const gltfanimations=gltf.animations;
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const animationsMap=new Map();
    gltfanimations.filter(a=>a.name!='TPose').forEach((a)=>{
        animationsMap.set(a.name,mixer.clipAction(a));
    })
    
    modelBox=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
    modelBox.setFromObject(gltf.scene);

    CharacterControls1=new CharacterControls(gltf.scene,mixer,animationsMap,orbitControls,camera,'Idle',mesh,drawmaze._boundingObjects,modelBox);
  

})

//IMPORT HOME
var house;
const HouseModel = new GLTFLoader();
HouseModel.setPath('./resources/cabinOne/');
HouseModel.load('scene.gltf', function(cabinOne){
  cabinOne.scene.traverse(function(any){
    any.castShadow=true;
  });
  
  cabinOne.scene.scale.set(0.15,0.15,0.15);
  cabinOne.scene.rotateY(Math.PI/180);
  cabinOne.scene.position.setX(-0.5);
  cabinOne.scene.position.setY(0.055);
  scene.add(cabinOne.scene);
  modelBox=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
  modelBox.setFromObject(cabinOne.scene);
 
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
  document.getElementById("startgamebody").style.visibility= 'hidden';
  document.getElementById("startgamebody").style.display= 'none';
  CharacterControls1.gameStarted=true;
});



let cube28=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
cube28.setFromObject(mesh);

//console.log(cube28);
let clock = new THREE.Clock();
function animate() {

        if(CharacterControls1 && CharacterControls1.gameStarted && !CharacterControls1.gameWon && !CharacterControls1.gameLost){
          let mixerDelta=clock.getDelta();
          let timeElapsed=clock.getElapsedTime();
          CharacterControls1.update(mixerDelta,keyPressed,timeElapsed);

          if(CharacterControls1.gameLost){
            //window.alert("You lost");
              document.getElementById("youlostbody").style.visibility= 'visible';
              document.getElementById("youlostbody").style.display= 'block';
              document.getElementById("restartlost").addEventListener("click", function(){
              document.getElementById("youlostbody").style.visibility= 'hidden';
              document.getElementById("youlostbody").style.display= 'none';
              CharacterControls1.gameStarted=false;
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
//////////////////// RAIN ANIME /////////////////////////


orbitControls.update();
requestAnimationFrame( animate );


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
  

  

};
window.addEventListener('resize',OnWindowResize);
OnWindowResize();
animate();
