import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
export class CharacterControls{

    //model and animation
    model;
    mixer;
    animationsMap;
    orbitControl;
    camera;
    meshtrace;
    boundingobjects;
    colliding=false;
    boundingbox;

    _startingMin=2;
    gameStarted=false;
    gameLost=false;
    gameWon=false;

    //state 
    toggleRun=true;
    currentAction;

    //temporary data
    walkDirection=new THREE.Vector3();
    rotateAngle=new THREE.Vector3(0,1,0);
    rotateQuaternion=new THREE.Quaternion();
    cameraTarget=new THREE.Vector3();

    //constants
    fadeDuration=0.2;
    runVelocity=0.8;
    walkVelocity=0.4;

    constructor(model,mixer,animationsMap,orbitControls,camera,currentAction,meshtrace,boundingobjects,modelBox){
        this.model=model;
        this.mixer=mixer;
        this.animationsMap=animationsMap;
        this.currentAction=currentAction;
        animationsMap.forEach((value,key) => {
            if(key==currentAction){
                value.play();
            }
        });
        this.orbitControl=orbitControls;
        this.camera=camera;
        this.meshtrace=meshtrace;
        this.boundingobjects=boundingobjects;

        this.boundingbox=modelBox;
    }

    switchRunToggle(){
        this.toggleRun=!this.toggleRun;
    }

    update(delta,keyPressed,timeElapsed){
        this._ComputeTime(timeElapsed);
        const directionPressed=this.directionPressed;

        var play='';
        if(directionPressed && this.toggleRun){
            play='Run';
        }else if(directionPressed){
            play='Walk';
        }else{
            play='Idle';
        }

        if(this.currentAction!=play){
            const toPlay=this.animationsMap.get(play);
            const current=this.animationsMap.get(this.currentAction);

            current.fadeOut(this.fadeDuration);
            toPlay.reset().fadeIn(this.fadeDuration).play();

            this.currentAction=play;
        }

        if(this.currentAction=='Run' || this.currentAction=='Walk'){
            //calculate towards camera direction
            var angleYcameraDirection=Math.atan2(
                (this.camera.position.x-this.model.position.x),
                (this.camera.position.z-this.model.position.z))

            //diagonal movement angle offset
             //console.log(keyPressed);
             var directionOffset=this._directionOffset(keyPressed);

             this.rotateQuaternion.setFromAxisAngle(this.rotateAngle,angleYcameraDirection+directionOffset);
             this.model.quaternion.rotateTowards(this.rotateQuaternion,0.2);

             //check for collision
             this._CheckCollision();

             if(this.colliding){
                 console.log("colliding");
             }else{
                //calculate diection
             this.camera.getWorldDirection(this.walkDirection);
             this.walkDirection.y=0;
             this.walkDirection.normalize();
             this.walkDirection.applyAxisAngle(this.rotateAngle,directionOffset);

             //run/walk velocity
             const velocity=this.currentAction=='Run'?this.runVelocity : this.walkVelocity;

             //move model & camera
             const moveX=this.walkDirection.x*velocity*delta;
             const moveZ=this.walkDirection.z*velocity*delta;
             this.model.position.x+=moveX;
             this. model.position.z+=moveZ;
             this._updateCameraTarget(moveX,moveZ);
             }

             

             //this.meshtrace.position.copy(this.camera.position);
             this.meshtrace.position.x=this.camera.position.x;
             this.meshtrace.position.z=this.camera.position.z;

             this.boundingbox=this.boundingbox.setFromObject(this.model);
     
        }

        this.mixer.update(delta);
    }

    _updateCameraTarget(moveX,moveZ){
        //move camera
        this.camera.position.x+=moveX;
        this.camera.position.z+=moveZ;

        //update camera target
        this.cameraTarget.x=this.model.position.x;
        this.cameraTarget.y=this.model.position.y+0.1;
        this.cameraTarget.z=this.model.position.z;
        this.orbitControl.target=this.cameraTarget;
    }

    _directionOffset(keyPressed){
        var directionOffset=0;//w
        //console.log(keyPressed);

        if(keyPressed.w){
            if(keyPressed.a){
                directionOffset= Math.PI/4//w+a
            }
            else if(keyPressed.d){
                directionOffset= - Math.PI/4//w+d
            }
            
        }
        else if(keyPressed.s){
            if(keyPressed.a){
                directionOffset= Math.PI/4 + Math.PI/2//s+a
            }else if(keyPressed.d){
                directionOffset= - Math.PI/4 - Math.PI/2//s+d
            }else{
                directionOffset=Math.PI//s
            }
        }
        else if(keyPressed.a){
            directionOffset= Math.PI/2//a
        }else if(keyPressed.d){
            directionOffset= - Math.PI/2//d
        }

        //console.log("this");
        return directionOffset;
    }

    _CheckCollision(){
        this.colliding=false;
        var direction = new THREE.Vector3();
        this.model.getWorldDirection(direction);
        direction.copy(direction.multiplyScalar(-1));
        var pointFront=new THREE.Vector3(0.01,0,0.01);
        pointFront.add(direction);
        pointFront.add(this.model.position);
        this.boundingobjects.forEach((item)=>{
            if(item.intersectsBox(this.boundingbox) && item.containsPoint(pointFront)){
              //count=true;
              this.colliding=true;
             // console.log(item," ",this.boundingbox);
            }
          });
    }

    //compute current time 
    _ComputeTime(timeElapsed){
        if(!this.gameLost && !this.gameWon){
            const startingMin=5;
            this._checktime=Math.floor(Math.abs(startingMin-timeElapsed/60))<10 ? "0"+ Math.floor(Math.abs(startingMin-timeElapsed/60 )).toString() : Math.floor(Math.abs(startingMin-timeElapsed/60) ).toString();
            this._checktime+=" : ";
            this._checktime+=Math.floor(59-timeElapsed % 60 )<10 ?"0"+ Math.floor(59 - timeElapsed % 60 ).toString() : Math.floor(59-timeElapsed % 60).toString();
      
            document.getElementById("timer").innerHTML=this._checktime;
      
  
        }
      this._CheckIfGameOver();
  
      }

      _CheckIfGameOver(){
        if(this._checktime=="00 : 00"){
            this.gameLost=true;
          }
      }


    
}