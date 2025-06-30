window.addEventListener('load', function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    var enemies = new Array();
    var allies = new Array();
    var background = new Background();

    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }
    // Function to check whether a point is inside a rectangle
    function isInside(pos, rect) {
        return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
    }

    // Function Loops through enemies array and animates all of them, deleting any offscreen
    function handleEnemies(deltaTime) {
        if(levelData.length > 0 && enemyTimer > levelData[0]["time"]) {
            enemies.push(new AIEntity(ENTITY_TYPES.enemy, ENEMY_TYPES[levelData[0]["enemy"]], background.distanceTraveled));
            levelData.shift();
        }
        enemyTimer += deltaTime;

        allies.sort(function(a, b) {
            return parseFloat(b.x) - parseFloat(a.x);
        });
        enemies.sort(function(a, b) {
            return parseFloat(a.lane) - parseFloat(b.lane);
        });
        if(levelData.length === 0 && enemies.length === 0) {
            player.gameState = GAME_STATES.levelWon;
            return;
        }
        var nextEnemies = [...enemies];
        enemies.forEach((enemy, index )=> {
            let attackData = shouldEnemyAttack(enemy);
            if(enemy.spriteState.id == ENEMY_STATES.dead) {

                nextEnemies.splice(index, 1);
                return;
            }
            if(enemy.spriteState.id == ENEMY_STATES.dying) {
                enemy.isMoving = 0;
            } else if(enemy.spriteState.id !== ENEMY_STATES.attacking && attackData.shouldAttack) {
                enemy.frameX = 0;
                enemy.spriteState = enemy.type.sprites.attack;
            }
            else if(enemy.spriteState.id === ENEMY_STATES.attacking || attackData.shouldAttack) {
                //enemy.frameX = 0;
                enemy.spriteState = enemy.type.sprites.attack;
                enemy.isMoving = 0;
                if(player.spriteState.id !== PLAYER_STATES.dead && enemy.canAttack && enemy.frameX === 4 && attackData.shouldAttack) {
                    if(attackData.targets.includes('player')) {
                        player.health = Math.max(0, player.health - (enemy.type.damage * enemyDamageModifier));
                        if(player.health <= 0){ 
                            player.frameX = 0;
                            player.spriteState = PLAYER_SPRITES.death;
                            
                        }
                    } 
                    if(attackData.targets.includes('item')) {
                        itemToDefend.health = Math.max(0, itemToDefend.health - (enemy.type.damage * enemyDamageModifier));
                        if(itemToDefend.health <= 0){ 
                            player.frameX = 0;
                            player.spriteState = PLAYER_SPRITES.death;
                        }
                    }
                    if(attackData.targets.includes('ally')) {
                        attackData.alliesToAttack.forEach( ally => {
                            ally.health = Math.max(0, ally.health - (enemy.type.damage * enemyDamageModifier));
                            if(ally.health <= 0 && ally.spriteState.id !== ally.type.sprites.die.id){ 
                                ally.frameX = 0;
                                ally.spriteState = ally.type.sprites.die;
                            }
                        });
                    }

                    enemy.canAttack = false;
                }
            } else {
                //enemy.frameX = 0;
                enemy.spriteState = enemy.type.sprites.run;

                enemy.isMoving = 1;
            }
            // enemy.draw(ctx);
            // if(!inputHandler.gamePaused) {
            //     enemy.update(deltaTime);

            // }
            
            
        });
        enemies = [...nextEnemies];
    }
    function shouldEnemyAttack(enemy) { 
        let attackData = {shouldAttack: false, targets: [], alliesToAttack: []};
        if((enemy.x + 50) <= (player.x + 80 + PLAYER_DATA.width - 190) &&
        (player.x + 80) <= (enemy.x + 70 + enemy.width - 150)) {
            attackData.shouldAttack = true;
            attackData.targets.push('player');
        }
        if((enemy.x + 50) <= (itemToDefend.x + itemToDefend.width) &&
        (itemToDefend.x + 10) <= (enemy.x + 40 + enemy.width)) {
            attackData.shouldAttack = true;
            attackData.targets.push('item');

        }
        allies.some((ally) =>{
            if(ally.health <= 0) return;
            if((enemy.x + 50) <= (ally.x + -40 + ally.width) &&
            (ally.x + 50) <= (enemy.x + 20 + enemy.width)) {
                attackData.shouldAttack = true;
                attackData.targets.push('ally');
                attackData.alliesToAttack.push(ally);
            } else {
                return;
            }
                
        });
        return attackData;
    }
        function shouldAllyAttack(ally) { 
        let attackData = {shouldAttack: false, enemiesToAttack: []};
       
        enemies.forEach((enemy) =>{
            if((enemy.x + 50) <= (ally.x + -100 + ally.width) &&
            (ally.x + 50) <= (enemy.x + 20 + enemy.width)) {
                attackData.shouldAttack = true;
                attackData.enemiesToAttack.push(enemy);
            }
        });
        return attackData;
    }
    allyTimer = 0;
    allyInt = 3000;
    function handleAllies(deltaTime) {

        // while(alliesToSpawn.length > 0) {
        //     allies.push(new AIEntity(ENTITY_TYPES.ally, alliesToSpawn.shift()))
        // }
        allies.sort(function(a, b) {
            return parseFloat(a.lane) - parseFloat(b.lane);
        });
        var nextAllies = [...allies];
        
        allies.forEach((ally, index )=> {
            if(ally.spriteState.id == ENEMY_STATES.dead) {

                nextAllies.splice(index, 1);
                return;
            }
            let attackData = shouldAllyAttack(ally);

            if(ally.spriteState.id == ENEMY_STATES.dying) {
                ally.isMoving = 0;
            } else if(ally.spriteState.id !== ENEMY_STATES.attacking && attackData.shouldAttack) {
                ally.frameX = 0;
                ally.spriteState = ally.type.sprites.attack;
            }
            else if(ally.spriteState.id === ENEMY_STATES.attacking || attackData.shouldAttack) {
                //enemy.frameX = 0;
                ally.spriteState = ally.type.sprites.attack;
                ally.isMoving = 0;
                if(player.spriteState.id !== PLAYER_STATES.dead && ally.canAttack && ally.frameX === 4 && attackData.shouldAttack) {
                    
     
                    attackData.enemiesToAttack.forEach( enemy => {
                        enemy.health = Math.max(0, enemy.health - (ally.type.damage * enemyDamageModifier));
                        if(enemy.health <= 0 && enemy.spriteState.id !== enemy.type.sprites.die.id){ 
                            enemy.frameX = 0;
                            enemy.spriteState = enemy.type.sprites.die;
                        }
                    });
                    

                    ally.canAttack = false;
                }
            } else {
                //enemy.frameX = 0;
                ally.spriteState = ally.type.sprites.run;

                ally.isMoving = 1;
            }
            // ally.draw(ctx);
            // if(!inputHandler.gamePaused) {
            //     ally.update(deltaTime);

            // }
            
            
        });
        allies = [...nextAllies];
    }

    //Basic Game Setup
    var player = new Player(GAME_STATES.menu);

    
    function drawPauseScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
        
        PAUSE_MENU_ITEMS.forEach((item, index) => {
            ctx.fillStyle = 'blue';

            ctx.fillRect(PAUSE_MENU_ITEM_RECTS.x, PAUSE_MENU_ITEM_RECTS.y + (PAUSE_MENU_ITEM_DIMS.height ) * index,
             PAUSE_MENU_ITEM_RECTS.width, PAUSE_MENU_ITEM_RECTS.height );
            ctx.fillStyle = 'white';

            ctx.fillText(item, canvas.width / 2, PAUSE_MENU_ITEM_TEXT_POS.y + PAUSE_MENU_ITEM_DIMS.height * index);
            
        });
    }
    const retryRect = {x: (canvas.width / 2) - 100, y: (canvas.height / 2) + 30, width: 200, height: 100};

    function drawGameOverScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'red';
        ctx.fillRect(retryRect.x, retryRect.y, retryRect.width, retryRect.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Retry', retryRect.x + 100, (canvas.height / 2) + 88);
    }
      function drawLevelWonScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Level Complete', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = 'blue'
        ctx.fillRect(retryRect.x, retryRect.y, retryRect.width, retryRect.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Main Menu', retryRect.x + 100, (canvas.height / 2) + 88);
    }
    function restartGame(level){
        enemies = new Array();
        allies = new Array();
        background = new Background();
        enemyTimer = 0;
        timeTotal = 0;
        itemToDefend = new DestructibleObeject();
        


        
        levelData = LEVELS[level]; // Process the JSON data
        console.log(levelData)
        //player.gameState = GAME_STATES.inGame;
        player = new Player(GAME_STATES.inGame);

           

    }
    function drawMenuScreen() {

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        

        MAIN_MENU_ITEMS.forEach((item, index) => {
            ctx.fillStyle = 'black';

            ctx.fillRect(MENU_ITEM_RECTS.x, MENU_ITEM_RECTS.y + (MENU_ITEM_DIMS.height ) * index,
             MENU_ITEM_RECTS.width, MENU_ITEM_RECTS.height );
            ctx.fillStyle = 'white';

            ctx.fillText(item, canvas.width / 2, MENU_ITEM_TEXT_POS.y + MENU_ITEM_DIMS.height * index);
            
        });
        

    }
    function drawLevelSelectScreen() {

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        for(var i = 1; i <= NUM_LEVELS; i++) {
            ctx.fillStyle = 'black';

            ctx.fillRect(MENU_ITEM_RECTS.x, MENU_ITEM_RECTS.y + (MENU_ITEM_DIMS.height ) * (i - 1),
             MENU_ITEM_RECTS.width, MENU_ITEM_RECTS.height );
            ctx.fillStyle = 'white';

            ctx.fillText('' + i, canvas.width / 2, MENU_ITEM_TEXT_POS.y + MENU_ITEM_DIMS.height * (i - 1));
        }

        

    }
    let levelData = [];

    function handleMenuSelection(selectedItem) {
      if (selectedItem === 0) {
        restartGame('1');
        player.gameState = GAME_STATES.inGame;
    } else if (selectedItem === 1) {
        player.gameState = GAME_STATES.levelSelect;
      } else if (selectedItem === 2) {
        console.log('3a')
      }
    }
    function handleLevelSelection(selectedItem) {
        console.log(selectedItem)
        restartGame('' + selectedItem)
    }
    this.window.addEventListener('mousedown', e => {
        if(player.gameState === GAME_STATES.gameOver && isInside(getMousePos(canvas, e), retryRect)) {
            restartGame('1');
        }else if(player.gameState === GAME_STATES.inGame && isInside(getMousePos(canvas, e), allyIcon1)) {
            if(player.coinCount - 5 >= 0) {
                player.coinCount -= 5;
                allies.push(new AIEntity(ENTITY_TYPES.ally, ENEMY_TYPES.mushroom, background.distanceTraveled))
            }
        } else if(player.canUpgrade === true && isInside(getMousePos(canvas, e), coinUpgradeBox)) {
            player.coinGainRate = ANVIL_LEVELS[player.anvilLevel].rateChange;
            player.coinCount -= COIN_UPGRADE_COSTS[player.anvilLevel];
            player.anvilLevel++;

        } else if(player.gameState === GAME_STATES.menu) {
            MAIN_MENU_ITEMS.some((item, index) => {
                itemRect = {x: MENU_ITEM_RECTS.x, y: MENU_ITEM_RECTS.y + (MENU_ITEM_DIMS.height ) * index,
                    width: MENU_ITEM_RECTS.width, height: MENU_ITEM_RECTS.height };
                if (isInside(getMousePos(canvas, e), itemRect)) {
                    handleMenuSelection(index);
                    return;
                }
            });
        } else if(inputHandler.gamePaused) {
            PAUSE_MENU_ITEMS.some((item, index) => {
                itemRect = {x: PAUSE_MENU_ITEM_RECTS.x, y: PAUSE_MENU_ITEM_RECTS.y + (PAUSE_MENU_ITEM_DIMS.height ) * index,
                    width: PAUSE_MENU_ITEM_RECTS.width, height: PAUSE_MENU_ITEM_RECTS.height };
                if (isInside(getMousePos(canvas, e), itemRect)) {
                    inputHandler.gamePaused = false;
                    player.gameState = GAME_STATES.menu
                    return;
                }
            });
        } else if(player.gameState === GAME_STATES.levelWon  && isInside(getMousePos(canvas, e), retryRect)) {
            player.gameState = GAME_STATES.menu
            return;
        }   else if(player.gameState === GAME_STATES.levelSelect) {
            for(var i = 1; i <= NUM_LEVELS; i++) {
                itemRect = {x: MENU_ITEM_RECTS.x, y: MENU_ITEM_RECTS.y + (MENU_ITEM_DIMS.height ) * (i -1),
                    width: MENU_ITEM_RECTS.width, height: MENU_ITEM_RECTS.height };
                if (isInside(getMousePos(canvas, e), itemRect)) {
                    handleLevelSelection(i);
                    return;
                }
            }
            
        }

    });
    
    var paused = false;
    var lastTime = 0;
    var enemyTimer = 0;
    const GAME_INTERVAL = 30
    var gameTimer = 0;
    function drawEntitiesInLanes(minLane, maxLane, deltaTime) {
        entities = [...allies].concat([...enemies])
        entities.sort(function(a, b) {
            return parseFloat(a.lane) - parseFloat(b.lane);
        });
        // enemies.sort(function(a, b) {
        //     return parseFloat(a.lane) - parseFloat(b.lane);
        // });
        entities.forEach(ally => {
            if (ally.lane > maxLane || ally.lane < minLane) return;
            ally.draw(ctx);
            if(!inputHandler.gamePaused) {
                ally.update(deltaTime);

            }
        })
    }
    let timeTotal = 0;
    //Main loop of the game, sends animate function calls for all objects
    function animate(timeStamp) {
        var deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        ctx.textBaseline = 'middle';
        if(player.gameState == GAME_STATES.inGame) {
            
            itemToDefend.draw(ctx)
            handleEnemies(deltaTime)
            handleAllies(deltaTime)
            ctx.fillStyle = 'yellow'
            ctx.fillRect(allyIcon1.x, allyIcon1.y, allyIcon1.width, allyIcon1.height);
            ctx.fillStyle = 'black';
            ctx.font = '15px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Spawn Ally', allyIcon1.x + 40, allyIcon1.y + 32);
            ctx.fillText('(5 Coins)', allyIcon1.x + 40, allyIcon1.y + 53);
            drawEntitiesInLanes(0, 2, deltaTime);
            player.draw(ctx);
            drawEntitiesInLanes(3, 4, deltaTime);
            
            if(!inputHandler.gamePaused) {
                background.update(deltaTime);
                player.update(deltaTime, enemies);
                itemToDefend.update(deltaTime, ctx)
            } else {
                drawPauseScreen();
            }
            


        } else if (player.gameState === GAME_STATES.gameOver) {
            //lastTime = 0;
            drawGameOverScreen();
        } else if(player.gameState === GAME_STATES.menu) {
            //lastTime = 0;
            drawMenuScreen();
        } else if (player.gameState === GAME_STATES.levelWon) {
            //lastTime = 0;
            drawLevelWonScreen();
        } else if (player.gameState === GAME_STATES.levelSelect) {
            //lastTime = 0;
            drawLevelSelectScreen();
        }
        requestAnimationFrame(animate)


    }
    animate(0)
});