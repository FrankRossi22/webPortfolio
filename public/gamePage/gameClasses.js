
class InputHandler {
    constructor() {
        this.keys = [];
        this.gamePaused = false;
        window.addEventListener('keydown', (e) => {
            if((e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ) && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
            } else if (e.key == 'Escape') {
                this.gamePaused = !this.gamePaused;
            }
        });
        window.addEventListener('keyup', e => {
            if((e.key === 'w' || e.key === 'a' ||
                e.key === 's' || e.key === 'd' )) 
            {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}
const inputHandler = new InputHandler();


class AIHealthBar {
    constructor(parent, color) {
        this.parent = parent;
        this.width = 70;
        this.height = 10;
        this.xOffset = parent.width / 2 - (this.width / 2) + parent.type.healthbar_offset.x;
        this.yOffset = parent.type.healthbar_offset.y;
        this.color = color;
    }
    draw(context) {
        context.fillStyle = this.color;
        context.strokeStyle = this.color;
        context.fillRect(this.parent.x + this.xOffset, this.parent.y + this.yOffset,
             this.width * (this.parent.health / this.parent.type.health), this.height);
        context.strokeRect(this.parent.x +  this.xOffset, this.parent.y + this.yOffset,
            this.width, this.height);
        context.strokeStyle = 'black';
    }
    update(deltaTime){
        
        }
}
class PlayerHealthBar {
    constructor(player) {
        this.width = 200;
        this.height = 50;
        this.player = player;
        this.color = 'green';
    }
    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(20, 20,
            this.width * (this.player.health / PLAYER_DATA.maxHealth), this.height);
        context.strokeRect(20, 20,this.width , this.height);

    }
    update(deltaTime){
        
        }
}

class Background {
    constructor() {

        this.image = document.getElementById('backgroundImage');
        this.images = []
        for(var i = 0; i <= 6; i++) {
                    this.images[i] = document.getElementById('backgroundImage' + i);

        }
        this.x = 0;
        this.y = 0;
        this.width = 1666;
        this.height = 720;
        this.speed = GAME_SPEED;
        this.counter = 0;
        this.distanceTraveled = 0;
    }
    draw(context) {
   
        for(var i = 6; i >= 0; i--) {
            
            context.drawImage(this.images[i], this.x, this.y + BACKGROUND_IMAGE_OFFSETS['' + i], this.images[i].width / 3, this.images[i].height / 3);
            //context.drawImage(this.images[i], this.x + 1666, this.y + BACKGROUND_IMAGE_OFFSETS['' + i] -55, this.images[i].width / 3, this.images[i].height / 3);

            context.drawImage(this.images[i], this.x + this.width, this.y + BACKGROUND_IMAGE_OFFSETS[''+ i], this.images[i].width / 3, this.images[i].height / 3);
        }
        
    }
    update(deltaTime){
        
        if(inputHandler.keys.indexOf('d') > -1) {
           if(this.distanceTraveled < -1800) {
                backgroundMoving = false;
            } else {
            backgroundMoving = true;
            this.distanceTraveled -= (deltaTime * PLAYER_SPEED);
            this.x -= (deltaTime * PLAYER_SPEED);
            }
            
        } else if(inputHandler.keys.indexOf('a') > -1) {
            if(this.x + (deltaTime * PLAYER_SPEED) > 320) {
                backgroundMoving = false;
                this.x = 320
            } else {
                backgroundMoving = true;
                this.distanceTraveled += (deltaTime * PLAYER_SPEED);
                this.x += (deltaTime * PLAYER_SPEED);
            }
        }

        //if(this.x < 0 - this.width) this.x = 0, this.counter++;
    }
}
class DestructibleObeject{
    constructor(){
        this.x = 200;
        this.y = GAME_HEIGHT - 250;
        this.width = 50;
        this.height = this.width * 2;
        this.health = 100
        this.type = {healthbar_offset: {x: 0, y: -20}, health: 100};

        this.healthBar = new AIHealthBar(this, 'DarkGreen');
    }
    draw(context) {
        this.healthBar.draw(context);

        context.fillStyle = 'blue'
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    update(deltaTime, context){
        if(backgroundMoving) {
             if(inputHandler.keys.indexOf('d') > -1) {
                this.x -= (deltaTime * PLAYER_SPEED);
            
            } else if(inputHandler.keys.indexOf('a') > -1) {
                this.x += (deltaTime * PLAYER_SPEED);
            }
        }
    }
        
        
}

class Player{
    constructor(state) {
        this.x = 250;
        this.y = GAME_HEIGHT - PLAYER_DATA.height + 10;
        this.frameInterval = 1000/PLAYER_DATA.fps;
        this.frameX = 0;
        this.spriteState = PLAYER_SPRITES.idle;
        this.image = document.getElementById('playerImage');
        this.frameTimer = 0;
        this.travellingLeft = false;
        this.isAttacking = false;
        this.health = PLAYER_DATA.maxHealth;
        this.healthBar = new PlayerHealthBar(this);
        this.gameState = state;
        this.coinGainRate = .2;
        this.anvilLevel = 1;
        this.coinCount = 0;
        this.timer = 0;
        this.canUpgrade = false;
    }

    showCoins(context){
        context.fillStyle = 'yellow';
        context.fillRect(coinCounterBox.x, coinCounterBox.y,
            coinCounterBox.width, coinCounterBox.height);
        context.strokeRect(coinCounterBox.x, coinCounterBox.y,
            coinCounterBox.width, coinCounterBox.height);


        context.fillStyle = 'black';
        context.font = '30px Arial';
        context.textAlign = 'center';
        context.textBaseline = "middle";
        context.fillText(Math.floor(this.coinCount), coinCounterBox.x + (coinCounterBox.width/2), 46);
    }
    showCoinUpgrade(context){
        context.fillStyle = 'yellow';
        context.fillRect(coinUpgradeBox.x, coinUpgradeBox.y,
            coinUpgradeBox.width , coinUpgradeBox.height);
        context.strokeRect(coinUpgradeBox.x, coinUpgradeBox.y,
            coinUpgradeBox.width , coinUpgradeBox.height);
        context.fillStyle = 'black';
        context.font = '14px Arial';
        context.textAlign = 'center';
        context.textBaseline = "middle";
        context.fillText("Upgrade", coinUpgradeBox.x + coinUpgradeBox.width/2, 38);
        context.fillText(ANVIL_LEVELS[this.anvilLevel].nextCost + " Coins", coinUpgradeBox.x + coinUpgradeBox.width/2, 53);

    }
    draw(context) {

        this.healthBar.draw(context);

        if(this.frameX > this.spriteState.maxFrame){
            if(this.spriteState.id === PLAYER_STATES.dead) this.gameState = GAME_STATES.gameOver;
            this.frameX = 0;
            this.isAttacking = false;
        }
        if(!this.isAttacking && !(this.spriteState.id === PLAYER_STATES.dead)) {
            if(inputHandler.keys.length == 0) {
                this.spriteState = PLAYER_SPRITES.idle;
            } else {
                this.spriteState = PLAYER_SPRITES.run;
            }

        }
        if(inputHandler.keys.indexOf('d') > -1) {
            this.travellingLeft = false;
            context.drawImage(this.image, this.frameX * PLAYER_DATA.width, this.spriteState.frameY * PLAYER_DATA.height,
                 PLAYER_DATA.width, PLAYER_DATA.height, this.x, this.y - 150, PLAYER_DATA.width * 1.3, PLAYER_DATA.height * 1.3)

        } else if(inputHandler.keys.indexOf('a') > -1) {
            this.travellingLeft = true;
            context.save();
            context.scale(-1, 1);
            context.drawImage(this.image, this.frameX * PLAYER_DATA.width, this.spriteState.frameY * PLAYER_DATA.height, PLAYER_DATA.width,
                 PLAYER_DATA.height, -this.x, this.y - 150, -PLAYER_DATA.width * 1.3, PLAYER_DATA.height * 1.3)
            context.restore()
        } else {
            context.drawImage(this.image, this.frameX * PLAYER_DATA.width, this.spriteState.frameY * PLAYER_DATA.height, PLAYER_DATA.width,
                 PLAYER_DATA.height, this.x, this.y - 150, PLAYER_DATA.width * 1.3, PLAYER_DATA.height * 1.3);
        }
        this.showCoins(context);
        this.canUpgrade = this.coinCount >= ANVIL_LEVELS[this.anvilLevel].nextCost && (this.anvilLevel < 3);
        if(this.canUpgrade) {
            this.showCoinUpgrade(context)
        } 
        //context.strokeRect(this.x + 80, this.y, this.width - 190, this.height);
    }
    update(deltaTime, enemies){
        if(this.frameTimer > this.frameInterval) {
            this.frameX++;
            this.frameTimer = 0;
            this.timer++
            if(this.timer % PLAYER_DATA.coinGainSpeed === 0) {
                this.coinCount += this.coinGainRate;
            }
            if(this.timer % PLAYER_DATA.healthRegenSpeed === 0) {
                this.health = Math.min(PLAYER_DATA.maxHealth, this.health + PLAYER_DATA.healthRegenAmount);
            }1
            if(this.spriteState.id === PLAYER_STATES.dead) return;
            enemies.forEach((enemy, index )=> {
                if(((enemy.x + 50) <= (this.x + 80 + PLAYER_DATA.width - 190) ) && !enemy.dying) //check if enemy is in attack range and still alive
                {
                    this.spriteState = PLAYER_SPRITES.attack1;
                    if(!this.isAttacking){
                        this.frameX = 0;
                        };
                    if(this.frameX == 3) enemy.health = Math.max(enemy.health - (PLAYER_DATA.attackDamage * playerDamageModifier), 0);
                    this.isAttacking = true;
                    //this.frameX = 2;
                    if(enemy.health <= 0) {
                        enemy.frameX = 0;
                        enemy.spriteState = enemy.type.sprites.die;
                        enemy.dying = true;
                    }

                    
                }
                
            });
        }


        this.frameTimer += deltaTime;
    }
}

class AIEntity{
    constructor(entityType, mobType, distanceTraveled) {

        this.isEnemy = entityType.isEnemy;
        this.type = mobType;
        
        this.health = this.type.health;
        this.width = mobType.width;
        this.height = mobType.height;
        this.x = GAME_WIDTH * 2 + distanceTraveled;
        console.log(mobType)
        if(this.isEnemy === -1) {
            this.x = 1 + distanceTraveled;
        }
        let d = [-45, -22, 0, 22, 45];
        this.lane = getRandomInt(0, 4);
        this.y = GAME_HEIGHT - this.height - this.type.yOffset - 150 + d[this.lane];
        this.image = document.getElementById(mobType.sheet);
        this.fps = 8;
        this.frameInterval = 1000/this.fps;
        this.frameX = 0;
        this.spriteState = mobType.sprites.run;
        this.frameTimer = 0;
        this.speed = 1;
        this.isMoving = 1;
        this.dying = false;
        this.healthBar = new AIHealthBar(this, entityType.healthBar_Color);
        this.flip = (this.type.flipped && this.isEnemy !== -1) || (!this.type.flipped && this.isEnemy === -1);
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

 
   
    }
    draw(context) {
        this.healthBar.draw(context);
        context.save();
        

        if(!this.flip) {
            context.drawImage(this.image, this.frameX * this.width, (this.spriteState.frameY * this.height),
             this.width, this.height, this.x, this.y, this.width * 1, this.height * 1)
        } else {
            context.scale(-1, 1);
            context.drawImage(this.image, this.frameX * this.width, (this.spriteState.frameY * this.height),
             this.width, this.height, -this.x, this.y , -this.width * 1, this.height * 1)

        }
        context.restore();
        //context.strokeRect(this.x + 70, this.y, this.width - 150, this.height);
    }
    update(deltaTime){
        if(this.frameTimer > this.frameInterval) {
            if(this.frameX >= this.spriteState.maxFrame) {
                this.canAttack = true; //allow enemy to do damage again after previous attack is finished
                
                //send dead enemy offscreen and mark it dead
                if(this.spriteState.frameY == this.type.sprites.die.frameY) { 
                    this.x = -300;
                    this.spriteState = this.type.sprites.dead
                    return;
                }

                //set default state
                this.spriteState = this.type.sprites.run
                this.isMoving = 1;
                this.frameX = 0;
            }
            else this.frameX++;
            this.frameTimer = 0;
        }
        this.frameTimer += deltaTime;
        this.x -= (deltaTime * ENEMY_SPEED) * this.isMoving * this.isEnemy;
        if(backgroundMoving) {
             if(inputHandler.keys.indexOf('d') > -1) {
                this.x -= (deltaTime * PLAYER_SPEED);
            
            } else if(inputHandler.keys.indexOf('a') > -1) {
                this.x += (deltaTime * PLAYER_SPEED);
            }
        }
       
    }
}