import * as global from "GlobalVar";
import * as constant from "Constant";
import * as globalData from "GlobalData";
import * as gameLibUtils from "GameLibUtils";

cc.Class({
    extends: cc.Component,

    properties: {
        ballsImage:{
            default:[],
            type:[cc.SpriteFrame]
        },

        ballPrefab:{
            default:null,
            type:cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        if(cc.sys.isMobile){
            cc.view.resizeWithBrowserSize(true);
            cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.EXACT_FIT);
        }else{
            this.node.getComponent(cc.Canvas).fitHeight = true;
            this.node.getComponent(cc.Canvas).fitWidth = true;
        }
        cc.game.setFrameRate(60);

        this.canvas = cc.find("Canvas");
        this.levelLayer = cc.find("Canvas/body/levelLayer");
        this.playerBubble = cc.find("Canvas/body/player_bubble");
        this.playerNextBubble = cc.find("Canvas/body/player_nextbubble");
        this.panda = cc.find("Canvas/body/panda");
        this.scoreLabel = cc.find("Canvas/header/score");

        //gameover layer
        this.gameoverLayer = cc.find("Canvas/gameoverLayer");
        this.gameoverScore = cc.find("Canvas/gameoverLayer/scoreText");
        this.aimingline = cc.find("Canvas/body/aimingLine");

        this.gameoverLayer.active = false;

        //live layer
        this.live = [];
        this.live[0] = cc.find("Canvas/header/live/0");
        this.live[1] = cc.find("Canvas/header/live/1");
        this.live[2] = cc.find("Canvas/header/live/2");

        // Game states
        this.gamestate = constant.getGameStates("init");

        // Game level
        cc.log(globalData.getSelectionLevel());
        this.gameLevel = constant.getGameLevel(globalData.getSelectionLevel());

        // Neighbor offset table
        this.neighborsoffsets = [
            [
                [1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]
            ], // Even row tiles
            [
                [1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]
            ]
        ];  // Odd row tiles

        // Score
        this.score = 0;

        //counter to count
        this.turncounter = 0;
        this.rowoffset = 0;

        // Animation variables
        this.animationstate = 0;
        this.animationtime = 0;

        // Clusters
        this.showcluster = false;
        this.cluster = [];
        this.floatingclusters = [];

        this.level = {};

        // Player
        this.player = {
            x: 0,
            y: 0,
            angle: 0,
            tiletype: 0,
            bubble: {
                        x: this.playerBubble.x,
                        y: this.playerBubble.y,
                        angle: 0,
                        speed: 1000,
                        dropspeed: 900,
                        tiletype: 0,
                        visible: false
                    },
            nextbubble: {
                            x: -200,
                            y: -800,
                            tiletype: 0
                        }
        };

        // Game states
        this.initLevel();

        this.level.width = this.level.columns * this.level.tilewidth + this.level.tilewidth/2;
        this.level.height = (this.level.maxrows-1) * this.level.rowheight + this.level.tileheight;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan: function(touch, event) {
                // Get the mouse position
                // Get the mouse angle
                var localTouch = self.canvas.convertToNodeSpaceAR(touch.getLocation());

                var mouseangle = self.radToDeg(Math.atan2((self.player.y) - localTouch.y, localTouch.x - (self.player.x)));
                mouseangle = mouseangle + 180;

                // Restrict angle to 8, 172 degrees
                var lbound = 8;
                var ubound = 172;
                if (mouseangle > 90 && mouseangle < 270) {
                    // Left
                    if (mouseangle > ubound) {
                        mouseangle = ubound;
                    }
                } else {
                    // Right
                    if (mouseangle < lbound || mouseangle >= 270) {
                        mouseangle = lbound;
                    }
                }

                cc.log("mouseangle = " + mouseangle);
                // Set the player angle
                self.player.angle = 180 - mouseangle;
                self.aimingline.rotation = mouseangle;
                return true
            },
            onTouchMoved: function(touch, event) {
                // Get the mouse position
                // Get the mouse angle
                var localTouch = self.canvas.convertToNodeSpaceAR(touch.getLocation());

                var mouseangle = self.radToDeg(Math.atan2((self.player.y) - localTouch.y, localTouch.x - (self.player.x)));
                mouseangle = mouseangle + 180;

                // Restrict angle to 8, 172 degrees
                var lbound = 8;
                var ubound = 172;
                if (mouseangle > 90 && mouseangle < 270) {
                    // Left
                    if (mouseangle > ubound) {
                        mouseangle = ubound;
                    }
                } else {
                    // Right
                    if (mouseangle < lbound || mouseangle >= 270) {
                        mouseangle = lbound;
                    }
                }

                cc.log("mouseangle = " + mouseangle);
                // Set the player angle
                self.player.angle = 180 - mouseangle;
                self.aimingline.rotation = mouseangle;
                return true
            },
            onTouchEnded: function(touch, event) {
                cc.log("MOUSE RELEASE HERE");
                cc.log("self.gamestate = " + self.gamestate)

                if (self.gamestate == constant.getGameStates("ready")) {
                    // Set the gamestate
                    self.panda.getComponent(cc.Animation).play("pandaShoot");
                    self.setGameState(constant.getGameStates("init"));

                    self.scheduleOnce(function(){
                        self.shootBubble();
                    },0.35);

                    self.scheduleOnce(function(){
                        self.panda.getComponent(cc.Animation).play("pandaIdle");
                    },0.5);

                // Get the mouse position
                // var pos = this.getMousePos(this.canvas, e);

                }

                return true
            }
        }, self.node);

        // Init the player
        this.player.x = this.playerBubble.x;
        this.player.y = this.playerBubble.y;
        this.player.angle = 90;
        this.player.tiletype = 0;

        this.createLevel();
        this.renderTiles();

        this.nextBubble();
        this.nextBubble();

        this.renderPlayer();
    },

    initLevel: function () {
        this.gameoverLayer.active = false;

        // Level
        this.level = {
            x: -1080/2 + 45,           // X position
            y: 920 - 75,          // Y position
            width: 1080,       // Width, gets calculated
            height: 1920,      // Height, gets calculated
            columns: 12,    // Number of tile columns
            rows: this.gameLevel.length,       // Number of tile rows
            maxrows: 23,    //max row to lose
            tilewidth: 90,  // Visual width of a tile
            tileheight: 90, // Visual height of a tile
            rowheight: 75,  // Height of a row
            radius: 45,     // Bubble collision radius
            tiles: []       // The two-dimensional tile array
        };

        var Tile = function(x, y, type, shift) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.removed = false;
            this.shift = shift;
            this.velocity = 0;
            this.alpha = 1;
            this.processed = false;
            // this.bubbleNode = "";
        };

        // Initialize the two-dimensional tile array
        for (var i=0; i<this.level.columns; i++) {
            this.level.tiles[i] = [];
            for (var j=0; j<this.level.maxrows; j++) {
                // Define a tile type and a shift parameter for animation
                //remove the end of tiles

                cc.log(i, j);
                cc.log(i == 11, j%2 != 0);

                if (i == 11 && j%2 != 0){
                    cc.log("HERE");
                    this.level.tiles[i][j] = new Tile(i, j, -3, 0);
                    // this.level.tiles[i][j].type = -1;
                    //do nothing
                }else{
                    this.level.tiles[i][j] = new Tile(i, j, -1, 0);
                }
            }
        }

        cc.log(this.level.tiles);
    },

    createLevel: function () {
        // Create a level with random tiles
        cc.log(this.gameLevel);
        for (var j=0; j<this.level.rows; j++) {
            var randomtile = gameLibUtils.getRandomInt(0, this.ballsImage.length-1);
            var count = 0;
            for (var i=0; i<this.level.columns; i++) {
                var randomtile =0;
                var newtile=0;
                // if(this.level.tiles[i][j].type == -1){
                //     // if (count >= 2) {
                //     //     // Change the random tile
                //     //     var newtile = gameLibUtils.getRandomInt(0, this.ballsImage.length-1);

                //     //     // Make sure the new tile is different from the previous tile
                //     //     if (newtile == randomtile) {
                //     //         newtile = (newtile + 1) % this.ballsImage.length;
                //     //     }
                //     //     randomtile = newtile;
                //     //     count = 0;
                //     // }
                //     // count++;

                //     newtile = this.gameLevel[j][i];
                //     randomtile = newtile
                //     if (j < this.level.maxrows-1) {
                //         this.level.tiles[i][j].type = randomtile;
                //     } else {
                //         this.level.tiles[i][j].type = -2;
                //     }
                // }
                newtile = this.gameLevel[j][i];
                    randomtile = newtile
                    if (j < this.level.maxrows-1) {
                        this.level.tiles[i][j].type = randomtile;
                    } else {
                        this.level.tiles[i][j].type = -2;
                    }
            }
        }

        cc.log(this.level.tiles);
        this.setGameState(constant.getGameStates("ready"));
    },

    createHardLevel: function () {
        // Create a level with random tiles
        for (var j=0; j<this.level.rows; j++) {
            var randomtile = gameLibUtils.getRandomInt(0, this.ballsImage.length-1);
            var count = 0;
            for (var i=0; i<this.level.columns; i++) {
                if (count >= 1) {
                    // Change the random tile
                    var newtile = gameLibUtils.getRandomInt(0, this.ballsImage.length-1);

                    // Make sure the new tile is different from the previous tile
                    if (newtile == randomtile) {
                        newtile = (newtile + 1) % this.ballsImage.length;
                    }
                    randomtile = newtile;
                    count = 0;
                }
                count++;

                if (j < this.level.maxrows-1) {
                    this.level.tiles[i][j].type = randomtile;
                } else {
                    this.level.tiles[i][j].type = -2;
                }
            }
        }

        cc.log(this.level.tiles);
        this.setGameState(constant.getGameStates("ready"));
    },

    // Draw the bubble
    drawBubble: function(x, y, index, parent, need_check, no_need_collider) {
        if (index < 0 || index >= this.ballsImage.length)
            return;

        // var tempBubble = new cc.Node("bubble");
        var tempBubble = cc.instantiate(this.ballPrefab);
        if(need_check){
            tempBubble.getComponent("Ball").need_check = true;
        }
        if(no_need_collider){
            tempBubble.getComponent(cc.CircleCollider).enabled = false;
        }
        // tempBubble.addComponent(cc.Sprite);
        tempBubble.getComponent(cc.Sprite).spriteFrame = this.ballsImage[index];
        tempBubble.parent = parent;
        tempBubble.width = this.level.tilewidth;
        tempBubble.height = this.level.tileheight;
        tempBubble.setPosition(cc.v2(x, y));

        return tempBubble
    },

    // Create a random bubble for the player
    nextBubble: function() {
        // Set the current bubble
        this.player.tiletype = this.player.nextbubble.tiletype;
        this.player.bubble.tiletype = this.player.nextbubble.tiletype;
        this.player.bubble.x = this.player.x;
        this.player.bubble.y = this.player.y;
        this.player.bubble.visible = true;
        // this.player.bubbleNode.visible = true;

        // Get a random type from the existing colors
        var nextcolor = gameLibUtils.getRandomInt(0, this.ballsImage.length-1);

        // Set the next bubble
        this.player.nextbubble.tiletype = nextcolor;
    },

    // Render the player bubble
    renderPlayer: function() {
        // var centerx = this.player.x + this.level.tilewidth/2;
        // var centery = this.player.y + this.level.tileheight/2;

        // Draw the angle
        // context.lineWidth = 2;
        // context.strokeStyle = "#0000ff";
        // context.beginPath();
        // context.moveTo(centerx, centery);
        // context.lineTo(centerx + 1.5*level.tilewidth * Math.cos(degToRad(player.angle)), centery - 1.5*level.tileheight * Math.sin(degToRad(player.angle)));
        // context.stroke();

        // Draw the bubble
        this.player.bubbleNode = this.drawBubble(this.player.bubble.x, this.player.bubble.y, this.player.bubble.tiletype, this.levelLayer, true);
        // Draw the next bubble
        this.player.nextBubbleNode = this.drawBubble(this.player.nextbubble.x, this.player.nextbubble.y, this.player.nextbubble.tiletype, this.playerNextBubble, false, true);
        this.setGameState(constant.getGameStates("ready"));
    },

    switchPlayerBubble: function() {
        if( this.gamestate != constant.getGameStates("shootbubble") ){
            this.player.bubbleNode.destroy();
            this.player.nextBubbleNode.destroy();

            var currentType = this.player.bubble.tiletype;
            this.player.bubble.tiletype = this.player.nextbubble.tiletype;
            this.player.nextbubble.tiletype = currentType;

            this.player.tiletype = this.player.bubble.tiletype;

            this.renderPlayer();
        }
    },

    // Shoot the bubble
    shootBubble: function() {
        // Shoot the bubble in the direction of the mouse
        this.player.bubble.x = this.player.x;
        this.player.bubble.y = this.player.y;
        this.player.bubble.angle = this.player.angle;
        this.player.bubble.tiletype = this.player.tiletype;

        this.setGameState(constant.getGameStates("shootbubble"));
    },

    // Render tiles
    renderTiles: function() {
        for (var j=0; j<this.level.maxrows; j++) {
            for (var i=0; i<this.level.columns; i++) {
                if (this.level.tiles[i][j].bubbleNode != null){
                    this.level.tiles[i][j].bubbleNode.destroy();
                    this.level.tiles[i][j].bubbleNode = null;
                }

                this.level.tiles[i][j].removed = false;
                this.level.tiles[i][j].shift = 0;
                this.level.tiles[i][j].velocity = 0;
                this.level.tiles[i][j].alpha = 1;
                this.level.tiles[i][j].processed = false;
            }
        }


        // Top to bottom
        for (var j=0; j<this.level.maxrows; j++) {
            for (var i=0; i<this.level.columns; i++) {
                // Get the tile
                var tile = this.level.tiles[i][j];

                // Get the shift of the tile for animation
                var shift = tile.shift;

                // Calculate the tile coordinates
                var coord = this.getTileCoordinate(i, j);

                // Check if there is a tile present
                if (tile.type >= 0) {
                    // Draw the tile using the color
                    this.level.tiles[i][j].bubbleNode = this.drawBubble(coord.tilex, coord.tiley + shift, tile.type, this.levelLayer , false);
                }
            }
        }

    // cc.log(this.level.tiles);
    },

    // Get the tile coordinate
    getTileCoordinate: function(column, row) {
        var tilex = this.level.x + column * this.level.tilewidth;

        // X offset for odd or even rows
        if ((row + this.rowoffset) % 2) {
            tilex += this.level.tilewidth/2;
        }

        var tiley = this.level.y - row * this.level.rowheight;

        // cc.log(tilex, tiley);
        return { tilex: tilex, tiley: tiley };
    },

    // Get the closest grid position
    getGridPosition: function(x, y) {
        cc.log("getGridPosition");

        var gridy = -1;
        var startingY = this.level.y;
        var startingGridY = 0;

        while(gridy == -1){
            var tempSub = startingY - y;

            if (tempSub < 45){
                gridy = startingGridY;
            }else{
                startingY = startingY - 75;
                startingGridY = startingGridY + 1;
            }
        }

        // Check for offset
        var xoffset = 0;
        if ((gridy + this.rowoffset) % 2) {
            xoffset = this.level.tilewidth / 2;
        }
         // x =120;
        cc.log(x, y);
        cc.log(x+xoffset, y);
        cc.log("Gridx Before round ",(x - this.level.x) / this.level.tilewidth);
        cc.log(this.level.x);
        cc.log(this.level.tilewidth);
        var gridx = Math.round((x - xoffset - this.level.x) / this.level.tilewidth);

        cc.log("gridx = " + gridx);
        cc.log("gridy = " + gridy);

        return { x: gridx, y: gridy };
    },

    // Check if two circles intersect
    circleIntersection: function(x1, y1, r1, x2, y2, r2) {
        // Calculate the distance between the centers
        var dx = x1 - x2;
        var dy = y1 - y2;
        var len = Math.sqrt(dx * dx + dy * dy);

        if (len < r1 + r2) {
            // Circles intersect
            return true;
        }

        return false;
    },

    checkGameOver: function() {
        // Check for game over
        for (var i=0; i<this.level.columns; i++) {
            // Check if there are bubbles in the bottom row
            if (this.level.tiles[i][this.level.maxrows-1].type != -1) {
                // Game over
                this.nextBubble();
                this.setGameState(constant.getGameStates("gameover"));
                cc.log("GAME OVER");
                this.gameoverLayer.active = true;
                this.gameoverScore.getComponent(cc.Label).string = this.score;
                return true;
            }
        }

        return false;
    },

    addBubbles: function() {

        // Move the rows downwards
        for (var i=0; i<this.level.columns; i++) {
            for (var j=0; j<this.level.maxrows-1; j++) {
                this.level.tiles[i][this.level.maxrows-1-j].type = this.level.tiles[i][this.level.maxrows-1-j-1].type;
            }
        }

        // Add a new row of bubbles at the top
        for (var i=0; i<this.level.columns; i++) {
            // Add random, existing, colors
            this.level.tiles[i][0].type = gameLibUtils.getRandomInt(0, this.ballsImage.length-1);
        }

        this.renderTiles();
        cc.log(this.level.tiles);
    },

    // Snap bubble to the grid
    snapBubble: function( indeX, indexY) {
        // Get the grid position
        var gridpos = this.getGridPosition(this.player.bubbleNode.x, this.player.bubbleNode.y);
        cc.log("SNAPPING BUBBLE = " , gridpos);

        // Make sure the grid position is valid
        if (gridpos.x < 0) {
            gridpos.x = 0;
        }

        if (gridpos.x >= this.level.columns) {
            gridpos.x = this.level.columns - 1;
        }

        if (gridpos.y < 0) {
            gridpos.y = 0;
        }

        if (gridpos.y >= this.level.maxrows) {
            gridpos.y = this.level.maxrows - 1;
        }

        if (this.level.tiles[gridpos.x][gridpos.y].type == -3){
            gridpos.x = gridpos.x - 1;
        }

        // Hide the player bubble
        this.player.bubble.visible = false;
        this.player.bubbleNode.visible = false;

        var tempCoor = this.getTileCoordinate(gridpos.x, gridpos.y);
        if(gridpos.x == indeX && gridpos.y == indexY){
            gridpos.y += 1;
            if(this.level.tiles[gridpos.x][gridpos.y].type != -1){
                // var ori = gridpos.x;
                if(this.level.tiles[gridpos.x + 1][gridpos.y].type == -1){
                    gridpos.x+=1;
                }else if(this.level.tiles[gridpos.x - 1][gridpos.y].type == -1){
                    gridpos.x-=1;
                }
            }
            tempCoor = this.getTileCoordinate(gridpos.x, gridpos.y);
            cc.log("Update to new coordinate");
        }


        cc.log("Drawing single bubble");
        cc.log(indeX, indexY);
        cc.log(gridpos);
        cc.log(tempCoor);

        // Set the tile
        cc.log("My type ", this.level.tiles[gridpos.x][gridpos.y].type);
        if(this.level.tiles[gridpos.x][gridpos.y].type == -1){
            this.level.tiles[gridpos.x][gridpos.y].type = this.player.bubble.tiletype;
            this.level.tiles[gridpos.x][gridpos.y].bubbleNode = this.drawBubble(tempCoor.tilex, tempCoor.tiley, this.player.bubble.tiletype, this.levelLayer , false);
        }
        this.player.bubbleNode.destroy();

        for (var j=0; j<this.level.maxrows; j++) {
            for (var i=0; i<this.level.columns; i++) {
                this.level.tiles[i][j].removed = false;
                this.level.tiles[i][j].shift = 0;
                this.level.tiles[i][j].processed = false;
            }
        }

        // Find clusters
        this.cluster = this.findCluster(gridpos.x, gridpos.y, true, true, false);
        cc.log(this.cluster);
        if (this.cluster.length >= 3) {
            // Remove the cluster
            this.setGameState(constant.getGameStates("removecluster"));
            this.scheduleOnce(function(){
                this.removeCluster();
            },0.1);
            return;
        }

        // No clusters found
        // this.turncounter++;

        if (this.turncounter == 1){
            this.live[2].active = false;
            this.live[1].active = true;
            this.live[0].active = true;
        }

        if (this.turncounter == 2){
            this.live[2].active = false;
            this.live[1].active = false;
            this.live[0].active = true;
        }

        if (this.turncounter == 3){
            this.live[2].active = false;
            this.live[1].active = false;
            this.live[0].active = false;
        }

        cc.log("this.turncounter = " + this.turncounter);

        if (this.turncounter >= 4) {
            // Add a row of bubbles
            this.rowoffset = (this.rowoffset + 1) % 2;
            this.addBubbles();
            this.turncounter = 0;

            this.live[2].active = true;
            this.live[1].active = true;
            this.live[0].active = true;

        }

        // Next bubble
        this.nextBubble();

        // Check for game over
        if (this.checkGameOver()) {
            return;
        }

        this.renderPlayer();
    },

    // Find cluster at the specified tile location
    findCluster: function(tx, ty, matchtype, reset, skipremoved) {
        // Reset the processed flags
        if (reset) {
            this.resetProcessed();
        }

        // Get the target tile. Tile coord must be valid.
        var targettile = this.level.tiles[tx][ty];
        // cc.log("Target **********************");
        // cc.log(targettile);

        // Initialize the toprocess array with the specified tile
        var toprocess = [targettile];
        // cc.log(toprocess);
        targettile.processed = true;
        var foundcluster = [];

        while (toprocess.length > 0) {
            // Pop the last element from the array
            var currenttile = toprocess.pop();

            // Skip processed and empty tiles
            if (currenttile.type < 0) {
                continue;
            }

            // Skip tiles with the removed flag
            if (skipremoved && currenttile.removed) {
                continue;
            }

            // Check if current tile has the right type, if matchtype is true
            if (!matchtype || (currenttile.type == targettile.type)) {
                // Add current tile to the cluster
                foundcluster.push(currenttile);

                // Get the neighbors of the current tile
                var neighbors = this.getNeighbors(currenttile);
                cc.log("My neighbors", neighbors);
                // Check the type of each neighbor
                for (var i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        // Add the neighbor to the toprocess array
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
            }
        }

        // Return the found cluster
        return foundcluster;
    },

    // Find floating clusters
    findFloatingClusters: function() {
        // Reset the processed flags
        this.resetProcessed();

        var foundclusters = [];

        // Check all tiles
        for (var i=0; i<this.level.columns; i++) {
            for (var j=0; j<this.level.maxrows; j++) {
                var tile = this.level.tiles[i][j];
                if (!tile.processed) {
                    // Find all attached tiles
                    var foundcluster = this.findCluster(i, j, false, false, true);

                    // There must be a tile in the cluster
                    if (foundcluster.length <= 0) {
                        continue;
                    }

                    // Check if the cluster is floating
                    var floating = true;
                    for (var k=0; k<foundcluster.length; k++) {
                        if (foundcluster[k].y == 0) {
                            // Tile is attached to the roof
                            floating = false;
                            break;
                        }
                    }

                    if (floating) {
                        // cc.log("foundcluster");
                        // cc.log(foundcluster);
                        // Found a floating cluster
                        foundclusters.push(foundcluster);
                    }
                }
            }
        }

        return foundclusters;
    },

    // Reset the processed flags
    resetProcessed: function() {
        for (var i=0; i<this.level.columns; i++) {
            for (var j=0; j<this.level.rows; j++) {
                this.level.tiles[i][j].processed = false;
            }
        }
    },

    // Reset the removed flags
    resetRemoved: function() {
        for (var i=0; i<this.level.columns; i++) {
            for (var j=0; j<this.level.rows; j++) {
                this.level.tiles[i][j].removed = false;
            }
        }
    },

    // Get the neighbors of the specified tile
    getNeighbors: function(tile) {
        var tilerow = (tile.y + this.rowoffset) % 2; // Even or odd row
        var neighbors = [];

        // Get the neighbor offsets for the specified tile
        var n = this.neighborsoffsets[tilerow];

        // Get the neighbors
        for (var i=0; i<n.length; i++) {
            // Neighbor coordinate
            var nx = tile.x + n[i][0];
            var ny = tile.y + n[i][1];

            // Make sure the tile is valid
            if (nx >= 0 && nx < this.level.columns && ny >= 0 && ny < this.level.maxrows) {
                neighbors.push(this.level.tiles[nx][ny]);
            }
        }

        return neighbors;
    },

    // Convert radians to degrees
    radToDeg: function(angle) {
        return angle * (180 / Math.PI);
    },

    // Convert degrees to radians
    degToRad: function(angle) {
        return angle * (Math.PI / 180);
    },

    setGameState: function(newgamestate) {
        this.gamestate = newgamestate;

        this.animationstate = 0;
        this.animationtime = 0;
    },

    restartGame: function() {
        var self = this;

        for (var j=0; j<self.level.maxrows; j++) {
            for (var i=0; i<self.level.columns; i++) {
                if (self.level.tiles[i][j].bubbleNode != null){
                    self.level.tiles[i][j].bubbleNode.destroy();
                    self.level.tiles[i][j].bubbleNode = null;
                }
            }
        }

        self.score = 0;
        self.scoreLabel.getComponent(cc.Label).string = this.score;
        cc.log("starting new game");
        self.initLevel();
        self.createLevel();
        self.renderTiles();

        self.nextBubble();
        self.nextBubble();

        self.renderPlayer();

        self.setGameState(constant.getGameStates("ready"));
    },

    removeCluster: function(){
        this.resetRemoved();

        // Mark the tiles as removed
        for (var i=0; i<this.cluster.length; i++) {
            // Set the removed flag
            this.cluster[i].removed = true;
        }

        // this.renderTiles();
        for (var j=0; j<this.level.maxrows; j++) {
            for (var i=0; i<this.level.columns; i++) {
                this.level.tiles[i][j].removed = false;
                this.level.tiles[i][j].shift = 0;
                this.level.tiles[i][j].processed = false;
            }
        }

        // Add cluster score
        this.score += this.cluster.length * 100;
        var self = this;
        function delayRemoveItem(x, y, time){
            self.scheduleOnce(function(){
                self.level.tiles[x][y].bubbleNode.stopAllActions();
                self.level.tiles[x][y].bubbleNode.destroy();
                self.level.tiles[x][y].bubbleNode = null;
            },time);
        }

        for (var i =0; i<this.cluster.length; i++){
            var action = cc.moveBy(0.5, cc.v2(0,-50));
            var action2 = cc.fadeOut(0.5);
            this.level.tiles[this.cluster[i].x][this.cluster[i].y].bubbleNode.runAction(action);
            this.level.tiles[this.cluster[i].x][this.cluster[i].y].bubbleNode.runAction(action2);
            this.level.tiles[this.cluster[i].x][this.cluster[i].y].type = -1;
            delayRemoveItem(this.cluster[i].x, this.cluster[i].y, 0.5);
        }

        // Find floating clusters
        this.floatingclusters = this.findFloatingClusters();

        this.scoreLabel.getComponent(cc.Label).string = this.score;
        // cc.log("floatingclusters");
        // cc.log(this.floatingclusters);

        for (var i =0; i<this.floatingclusters.length; i++){
            for (var j=0; j<this.floatingclusters[i].length; j++){
                var action = cc.moveBy(0.5, cc.v2(0,-50));
                var action2 = cc.fadeOut(0.5);
                this.level.tiles[this.floatingclusters[i][j].x][this.floatingclusters[i][j].y].bubbleNode.runAction(action);
                this.level.tiles[this.floatingclusters[i][j].x][this.floatingclusters[i][j].y].bubbleNode.runAction(action2);
                this.level.tiles[this.floatingclusters[i][j].x][this.floatingclusters[i][j].y].type = -1;
                delayRemoveItem(this.floatingclusters[i][j].x, this.floatingclusters[i][j].y, 0.5);
                this.score = this.score + 100;
            }
        }

        // Next bubble
        // this.nextBubble();

        // Check for game over
        var tilefound = false
        for (var i=0; i<this.level.columns; i++) {
            for (var j=0; j<this.level.maxrows; j++) {
                if (this.level.tiles[i][j].type >= 0) {
                    tilefound = true;
                    break;
                }
            }
        }

        if(tilefound){
            // Next bubble
            this.nextBubble();
            // this.renderTiles();
            for (var j=0; j<this.level.maxrows; j++) {
                for (var i=0; i<this.level.columns; i++) {
                    this.level.tiles[i][j].removed = false;
                    this.level.tiles[i][j].shift = 0;
                    this.level.tiles[i][j].processed = false;
                }
            }

            this.player.bubbleNode.destroy();
            this.renderPlayer();
        }else{
            for (var j=0; j<this.level.maxrows; j++) {
                for (var i=0; i<this.level.columns; i++) {
                    if (this.level.tiles[i][j].bubbleNode != null){
                        this.level.tiles[i][j].bubbleNode.destroy();
                        this.level.tiles[i][j].bubbleNode = null;
                    }
                }
            }

            cc.log("starting new game");
            this.initLevel();
            this.createHardLevel();

            this.score = this.score + 10000;

            this.renderTiles();
            this.nextBubble();
            this.renderPlayer();

            this.setGameState(constant.getGameStates("ready"));
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.gamestate == constant.getGameStates("shootbubble")) {
            // Move the bubble in the direction of the mouse
            this.player.bubbleNode.x +=  30 * Math.cos(this.degToRad(this.player.bubble.angle));
            this.player.bubbleNode.y += 30 * Math.sin(this.degToRad(this.player.bubble.angle));

            this.player.bubble.x = this.player.bubbleNode.x;
            this.player.bubble.y = this.player.bubbleNode.y;

            // Handle left and right collisions with the level
            if (this.player.bubbleNode.x <= this.level.x) {
                // Left edge
                this.player.bubble.angle = 180 - this.player.bubble.angle;
                this.player.bubbleNode.angle = this.player.bubble.angle;
                this.player.bubbleNode.x = this.level.x;

            } else if (this.player.bubbleNode.x + this.level.tilewidth >= this.level.x + this.level.width) {
                // Right edge
                this.player.bubble.angle = 180 - this.player.bubble.angle;
                this.player.bubbleNode.angle = this.player.bubble.angle;
                this.player.bubbleNode.x = this.level.x + this.level.width - this.level.tilewidth;
            }

            // Collisions with the top of the this.level
            if (this.player.bubbleNode.y >= this.level.y) {
                // Top collision
                this.player.bubbleNode.y = this.level.y;
                this.snapBubble();
                return;
            }

            // Collisions with other tiles
            for (var i=0; i<this.level.columns; i++) {
                for (var j=0; j<this.level.maxrows; j++) {
                    var tile = this.level.tiles[i][j];

                    // Skip empty tiles
                    if (tile.type < 0) {
                        continue;
                    }

                    //help change to using cocos collision to detect collision
                    // Check for intersections
                    var coord = this.getTileCoordinate(i, j);
                    if (this.circleIntersection(this.player.bubbleNode.x, this.player.bubbleNode.y, this.level.radius,
                                           coord.tilex, coord.tiley, this.level.radius)) {

                        cc.log("player bubble", this.player.bubbleNode.x, this.player.bubbleNode.y);
                        cc.log("collided with", i, j);
                        // Intersection with a level bubble
                        this.snapBubble(i , j);
                        return;
                    }
                }
            }
        } /*else if (this.gamestate == constant.getGameStates("removecluster")) {
            // Remove cluster and drop tiles

            // } else {
                // No tiles left, game over
                // this.setGameState(constant.getGameStates("gameover"));
            // }
        }*/
    },
});
