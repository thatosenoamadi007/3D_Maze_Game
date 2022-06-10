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
        this._levelTwo();
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
    
        let Mesh=new THREE.Mesh(titlwallgeometry,new THREE.MeshBasicMaterial({ map: this._loader.load('game.png')}));
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
/*
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

*/  


//level two maze

//wall 1


   _levelTwo(){
        //wall 1
        for(let i=-13; i<26;i++){
        this._block(i,14)
        }
    
        
    //wall 2
        for(let i=-4;i<14;i++){
            this._block(-7,i)
        }

    
        //wall3
        for(let i=4;i<14;i++){
            this._block(-13,i)
        }
    
        //wall 4
        for(let i=-12;i<-10;i++){
            this._block(i,10)
        }
    
        //wall 5
        for(let i=-9;i<-7;i++){
            this._block(i,10)
        }
    
        //wall 6
        for(let i=-12;i<-8;i++){
            this._block(i,8)
        }
    
        //wall 7
        for(let i=-11;i<-7;i++){
            this._block(i,6)
        }
        
        //wall 8
        for(let i=-13;i<-10;i++){
        this._block(i,4)
        }
            //wall 9
            for(let i=-15;i<4;i++){
                this._block(-11,i)
            }


        
            //wall 10
            for(let i=-10;i<-2;i++){
                this._block(i,-15);
            }
             //wall 11
             for(let i=-12;i<5;i++){
                this._block(-9,i);
            }
            //wall 12
            this.drawWall(-9,-3,false,-13)

            //wall 13
            this.drawWall(-12,-6,true,-4)

            //wall 14
            this.drawWall(-7,5,false,-6)
//////////////////////////////
            //wall 15
            this.drawWall(-5,4,true,-5)

            //wall 16
            this.drawWall(-4,4,false,3)

            //wall 17
            this.drawWall(2,4,true,4)

            //wall 18
            this.drawWall(-2,6,false,1)

            
            //wall 19
            this.drawWall(-1,1,true,-2)

            //wall 20
            this.drawWall(-4,1,true,1)

            //wall 21
            this.drawWall(-1,1,false,-4)

            //wall 22
            this.drawWall(-4,-2,true,-2)

            //wall 23
            this.drawWall(-5,0,true,3)

            //wall 24
            this.drawWall(4, 10,false,-3)

            //wall 25
            this.drawWall(7,11,false,1)

            //wall 26
            this.drawWall(-5,3,true,11)

            //wall 27
            this.drawWall(7,15,false,-5)

            //wall 28
            this.drawWall(-6,11,false,5)
            ///////////////////////////////    
            //wall 29
            this.drawWall(4,6,true,11)
            //wall 30
            this.drawWall(6,12,true,-4)
            //wall 31
            this.drawWall(6,10,true,1)
            //wall 32
            this.drawWall(-1,4,false,10)
            

            ///
            //wall 34
            this.drawWall(12,14,false,5)

            //wall 35
            this.drawWall(-3,5,true,13)
            //wall 36
            this.drawWall(-12,6,true,15)

            //wall 37
            this.drawWall(7,9,true,11)

            //wall 38
            this.drawWall(11,15,false,8)
            //wall 39
            this.drawWall(16,21,false,8)
            //wall 40
            this.drawWall(-7,8,true,17)
            //wall 41
            this.drawWall(9,11,true,12)
            //wall 42
            this.drawWall(8,12,false,10)
            //wall 43
            this.drawWall(6,10,true,8)
            //wall 44
            this.drawWall(14,23,false,10)
            //wall 45
            this.drawWall(-12,9,true,21)
            //wall 46
            this.drawWall(15,22,false,-13)  
            
            //wall 47
            this.drawWall(16,20,false,-9) 

            /////////////////////////////////
            //wall 48
            this.drawWall(-2,14,false,-8)
            //wall 49
            this.drawWall(-15,-8,true,-2)
            //wall 50
            this.drawWall(-15,-8,true,13)
            //wall 51
            this.drawWall(14,23,false,-15)
            //wall 52
            this.drawWall(-15,2,true,23)
            //wall 53
            this.drawWall(24,26,false,-13)
            //wall 54
            this.drawWall(-12,14,true,25)
            //wall 55
            this.drawWall(1,13,true,23)
            //wall 56
            this.drawWall(6,23,false,12)

            
             
                
            

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
        /*
            
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

*/  
_CheckCollision(playerBoundingBox){
        
       
        this._boundingObjects.forEach((item)=>{
            if(item.intersectsBox(playerBoundingBox)){
               // console.log('intersecting',item," ===",playerBoundingBox);
                return true;
            }
            //console.log('not intersecting',item," ===",playerBoundingBox);
          });
          
          return false;
        }


}

 export{Maze1};