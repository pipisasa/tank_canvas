let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

let blockSize = 20;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;

let drawBorder = function () {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

let gameOver = function () {
    clearInterval(intervalId);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Конец игры", width / 2, height / 2);
    };

let drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score + '\n' + 'Fuel:' + t34.fuel, blockSize, blockSize);
    };

let Block = function (col, row, hp=null) {
    this.col = col;
    this.row = row;
    this.hp = hp;
    };
// Block.prototype.drawBlock = function(type){
    
// }

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    // console.log('draw' + color)
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

Block.prototype.hit = function(n){
    this.hp-=n;
    if(this.hp<=0){
        this.col=-1;
        this.row=-1;
    }
};

let Tank = function (x,y) {
    this.bullet = [];
    this.armory = 500;
    this.fuel = 100;
    this.speed = 200;
    this.block = new Block(x,y);
    this.direction = "right";
    this.gunLvL = 1;
    this.setGunLvL = {
        LvL1:(str)=>{
            if(str=='up'){
                ctx.fillRect((this.block.col+0.4)*blockSize,(this.block.row-0.2)*blockSize,blockSize*0.2,blockSize*0.8);
            }else if(str=='down'){
                ctx.fillRect((this.block.col+0.4)*blockSize,(this.block.row+0.4)*blockSize,blockSize*0.2,blockSize*0.8);
            }else if(str=='left'){
                ctx.fillRect((this.block.col-0.2)*blockSize,(this.block.row+0.4)*blockSize,blockSize*0.8,blockSize*0.2);
            }else if(str=='right'){
                ctx.fillRect((this.block.col+0.4)*blockSize,(this.block.row+0.4)*blockSize,blockSize*0.8,blockSize*0.2);
            };
        },
        LvL2:(str)=>{
            if(str=='up'){
                ctx.fillRect(this.block.col*blockSize+blockSize*0.45,this.block.row*blockSize-blockSize*0.6,blockSize*-0.2,blockSize*1.1);
                ctx.fillRect(this.block.col*blockSize+blockSize*0.55,this.block.row*blockSize-blockSize*0.6,blockSize*0.2,blockSize*1.1);
            }else if(str=='down'){
                ctx.fillRect(this.block.col*blockSize+blockSize*0.45,this.block.row*blockSize-blockSize*-0.5,blockSize*-0.2,blockSize*1.1);
                ctx.fillRect(this.block.col*blockSize+blockSize*0.55,this.block.row*blockSize-blockSize*-0.5,blockSize*0.2,blockSize*1.1);
            }else if(str=='left'){
                ctx.fillRect(this.block.col*blockSize+blockSize*0.5,this.block.row*blockSize+blockSize*0.45,blockSize*-1.1,blockSize*-0.2);
                ctx.fillRect(this.block.col*blockSize+blockSize*0.5,this.block.row*blockSize+blockSize*0.55,blockSize*-1.1,blockSize*0.2);
            }else if(str=='right'){
                ctx.fillRect(this.block.col*blockSize+blockSize*0.5,this.block.row*blockSize+blockSize*0.45,blockSize*1.1,blockSize*-0.2);
                ctx.fillRect(this.block.col*blockSize+blockSize*0.5,this.block.row*blockSize+blockSize*0.55,blockSize*1.1,blockSize*0.2);
            };
        }
    };
    this.gunDirection = function(str){
        this.block.drawSquare("Black");
        ctx.fillStyle = 'white';
        ctx.fillRect(this.block.col*blockSize+blockSize*0.2,this.block.row*blockSize+blockSize*0.2,blockSize*0.6,blockSize*0.6)
        ctx.fillStyle = 'black';
        if(this.gunLvL=='1'){
            this.setGunLvL.LvL1(str);
        }else if(this.gunLvL=='2'){
            this.setGunLvL.LvL2(str);
        }
    };
};
// //
Tank.prototype.moveBool = true;
Tank.prototype.moveBool2= true;
setMoveSpeed = function(tank){
    setTimeout(function(){
        tank.moveBool=true;
    },tank.speed)
}

