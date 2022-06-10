import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


//Draw Maze
class Maze1{
    constructor(params){
        this._params=params;
        this._boundingObjects=[];
        this._loader = new THREE.TextureLoader();
        this._makewalla=this._MakeWall();
    }
    _DrawMaze(){
        this._levelOne();
    }

    _MakeWall(){
        const tiltwallshape=new THREE.Shape();
        tiltwallshape.moveTo(0,0);
        tiltwallshape.lineTo(1,0);
        tiltwallshape.lineTo(1,1);
        tiltwallshape.lineTo(0,1);
    
        const titlwallgeometry=new THREE.ExtrudeBufferGeometry([tiltwallshape],{
            steps:1,
            depth: 1,
            bevelEnabled: false,
              bevelThickness: 0,
            bevelOffset:0
              
        });
    
        let Mesh=new THREE.Mesh(titlwallgeometry,new THREE.MeshBasicMaterial({ map: this._loader.load('stone.jpg')}));
        Mesh.castShadow=true;
        Mesh.receiveShadow=true;
        return Mesh
    }
    



    _block(x,z){
            const wall1=this._makewalla.clone();
            wall1.position.set(x,0,z);
            this._params.scene.add(wall1);
            //console.log("after",wall1.position);
            let cube1=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
            cube1.setFromObject(wall1);
            this._boundingObjects.push(cube1);
            //console.log("boundingbox",cube1);
      }

    _printBoundingBox(){
        this._boundingObjects.forEach((item)=>{
            console.log(item);
          });
    }


    
//level One Maze
//block(0,0)

   _levelOne(){
        //wall 1
        for(let i=0; i<6;i++){
        this._block(1,-i)
        }
    //wall 2
        for(let i=0;i<5;i++){
            this._block(-i,-5)
        }
        //wall3
        for(let i=1;i<5;i++){
            this._block(-4,-i)
        }
        //wall 4
        for(let i=0;i<4;i++){
            this._block(-2,-i)
        }
        //wall 5
        for(let i=0;i<4;i++){
            this._block(-6,-i)
        }
    
        //wall 6
        this._block(-6,-5)
    
        //wall7
        for(let i=1;i<4;i++){
            this._block(-8,-i)
        }
    
        //wall 8
        for(let i=8;i<11;i++){
            this._block(-i,-4)
        }
    
        //wall 9
        this._block(-9,-1)
    
            //wall 10
            for(let i=0;i<3;i++){
                this._block(-10,-i)
            }
    
            //wall 11
            for(let i=1;i<5;i++){
                this._block(-12,-i);
            }
            
            //wall12
            for(let i=12;i<15;i++){
                this._block(-i,-4)
            }
    
            //wall 13
            for(let i=13;i<16;i++){
                this._block(-i,-1)
            }
    
            //wall 14
            this._block(-15,0)
    
            //wall 15
            for(let i=0;i<14;i++){
                this._block(-i,1)
            }
    
            //wall 16
            for(let i=12;i<16;i++){
                this._block(-i,3)
            }
    
            //wall 17
            this._block(-12,4)
    
            //wall 18
            this._block(-8,2)
    
            //wall 19
            this._block(-6,3)
    
            //wall 20
            for(let i=5;i<11;i++){
                this._block(-i,4)
            }
        
    
            //wall 21
            for(let i=2;i<5;i++){
                this._block(-4,i)
            }
    
            //wall 22
            for(let i=3;i<7;i++){
                this._block(-2,i)
            }
            //wall 23
            for(let i=3;i<17;i++){
                this._block(-i,-6)
            }
    
            //wall 24
            for(let i=-5;i<6;i++){
                this._block(-16,i)
            }
    
            //wall 25
            for(let i=-16;i<1;i++){
                this._block(i,6)
            }
            //wall 26
            for(let i=1;i<7;i++){
                this._block(1,i)
            }
          
     }



drawWall(start, end, vertical, position) {
            
            if(vertical == true){
                for(let i=start;i<end;i++){
                    this._block(position,i);
                }
            }else{
                for(let i=start;i<end;i++){
                this._block(i,position);
                
            }
            
        }
    }
_CheckCollision(playerBoundingBox){
        
       
        this._boundingObjects.forEach((item)=>{
            if(item.intersectsBox(playerBoundingBox)){
                return true;
            }
          });
          
          return false;
        }


}

 export{Maze1};