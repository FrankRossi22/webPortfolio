//const ENEMY_TYPES = { basic: {loot: 10, damage: 15, health: 50} };
const ENTITY_TYPES = {enemy: {isEnemy: 1, healthBar_Color: 'maroon'}, ally: {isEnemy: -1, healthBar_Color: 'green'}}
const ENEMY_TYPES = { mushroom: {damage: 15, health: 50, sheet: 'mushRun', height: 194, width: 240, yOffset: 45,
        healthbar_offset: {x: 0, y: 70}, flipped: false,
        sprites: {
            idle: {id: 1, maxFrame: 6, frameY: 0}, 
            run: {id: 3, maxFrame: 7, frameY: 1},
            attack: {id: 2, maxFrame: 9, frameY: 2},
            die: {id: 5, maxFrame: 15, frameY: 3},
            getHit: {id: 6, maxFrame: 5, frameY: 4},
            dead: {id: 4, maxFrame: 0, frameY: -1}
    }},
    goblin: {damage: 10, health: 40, sheet: 'goblin', height: 300, width: 300, yOffset: -45,
        healthbar_offset: {x: 0, y: 110}, flipped: true,
        sprites: {
            idle: {id: 1, maxFrame: 3, frameY: 0}, 
            run: {id: 3, maxFrame: 7, frameY: 1},
            attack: {id: 2, maxFrame: 7, frameY: 2},
            die: {id: 5, maxFrame: 3, frameY: 4},
            getHit: {id: 6, maxFrame: 3, frameY: 0},
            dead: {id: 4, maxFrame: 7, frameY: -1}
    }},
    skeleton: {damage: 15, health: 50, sheet: 'skeleton', height: 300, width: 300, yOffset: -45,
        healthbar_offset: {x: 0, y: 80}, flipped: true,
        sprites: {
            idle: {id: 1, maxFrame: 3, frameY: 0}, 
            run: {id: 3, maxFrame: 3, frameY: 1},
            attack: {id: 2, maxFrame: 7, frameY: 2},
            die: {id: 5, maxFrame: 3, frameY: 3},
            getHit: {id: 6, maxFrame: 3, frameY: 4},
            dead: {id: 4, maxFrame: 3, frameY: -1}
    }},
    test: {damage: 15, health: 50, sheet: 't', height: 320, width: 320, yOffset: -45,
        healthbar_offset: {x: 20, y: 80}, flipped: true,
        sprites: {
            idle: {id: 1, maxFrame: 5, frameY: 0}, 
            run: {id: 3, maxFrame: 5, frameY: 1},
            attack: {id: 2, maxFrame: 5, frameY: 3},
            die: {id: 5, maxFrame: 5, frameY: 2},
            getHit: {id: 6, maxFrame: 5, frameY: 4},
            dead: {id: 4, maxFrame: 5, frameY: -1}
    }}, 
    runTest: {damage: 15, health: 50, sheet: 'runTest', height: 320, width: 320, yOffset: -45,
        healthbar_offset: {x: 20, y: 80}, flipped: true,
        sprites: {
            idle: {id: 1, maxFrame: 7, frameY: 0}, 
            run: {id: 3, maxFrame: 7, frameY: 0},
            attack: {id: 2, maxFrame: 7, frameY: 1},
            die: {id: 5, maxFrame: 7, frameY: 1},
            getHit: {id: 6, maxFrame: 7, frameY: 0},
            dead: {id: 4, maxFrame: 5, frameY: -1}
    }},
    wizard: {damage: 15, health: 50, sheet: 'wizard', height: 322, width: 320, yOffset: 0,
        healthbar_offset: {x: 20, y: 80}, flipped: true,
        sprites: {
            idle: {id: 1, maxFrame: 6, frameY: 0}, 
            run: {id: 3, maxFrame: 7, frameY: 1},
            attack: {id: 2, maxFrame: 13, frameY: 6},
            die: {id: 5, maxFrame: 5, frameY: 5},
            getHit: {id: 6, maxFrame: 2, frameY: 8},
            dead: {id: 4, maxFrame: 5, frameY: -1}
    }}, 
};


const MOB_LIMIT = 5; //set to 5 for testing, should eventually be done per stage in game
const ENEMY_LOOT = {'basic': 1000};
const GAME_STATES = {'inGame': 1, 'paused': 2, 'gameOver': 3, 'menu': 4, 'levelWon': 5, 'levelSelect': 6};
const PLAYER_SPRITES = {    //Sprites double as State
    idle: {id: 1, maxFrame: 6, frameY: 0}, 
    run: {id: 3, maxFrame: 7, frameY: 1},
    walk: {id: 5, maxFrame: 7, frameY: 2},
    attack1: {id: 2, maxFrame: 5, frameY: 3},
    death: {id: 4, maxFrame: 11, frameY: 4},
    jump: {id: 6, maxFrame: 4, frameY: 5}
};
const PLAYER_STATES = {
    idle: 1,
    attacking: 2,
    running: 3,
    dead: 4,
};
const ENEMY_STATES = {
    idle: 1,
    attacking: 2,
    running: 3,
    dead: 4,
    dying: 5
};
const MUSH_SPRITES = {
    idle: {id: 1, maxFrame: 5, frameY: 0}, 
    run: {id: 3, maxFrame: 6, frameY: 1},
    attack: {id: 2, maxFrame: 8, frameY: 2},
    die: {id: 5, maxFrame: 14, frameY: 3},
    getHit: {id: 6, maxFrame: 4, frameY: 4},
    dead: {id: 4, maxFrame: 0, frameY: -1}
};

