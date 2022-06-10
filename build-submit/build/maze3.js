import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

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
    
        //let Mesh=new THREE.Mesh(titlwallgeometry,new THREE.MeshBasicMaterial({ map: this._loader.load('stone.jpg')}));
        let Mesh=new THREE.Mesh(titlwallgeometry,new THREE.MeshBasicMaterial({ color: "red"}));//map: this._loader.load('stone.jpg')}));
        Mesh.castShadow=true;
        Mesh.receiveShadow=true;
        return Mesh
    }

    _block(x,z){
            const wall1=this._makewalla.clone();
            //console.log("before",wall1.position);
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


    /* //block(0,0)
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
          
     }*/


     
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

        genMaze(x, y, z, mat){
            var cols, rows;
            var grid = [];
            var current;
            var w = 40;
            var stack = [];
            var maze = new THREE.Object3D();
            maze.scale.set(0.1,0.2,0.1);
            //maze.position.set(-16.5,0,-17);
            //maze.position.set(x,y,z);
            maze.position.set(0,0,0);
            var _boundingObjects=[];
            var helper=[];

            var mazeContainer = new THREE.Object3D();
            mazeContainer.add(maze);

            const mzbb = new THREE.Box3().setFromObject(maze);

            const bbMesh = new THREE.Mesh(
            new THREE.SphereGeometry(),
            new THREE.MeshBasicMaterial()
            );

            bbMesh.geometry.computeBoundingBox();

           // maze

            //this._params.scene.add(maze);
            
        
            function setup(){
                cols = 400/w;
                rows = 400/w;
        
                //console.log(cols, rows);
        
                for (var j=0; j<rows; ++j){
                    for (var i=0; i<cols; ++i){
                        var cell = new Cell(i, j);
                        //console.log(cell);
                        grid.push(cell);
                    }
                }
        
                current = grid[0];    
                current.visited = true;
        
                //console.log(current);
                stack.push(current);
        
                //console.log(stack);
        
                var next = current.checkNeighbors();
        
                while(!mazeComplete()){
        
                    if (next){
                        next.visited = true;
        
                        removeWalls(current, next);
        
                        current = next;
        
                        stack.push(current);
        
                        //console.log(stack);
        
                        next = current.checkNeighbors();
                    }else if (stack.length > 0){
                        current = stack.pop();
        
                        //console.log(stack);
        
                        next = current.checkNeighbors();
                    }
                    // next.visited = true;
                    // //console.log(next);
        
                    // removeWalls(current, next);
        
                    // current = next;
        
                    // next = current.checkNeighbors();
                    
                }
                
                // if (next){
                //     next.visited = true;
                //     current = next;
                // }
            }
        
            function removeWalls(a, b){
                var x = a.i - b.i;
        
                if (x === 1){
                    a.walls[3] = false;
                    b.walls[1] = false;
                }else if (x === -1){
                    a.walls[1] = false;
                    b.walls[3] = false;
                }
        
                var y = a.j - b.j;
        
                if (y === 1){
                    a.walls[0] = false;
                    b.walls[2] = false;
                }else if (y === -1){
                    a.walls[2] = false;
                    b.walls[0] = false;
                }
            }
        
            function mazeComplete(){
                var com = true;
                for (var i=0; i<grid.length; ++i){
                    if (!grid[i].visited) {
                        com = false;
                    }
                }
        
                return com;
            }
        
            function index(i, j){
                if (i<0 || j<0 || i>cols-1 || j>rows-1){
                    return -1;
                }
                    
                return i + j * cols;
                
            }
        
            function Cell(i, j){
                this.i = i;
                this.j = j;
                this.walls = [true, true, true, true];
                this.visited = false;
        
                this.checkNeighbors = function(){
                    var neighbors = [];
        
                    var top = grid[index(i,j-1)]; 
                    var right = grid[index(i+1,j)]; 
                    var bottom = grid[index(i,j+1)]; 
                    var left = grid[index(i-1,j)]; 
        
                    if (top && !top.visited){
                        neighbors.push(top);
                    }
                    if (right && !right.visited){
                        neighbors.push(right);
                    }
                    if (bottom && !bottom.visited){
                        neighbors.push(bottom);
                    }
                    if (left && !left.visited){
                        neighbors.push(left);
                    }
        
        
                    if (neighbors.length > 0){
                        var r = Math.floor(Math.random() * neighbors.length);
                        return neighbors[r];
                    }else{
                        return undefined;
                    }
        
        
                }
            
                this.show = function(){
                    var x = this.i*w;
                    var y = this.j*w;
        
                    var wid = 10;
                    var hei = 40;
        
                    // graphics.strokeStyle = "white";
                    // graphics.fillStyle = "blue";
                    if (this.walls[0]){
                        //line(x, y, x+w, y);      //top
                        //filledRect(x,y,80,10);
                        wall(x,y,hei,wid);
                        //console.log(x,y);
                    }
                    if (this.walls[1]){
                    // line(x+w, y, x+w, y+w);  //right
                        //filledRect(x+w,y,10,80);
                        wall(x+w-15,y+15,wid,hei);
                        //console.log(x+w,y);
                    }
                    if (this.walls[2]){
                        //line(x+w, y+w, x, y+w);  //bottom
                        //filledRect(x+10,y+w,80,10);
                        wall(x+10,y+w,hei,wid);
                        //console.log(x+w,y+w);
                    }
                    if (this.walls[3]){
                        //line(x, y+w, x, y);      //left
                        //filledRect(x,y+10,10,80);
                        wall(x-15,y+10+15,wid,hei);
                        //console.log(x,y+w);
                    }
                    
        
                    // if (this.visited){
                    //     graphics.save();
                    //     graphics.fillStyle = "red"; 
                    //     filledRect(x, y, w, w);
                    //     graphics.restore();
                    // }
                    
                }
            }
        
            function drawWorld(){
                for (var i=0; i<grid.length; ++i){
                    grid[i].show();
                }

                //console.log(grid);
        
                // grid[0].show();
                // grid[1].show();
                // grid[2].show();
                // grid[10].show();
                // grid[11].show();
                // grid[12].show();
        
        
                //current.visited = true;
            }
            
        
            setup();
            drawWorld();
            //obs(grid, cols);

            function wall(x,y,w,h){
                const loader = new THREE.TextureLoader();
                const cubegeometry=new THREE.BoxGeometry();
                //const cubematerial=new THREE.MeshBasicMaterial({color : "blue"});
                //const cubematerial = new THREE.MeshBasicMaterial( { map: loader.load('stone.jpg')} );
                //const cubematerial = new THREE.MeshBasicMaterial( { map: loader.load(mat)} );
                const cubematerial=new THREE.MeshPhongMaterial({color : mat});
                const cube=new THREE.Mesh(cubegeometry,cubematerial);//.depthTest(false));
                
                cube.scale.set(w,10,h);
                cube.position.set(x,0,y);
                // cube.scale.set(0.2,1,10);
                // cube.position.set(-4.9,0,0);
                // scene.add(cube);
                cube.castShadow = true;
                cube.receiveShadow = true;
                maze.add(cube);
                let cube1=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
                cube1.setFromObject(cube);
                _boundingObjects.push(cube1);

                helper.push(new THREE.Box3Helper(cube1,0xFF0000));



            }

            function obs(cells){
                var is = [];
                var js = [];
                for (var i=0; i<cells.length; ++i){
                    var c = cells[i];
                    // c.i = i-w;
                    // c.j = j-w;
                    is[i] = c.i;
                    js[i] = c.j;

                    //console.log(is[])
                    
                }
                //console.log(is);

                for (var ci=0; ci<is.length; ++ci){
                    for (var cj=0; cj<js.length; ++cj){
                        const geo = new THREE.BoxGeometry();
                        const matr = new THREE.MeshPhongMaterial({color : "blue"});
                        const obb = new THREE.Mesh(geo, matr);

                        obb.scale.set(10,5,10);
                        obb.position.set(is[ci]*10-15, 0,js[cj]*10+15);
                        maze.add(obb);

                        console.log(obb);
                    }
                }


                
            }
            this._boundingObjects=_boundingObjects;

            // helper.forEach((item)=>{
            //     this._params.scene.add(item);
            // })

            return {
                maze: maze, 
                boundingbox: this._boundingObjects,
                helper: helper
            };

            //return maze;
        }



        


        

}

 export{Maze1};