Tank.prototype.move = function () {
    if(this.moveBool && this.moveBool2){
        if(this.fuel<=0){
            console.log('Fuel is over!')
            return;
        }else{
            this.fuel-=1
        };
        let head = this.block;
        for(let i=0; i<swamps.length; i++){
            if(head.equal(swamps[i])){
                this.fuel-=1;
                break;
            }
        }
        if(head.equal(getLvL2Block)){
            this.gunLvL=2;
        }else if(head.equal(getLvL1Block)){
            this.gunLvL=1;
        }else if(head.equal(getArmoryBlock)){
            this.armory+=100;
        }else if(head.equal(getFuelBlock)){
            this.fuel+=100;
        }
        let newHead;
        if (this.direction === "right") {
            newHead = new Block(head.col + 1, head.row);
        } else if (this.direction === "down") {
            newHead = new Block(head.col, head.row + 1);
        } else if (this.direction === "left") {
            newHead = new Block(head.col - 1, head.row);
        } else if (this.direction === "up") {
            newHead = new Block(head.col, head.row - 1);
        }
        if (this.checkCollision(newHead)) {
            newHead = head;
            this.fuel++;
        }
        this.block=newHead;
        this.moveBool = false;
        setMoveSpeed(this);
    };
};
// // 
Tank.prototype.checkCollision = function (newHead) {
    let leftCollision = (newHead.col === 0);
    let topCollision = (newHead.row === 0);
    let rightCollision = (newHead.col === widthInBlocks - 1);
    let bottomCollision = (newHead.row === heightInBlocks - 1);

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let WallsCollision = false;

    function WallsCollisionFn(){
        for (let i = 0; i < walls.length; i++) {
            if (newHead.equal(walls[i])) {
                return true;
            }
        }
    }

    WallsCollision = WallsCollisionFn();

    return wallCollision || WallsCollision;
};
let bullets=[];
Tank.prototype.fire = function(){
    if(this.bulletSpeedBool && !this.armory<=0){
        this.armory-=this.gunLvL;
        bullets.push(new Bullet);
        bullets[bullets.length-1].draw();
        console.log(this.armory)
        this.bulletSpeedBool = false;
        setBulletSpeed(this);
    }
};

class Bullet{constructor(){
    this.dir = t34.direction;
    this.col = t34.block.col;
    this.row = t34.block.row;
}};

Bullet.prototype.draw = function(){
    if(this.moveBullet()){
        console.log(1)
        return};
    ctx.fillStyle = 'black';
    ctx.fillRect(blockSize*this.col+blockSize*0.4,blockSize*this.row+blockSize*0.4,blockSize*0.2,blockSize*0.2)
}

Bullet.prototype.moveBullet = function(){
    if(this.dir=='up' && this.row>1){
        this.row--;
    }else if(this.dir=='down' && this.row<height/blockSize-2){
        this.row++;
    }else if(this.dir=='left' && this.col>1){
        this.col--;
    }else if(this.dir=='right' && this.col<width/blockSize-2){
        this.col++;
    }else{
        this.col=-1;
        this.row=-1;
        return true;
    }
    for(let i=0; i<walls.length; i++){
        if(this.col === walls[i].col && this.row === walls[i].row){
            this.col=-1;
            this.row=-1;
            walls[i].hit(t34.gunLvL);
        }
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(blockSize*this.col+blockSize*0.4,blockSize*this.row+blockSize*0.4,blockSize*0.2,blockSize*0.2);
};

Tank.prototype.bulletSpeedBool = true;
Tank.prototype.bulletSpeed = 500;

let setBulletSpeed = function(tank){
    setTimeout(function(){
        tank.bulletSpeedBool = true;
        // clearTimeout(tankObj.bulletSpeedId);
        // setBulletSpeed();
    },tank.bulletSpeed/tank.gunLvL);
};

let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

let moveTimer;
let moveTimerId =  setInterval(()=>{moveTimer = true},100)
$("body").keyup(function (event) {
    if (directions[event.keyCode] !== undefined && directions[event.keyCode]){
        t34.direction = directions[event.keyCode];
        // t34.nextDirection = newDirection;
        // moveTimer = false;
    }
});
$("body").keydown(function(event){
    let bool = true;
    if(directions[event.keyCode] !== undefined){
        if(t34.direction != directions[event.keyCode]){
            t34.direction = directions[event.keyCode];
            bool = false
            setTimeout(function(){
                bool=true;
            },500)
        }
        if(bool){
            t34.move();
        }
        // if(moveTimer){t34.move()}
    };
    if(event.keyCode==32){
        t34.fire();
    };
});