const HEALTHBAR_OFFSETS = {
    mushroom: {x: 0, y: 70}
};

const PLAYER_SPEED = 120 / 1000;
let ENEMY_SPEED = 90 / 1000;
const GAME_SPEED = 5;

let enemyDamageModifier = 1;
let playerDamageModifier = 1;
let backgroundMoving = true;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 720;
const COIN_UPGRADE_COSTS = {1: 3, 2:20, 3: 30}
const ANVIL_LEVELS = {1: {nextCost: 3, rateChange: .2},
    2:{nextCost: 20, rateChange: .3}, 3:{nextCost: 30, rateChange: .4}}
const PLAYER_DATA = {
    width: 288,
    height: 254,
    fps: 10,
    maxHealth: 100,
    attackDamage: 25,
    healthRegenSpeed: 1, //in frames so 10 == once per second with 10 fps
    healthRegenAmount: .3, //default regen is 1 health per regen tick 
    coinGainSpeed: 2, //in frames so 10 == once per second with 10 fps
    
};

const allyIcon1 = {x: 0, y: GAME_HEIGHT - 80, width: 80, height: 80};
const coinUpgradeBox = {x:  GAME_WIDTH - 170, y: 25, width: 85, height: 40};
const coinCounterBox =  {x: GAME_WIDTH - 85, y: 20, width: 70, height: 50}


const MAIN_MENU_ITEMS = ['Start Game', 'Level Select','Options', 'High Scores'];
const MENU_ITEM_DIMS = {width: 300, height: 70}; 
const MENU_ITEM_TEXT_POS = {x: (GAME_WIDTH / 2) - (MENU_ITEM_DIMS.width / 2), y: GAME_HEIGHT / 2 - (MAIN_MENU_ITEMS.length * MENU_ITEM_DIMS.height) / 2 }
const MENU_RECT_OFFSET = (((MENU_ITEM_DIMS.height) / 2));
const MENU_ITEM_RECTS = {x: MENU_ITEM_TEXT_POS.x, y: MENU_ITEM_TEXT_POS.y - (((MENU_ITEM_DIMS.height) / 2)) + 5,
             width: MENU_ITEM_DIMS.width, height: MENU_ITEM_DIMS.height - 10 };

const PAUSE_MENU_ITEMS = ['Main Menu'];
const PAUSE_MENU_ITEM_DIMS = {width: 300, height: 60}; 
const PAUSE_MENU_ITEM_TEXT_POS = {x: (GAME_WIDTH / 2) - (PAUSE_MENU_ITEM_DIMS.width / 2), y: GAME_HEIGHT / 2 - (PAUSE_MENU_ITEMS.length * PAUSE_MENU_ITEM_DIMS.height) / 2 + 120}
const PAUSE_MENU_RECT_OFFSET = (27 + ((PAUSE_MENU_ITEM_DIMS.height - 30) / 2));
const PAUSE_MENU_ITEM_RECTS = {x: PAUSE_MENU_ITEM_TEXT_POS.x, y: PAUSE_MENU_ITEM_TEXT_POS.y - (((PAUSE_MENU_ITEM_DIMS.height) / 2)) + 5,
             width: PAUSE_MENU_ITEM_DIMS.width, height: PAUSE_MENU_ITEM_DIMS.height - 10 };


const BACKGROUND_IMAGE_OFFSETS = {0: 600, 1: 380, 2: 230, 3: 0, 4: 0, 5: 0, 6: 0}

const NUM_LEVELS = 3;

const LEVELS = {1: [{"time": 2000, "enemy": "test"}, {"time": 6000, "enemy": "goblin"}, {"time": 8000, "enemy": "test"},
        {"time": 10000, "enemy": "test"}, {"time": 12000, "enemy": "test"}, {"time": 13500, "enemy": "goblin"},
        {"time": 17000, "enemy": "skeleton"}, {"time": 18000, "enemy": "goblin"}, {"time": 18500, "enemy": "skeleton"}], 
 2: [{"time": 1000, "enemy": "goblin"}, {"time": 6000, "enemy": "goblin"}, {"time": 8000, "enemy": "test"},
        {"time": 10000, "enemy": "test"}, {"time": 12000, "enemy": "test"}, {"time": 13500, "enemy": "goblin"},
        {"time": 17000, "enemy": "skeleton"}, {"time": 18000, "enemy": "goblin"}, {"time": 18500, "enemy": "skeleton"}],
 3: [{"time": 2000, "enemy": "wizard"}, {"time": 6000, "enemy": "wizard"}, {"time": 8000, "enemy": "test"},
        {"time": 10000, "enemy": "test"}, {"time": 12000, "enemy": "test"}, {"time": 13500, "enemy": "goblin"},
        {"time": 17000, "enemy": "skeleton"}, {"time": 18000, "enemy": "goblin"}, {"time": 18500, "enemy": "skeleton"}]};