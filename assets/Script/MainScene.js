import * as global from "GlobalVar";
import * as constant from "Constant";
import * as globalData from "GlobalData";
import * as gameLibUtils from "GameLibUtils";
import * as ecrypt from "ecrypt";

cc.Class({
    extends: cc.Component,

    properties: {
        generatingBalance:false,
        loadingLayer:{
            default:null,
            type:cc.Node,
        },
        maxWinLable:{
            default: null,
            type: cc.Label,
        },

        maxWin: 200,
        physicCollider: {
            default: null,
            type: cc.Node,
        },
        physicCollider2: {
            default: null,
            type: cc.Node,
        },
        currentPath:0,
        _cur_length: 0,
        scoreSpeed: 0,
        startLocation: cc.v2(1038.41, 359.46),
        graphic_line: {
            default: null,
            type: cc.Graphics,
        },

        myFont: {
            default: null,
            type: cc.Font,
        },
        cameraAnim: {
            default: null,
            type: cc.Animation
        },


        total_bet: 0,
        downside: false,
        total_add: 0,
        timerCount: 0,
        resumeCount: 0,
        finalWin: 0,
        alreadyCheck: false,
        isJackPot: false,
        dropspeed: 1,
        isAwb: false,
        isMovingCamera: false,
        delayTime: 0,

        scoreParent: {
            default: null,
            type: cc.Node
        },
        explosion: {
            default: null,
            type: cc.Prefab
        },
        explosion2: {
            default: null,
            type: cc.Prefab
        },
        spark: {
            default: null,
            type: cc.Node
        },

        goToHome: {
            default: null,
            type: cc.Node
        },

        fillingJackPotSound: {
            default: null,
            type: cc.AudioClip
        },
        boomExplodeSound: {
            default: null,
            type: cc.AudioClip
        },
        jackPotBoomSound: {
            default: null,
            type: cc.AudioClip
        },
        bubblePopCount: 0,
        resultBalanceLabel: {
            default: null,
            type: cc.Label
        },
        resultLabelText: {
            default: null,
            type: cc.Label
        },
        total_betLabel: {
            default: null,
            type: cc.Label
        },

        switchBtn: {
            default: null,
            type: cc.Button
        },
        dragon: {
            default: null,
            type: cc.Node
        },
        timerObject: {
            default: null,
            type: cc.Node
        },
        creditAddLabel: {
            default: null,
            type: cc.Label
        },
        slotCount: {
            default: [],
            type: [cc.Label]

        },
        ballInSlotCount: {
            default: [],
            type: [cc.Integer]
        },
        resumeLabel: {
            default: null,
            type: cc.Label,
        },

        insufficient: {
            default: null,
            type: cc.Node,
        },
        timerLabel: {
            default: null,
            type: cc.Label,
        },
        creditLabel: {
            default: null,
            type: cc.Label,
        },
        quitButton: {
            default: null,
            type: cc.Node,
        },
        settingLayer: {
            default: null,
            type: cc.Node,

        },
        musicToggle: {
            default: null,
            type: cc.Toggle,
        },
        inGameBetting: {
            default: null,
            type: cc.Node,
        },

        ballsImage: {
            default: [],
            type: [cc.SpriteFrame]
        },

        aimingBallsImage: {
            default: [],
            type: [cc.SpriteFrame]
        },

        bubbleBurstAnimation: {
            default: null,
            type: cc.AnimationClip
        },

        starBurstAnimation: {
            default: null,
            type: cc.AnimationClip
        },

        ballPrefab: {
            default: null,
            type: cc.Prefab
        },

        bgm: {
            default: null,
            type: cc.AudioClip
        },

        shootingEffect: {
            default: null,
            type: cc.AudioClip
        },

        bubblePop: {
            default: null,
            type: cc.AudioClip
        },

        bonusBubble: {
            default: null,
            type: cc.AudioClip
        },

        starEffect: {
            default: null,
            type: cc.AudioClip
        },

        winEffect: {
            default: null,
            type: cc.AudioClip
        },

        loseEffect: {
            default: null,
            type: cc.AudioClip
        },

        cheeringSound: {
            default: null,
            type: cc.AudioClip
        },

        buttonClick: {
            default: null,
            type: cc.AudioClip
        },
        betbuttonClick: {
            default: null,
            type: cc.AudioClip
        },
        starBlink: {
            default: null,
            type: cc.AudioClip
        },
        slotCollider: {
            default: null,
            type: cc.Node

        },

        alrAdd: 0,
        slotsOriginPosition: {
            default: [],
            type: [cc.Integer]
        },

        missedTime: 0,
        clusterMadeTime: 0,
        missForDrop: {
            default: 3,
            type: cc.Integer
        },

        rowToSpawn: {
            default: 2,
            type: cc.Integer
        },

        valueToFillAWB: {
            default: 6,
            type: cc.Integer
        },

        isPausing: false,
        scoreToAdd: 0,
        scoreAnimate: false,
        progressValue: 0,
        selfClickEnd:false,

        changeColorLayer:{
            default: null,
            type: cc.Node
        },
        message:{
			default:null,
			type:cc.Label
		},
        prompt:{
            default:null,
            type:cc.Node
        },
    },

    openChangeColor(){
        this.changeColorLayer.active=true;
    },
    closeChangeColor(){
        this.changeColorLayer.active=false;
    },
    changeColorFunction(event, value){
        this.player.tiletype = Number(value);
        this.player.bubble.tiletype = Number(value);
        this.player.bubbleNode.getComponent(cc.Sprite).spriteFrame = this.ballsImage[Number(value)];
        for (var i = 0; i < this.aimingline.bubbles.length; i++) {
            this.aimingline.bubbles[i].getComponent(cc.Sprite).spriteFrame = this.aimingBallsImage[this.player.bubble.tiletype];
        }
        this.changeColorLayer.active=false;
    },
    // use this for initialization
    onLoad: function () {
        const isIOS14Device = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && /iPhone OS 14/.test(window.navigator.userAgent);
        if (isIOS14Device) {
            cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
                if (this.vertexOffset + vertexCount > 65535) {
                    this.uploadData();
                    this._batcher._flush();
                }
            };
            cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
                this.uploadData();
                this.switchBuffer();
            }
        }
        window.onbeforeunload = function(){
          this.close_window();
        }
        window.onunload = function(){
          this.close_window();
        }

        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        this.slotCollider.active = false;
        this.ballInSlotCount = [0, 0, 0, 0, 0];
        var self = this;
        this.ctx = this.node.getComponent(cc.Graphics);
        this.mainSceneBgm = cc.audioEngine.playMusic(this.bgm, true);
        cc.audioEngine.setMusicVolume(globalData.getEffectVolume() / 6);

        if (cc.sys.isMobile) {
            cc.view.resizeWithBrowserSize(true);
            cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.SHOW_ALL);
        } else {
            this.node.getComponent(cc.Canvas).fitHeight = true;
            this.node.getComponent(cc.Canvas).fitWidth = true;
        }
        cc.game.setFrameRate(60);
        cc.log("level max = " + globalData.getCurrentPlayerLevel());
        this.canvas = cc.find("Canvas");
        this.levelLayer = cc.find("Canvas/body/level_layer");
        this.staticLevelLayer = cc.find("Canvas/body/static_layer");
        this.playerBubble = cc.find("Canvas/body/player_bubble");
        this.playerNextBubble = cc.find("Canvas/body/player_nextbubble");
        this.panda = cc.find("Canvas/body/panda");
        this.tbao = cc.find("Canvas/body/tbao");
        this.scoreLabel = cc.find("Canvas/body/header/score");
        this.pandaScoreLabel = cc.find("Canvas/body/header/panda_score");
        this.aimingline = cc.find("Canvas/body/aiming_line");
        this.progressBar = cc.find("Canvas/body/FILLBAR").getComponent(cc.ProgressBar);
        this.tbao.getComponent(cc.Animation).play("tbao_idle");
        this.aimingline.bubbles = [];
        this.inGameBetting = this.inGameBetting.getComponent("InGameBetting");
        for (var i = 0; i < 10; i++) {
            this.aimingline.bubbles[i] = cc.find("Canvas/body/aiming_line/" + i);
        }

        for (var i = 4; i < 10; i++) {
            this.aimingline.bubbles[i].active = false;
        }

        //blockingLayer when the level is moving
        this.movingBlockingLayer = cc.find("Canvas/body/moving_blocking_layer");
        this.movingBlockingLayer.active = false;

        this.remainingBubblesText = cc.find("Canvas/body/switch_btn/remaining_bubbles");
        this.totalBubbles = 0;
        this.highScore = [0, 0, 0];
        this.availableBubblesColor = [false, false, false, false];

        this.resultLayer = cc.find("Canvas/body/result_layer");
        this.resultLayer.pauseLabel = cc.find("Canvas/body/result_layer/pause");
        this.resultLayer.gameoverLabel = cc.find("Canvas/body/result_layer/result_popup/gameover");
        this.resultLayer.resultPopup = cc.find("Canvas/body/result_layer/result_popup");
        this.resultLayer.resultPopup.lose_panda = cc.find("Canvas/body/result_layer/result_popup/lose_panda");

        this.resultLayer.resultPopup.emptyStar = [];
        this.resultLayer.resultPopup.emptyStar[0] = cc.find("Canvas/body/result_layer/result_popup/empty_star1");
        this.resultLayer.resultPopup.emptyStar[1] = cc.find("Canvas/body/result_layer/result_popup/empty_star2");
        this.resultLayer.resultPopup.emptyStar[2] = cc.find("Canvas/body/result_layer/result_popup/empty_star3");

        this.resultLayer.resultPopup.star = [];
        this.resultLayer.resultPopup.star[0] = cc.find("Canvas/body/result_layer/result_popup/star1");
        this.resultLayer.resultPopup.star[1] = cc.find("Canvas/body/result_layer/result_popup/star2");
        this.resultLayer.resultPopup.star[2] = cc.find("Canvas/body/result_layer/result_popup/star3");

        this.resultLayer.resultPopup.starEffect = [];
        this.resultLayer.resultPopup.starEffect[0] = cc.find("Canvas/body/result_layer/result_popup/star_effect1");
        this.resultLayer.resultPopup.starEffect[1] = cc.find("Canvas/body/result_layer/result_popup/star_effect2");
        this.resultLayer.resultPopup.starEffect[2] = cc.find("Canvas/body/result_layer/result_popup/star_effect3");

        this.resultLayer.resultPopup.resultLabel = cc.find("Canvas/body/result_layer/result_popup/result_label");
        this.resultLayer.resultPopup.resultLabel2 = cc.find("Canvas/body/result_layer/result_popup/result2_label");

        this.resultLayer.resultPopup.levelLabel = cc.find("Canvas/body/result_layer/result_popup/level_label");
        this.resultLayer.resultPopup.scoreLabel = cc.find("Canvas/body/result_layer/result_popup/gameover/score_label");

        this.resultLayer.resultPopup.playButton = cc.find("Canvas/body/result_layer/result_popup/btn_play");
        this.resultLayer.resultPopup.nextButton = cc.find("Canvas/body/result_layer/result_popup/btn_next");

        this.resultLayer.resultPopup.retryButton = cc.find("Canvas/body/result_layer/result_popup/retry_btn");
        this.resultLayer.resultPopup.retryButton2 = cc.find("Canvas/body/result_layer/result_popup/retry_btn2");

        this.resultLayer.resultPopup.homeButton = cc.find("Canvas/body/result_layer/result_popup/btn_home");
        this.resultLayer.resultPopup.homeButton2 = cc.find("Canvas/body/result_layer/result_popup/btn_home2");

        this.resultLayer.resultPopup.nextStarLabel = cc.find("Canvas/body/result_layer/result_popup/next_star_label");
        //live layer
        // this.live = [];
        // this.live[0] = cc.find("Canvas/header/live/0");
        // this.live[1] = cc.find("Canvas/header/live/1");
        // this.live[2] = cc.find("Canvas/header/live/2");

        // Game states
        this.gamestate = constant.getGameStates("init");

        // Game level
        cc.log(globalData.getSelectionLevel());
        this.gameLevel = constant.getGameLevel(globalData.getSelectionLevel());
        this.remainingBubbles = constant.getBubblesAmount(globalData.getSelectionLevel());
        this.remainingBubblesText.getComponent(cc.Label).string = this.remainingBubbles;

        this.baseBubbles = constant.getBaseBubblesAmount(globalData.getSelectionLevel());

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
        this.columnoffset = 0;

        // Animation variables
        this.animationstate = 0;
        this.animationtime = 0;

        // Clusters
        this.showcluster = false;
        this.cluster = [];
        this.floatingclusters = [];
        this.droppingBall = false;
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
                x: this.playerNextBubble.x,
                y: this.playerNextBubble.y,
                tiletype: 0
            }
        };

        // Game states
        this.initLevel();

        this.level.width = this.level.columns * this.level.tilewidth;
        this.level.height = (this.level.maxrows - 1) * this.level.rowheight + this.level.tileheight;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            onTouchBegan: function (touch, event) {
                //self.graphic_line.clear();
                self.timerCount = 0;
                if (self.gamestate == constant.getGameStates("ready")) {

                    for (var i = 0; i < 10; i++) {
                        self.aimingline.bubbles[i].active = true;
                    }

                    self.slotCollider.active = false;

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
                    return true;
                }
            },
            onTouchMoved: function (touch, event) {
                self.graphic_line.clear();
                //this.drawRayCast(startLocation, location.subSelf(startLocation).normalizeSelf());
                if (self.gamestate == constant.getGameStates("ready")) {
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

                    // cc.log("mouseangle = " + mouseangle);
                    // Set the player angle
                    self.player.angle = 180 - mouseangle;
                    self.aimingline.rotation = mouseangle;
                    self._cur_length = 0;
                    var location = touch.getLocation();
                    // 计算射线
                    if (location.y >= 400 && location.y <= 600) {
                        self.downside = true;
                    }
                    if (location.y > 600) {
                        self.downside = false;
                    }

                    if (location.y > 400) {
                        self.drawRayCast(self.startLocation, location.subSelf(self.startLocation).normalizeSelf());
                    }


                    self.graphic_line.stroke();

                    return true
                }
            },
            onTouchEnded: function (touch, event) {
                self.graphic_line.clear();
                self.timerCount = 0;
                cc.log("MOUSE RELEASE HERE");
                cc.log("self.gamestate = " + self.gamestate)

                var localTouch = self.canvas.convertToNodeSpaceAR(touch.getLocation());

                for (var i = 4; i < 10; i++) {
                    self.aimingline.bubbles[i].active = false;
                }

                if (self.gamestate == constant.getGameStates("ready")) {
                    // Set the gamestate
                    self.total_bet = self.total_bet + self.inGameBetting.getComponent("InGameBetting").currentBetting;
                    self.panda.getComponent(cc.Animation).play("pandaShoot");
                    self.dragon.getComponent(cc.Animation).play("dragonShooting");
                    self.setGameState(constant.getGameStates("init"));

                    self.scheduleOnce(function () {
                        self.shootBubble();
                    }, 0.1);

                    self.scheduleOnce(function () {
                        self.panda.getComponent(cc.Animation).play("pandaIdle");
                    }, 0.5);


                    // Get the mouse position
                    // var pos = this.getMousePos(this.canvas, e);

                }

                return true;
            }
        }, self.node);

        // Init the player
        this.player.x = this.playerBubble.x;
        this.player.y = this.playerBubble.y;
        this.player.angle = 90;
        this.player.tiletype = 0;

        this.total_panda = 0;
        this.panda_destroyed = 0;
        this.panda_destroyed_quick = 0;

        this.createLevel();
        this.renderTiles();

        this.nextBubble();
        this.nextBubble();
        this.startGameCameraAdjust();

        if (globalData.getSound() == 0) {
            this.musicToggle.isChecked = false;
        }
        //this.adjustCamera(500);
        
        this.versionLabel = cc.find("Canvas/version");
        this.versionLabel.getComponent(cc.Label).string = constant.getVersion();
    },

    updateCredit() {
        if( this.gamestate !=constant.getGameStates("gameover"))
        {
            this.creditLabel.string = Math.round(globalData.settings.balance * 100) / 100;
        }
    },

    updateBallInSlot() {
        for (var i = 0; i < this.ballInSlotCount.length; i++) {
            this.slotCount[i].string = this.ballInSlotCount[i];
        }
    },

    initLevel: function () {
        // Level
        this.level = {
            x: -1080 / 2 + 45,           // X position
            y: 920 - 117,          // Y
            width: 1080,       // Width, gets calculated
            height: 1920,      // Height, gets calculated
            columns: 12,    // Number of tile columns
            rows: this.gameLevel.length,       // Number of tile rows
            maxrows: this.gameLevel.length + 10,    //max row to lose
            tilewidth: 86,  // Visual width of a tile
            tileheight: 86, // Visual height of a tile
            rowheight: 78,  // Height of a row
            radius: 40,     // Bubble collision radius
            tiles: []       // The two-dimensional tile array
        };

        // if (this.gameLevel.length > 12){
        //     this.columnoffset = Math.abs(12 - this.gameLevel.length);

        //     // cc.log("columnoffset = " + this.columnoffset);
        // }

        var Tile = function (x, y, type, shift) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.removed = false;
            this.shift = shift;
            this.velocity = 0;
            this.alpha = 1;
            this.processed = false;
            this.isPanda = false;
            // this.bubbleNode = "";
        };

        // Initialize the two-dimensional tile array
        for (var i = 0; i < this.level.columns; i++) {
            this.level.tiles[i] = [];
            for (var j = 0; j < this.level.maxrows; j++) {
                // Define a tile type and a shift parameter for animation
                //remove the end of tiles

                if (i == 11 && j % 2 != 0) {
                    // cc.log("HERE");
                    this.level.tiles[i][j] = new Tile(i, j, -3, 0);
                    // this.level.tiles[i][j].type = -1;
                    //do nothing
                } else {
                    this.level.tiles[i][j] = new Tile(i, j, -1, 0);
                }
            }
        }

        // cc.log(this.level.tiles);
    },

    playBetSound() {
        this.playEffect(this.jackPotBoomSound, globalData.getEffectVolume());
    },

    playBetClick() {
        this.playEffect(this.betbuttonClick, globalData.getEffectVolume());
    },

    createLevel: function () {
        // Create a level with random tiles
        // cc.log(this.gameLevel);
        var forChecking = 0;
        var maxInSuccession = 0;
        var newtile = 0;
        var previoustile = -1;
        for (var j = 0; j < 11; j++) {
            for (var i = 0; i < 12; i++) {
                var randomtile = 0;
                //var newtile=0;

                //previous If no pattern
                //newtile =  parseInt(Math.random() * (4 + 1 - 0) + 0);

                //add pattern
                if (j > 8) {
                    if (forChecking >= maxInSuccession) {
                        previoustile = newtile;
                        newtile = parseInt(Math.random() * (4 + 1 - 0) + 0);
                        while (previoustile == newtile) {

                            newtile = parseInt(Math.random() * (4 + 1 - 0) + 0);
                        }
                        maxInSuccession = parseInt(Math.random() * (3 + 1 - 1) + 1);
                        forChecking = 0;
                    }
                }
                else {
                    newtile = parseInt(Math.random() * (4 + 1 - 0) + 0);
                }
                randomtile = newtile;
                if (j < this.level.maxrows - 1) {
                    this.level.tiles[i][j].type = randomtile;
                } else {
                    this.level.tiles[i][j].type = -2;
                }

                if (this.level.tiles[i][j].type >= 0) {
                    this.totalBubbles = this.totalBubbles + 1;
                }

                if (this.level.tiles[i][j].type == 5) {
                    this.level.tiles[i][j].isPanda = true;
                    this.total_panda++;
                }

                if (j > 8) {
                    forChecking = forChecking + 1;
                }
                this.updateAvailableColor();
                /*if(this.level.tiles[i][j].type == -1){
                    if (count >= 2) {
                        // Change the random tile
                        var newtile = gameLibUtils.getRandomInt(0, this.ballsImage.length-1);

                        // Make sure the new tile is different from the previous tile
                        if (newtile == randomtile) {
                            newtile = (newtile + 1) % this.ballsImage.length;
                        }
                        randomtile = newtile;
                        if(randomtile == 5){
                            if(j != 0){
                                count = 1;
                                this.total_panda++;
                            }else{
                                randomtile = 2;
                            }
                        }else{
                            count = 0;
                        }
                    }
                    count++;

                    if (j < this.level.maxrows-1) {
                        this.level.tiles[i][j].type = randomtile;
                    } else {
                        this.level.tiles[i][j].type = -2;
                    }
                }*/
            }
        }

        // cc.log(this.level.tiles);
        cc.log("Total Panda ", this.total_panda);
        cc.log("Total Bubbles", this.totalBubbles);
        this.pandaScoreLabel.getComponent(cc.Label).string = "0/" + this.total_panda;

        this.setGameState(constant.getGameStates("ready"));
        this.switchBtn.interactable=true;

        var maxScore1 = 0;
        var maxScore2 = 0;
        var maxScore3 = 0;

        maxScore2 = (this.baseBubbles * 0.2 * 1000) + (this.totalBubbles * 0.4 * 100);
        maxScore3 = (this.baseBubbles * 0.4 * 1000) + (this.totalBubbles * 0.6 * 100);

        this.highScore[0] = maxScore1;
        this.highScore[1] = maxScore2;
        this.highScore[2] = maxScore3;

        cc.log("HIGHSCORE");
        cc.log(this.highScore);
    },

    updateAvailableColor: function () {
        var isFinished = true;
        this.availableBubblesColor = [false, false, false, false, false];

        for (var i = 0; i < this.level.columns; i++) {
            for (var j = 0; j < this.level.maxrows; j++) {
                if (this.level.tiles[i][j].type >= 0 && this.level.tiles[i][j].type <= 4) {
                    this.availableBubblesColor[this.level.tiles[i][j].type] = true;
                    isFinished = false;
                }
            }
        }

        return isFinished;
    },

    // Draw the bubble
    drawBubble: function (x, y, index, parent, need_check, no_need_collider) {
        if (index < 0 || index >= this.ballsImage.length)
            return;

        // var tempBubble = new cc.Node("bubble");
        var tempBubble = cc.instantiate(this.ballPrefab);
        if (need_check) {
            tempBubble.getComponent("Ball").need_check = true;
        }
        if (no_need_collider) {
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

    moveTheBubbleDown() {
        this.setGameState(constant.getGameStates("adjustingCamera"));

        this.movingBlockingLayer.active = true;
        var tempAdjustIndex = 1;
        // if (tempAdjustIndex > this.columnoffset){
        //     tempAdjustIndex = this.columnoffset;
        // }
        this.columnoffset = this.columnoffset - tempAdjustIndex;

        var layerX = this.levelLayer.x;
        var layerY = this.levelLayer.y - (tempAdjustIndex * this.level.rowheight);

        var adjustCamera = cc.moveTo((tempAdjustIndex / 4), cc.v2(layerX, layerY));

        this.scheduleOnce(function () {
            this.levelLayer.runAction(adjustCamera);
        }, 1);

        this.scheduleOnce(function () {
            this.movingBlockingLayer.active = false;
        }, 1 + tempAdjustIndex / 4);

        this.scheduleOnce(function () { this.renderPlayer(0); }, 2);
    },

    checkRemainingRowOnScreen: function () {
        var bottom = 0;
        var isEmpty = true;
        var remainingRow = 18;
        // for (var i = 0; i < this.level.columns; i++) {
        //     for (var j = 1; j < this.level.maxrows; j++) {
        //         if (this.level.tiles[i][j].type == -1 && this.level.tiles[i][j - 1].type > -1) {
        //             if (bottom < j) {
        //                 bottom = j;
        //             }
        //         }
        //     }
        // }

        for (var i = 0; i < this.level.maxrows; i++) {
            isEmpty = true;
            for (var j = 0; j < this.level.columns; j++) {
                if (this.level.tiles[j][i].type > -1) {
                    isEmpty = false;
                    break;
                }

                if (j == (this.level.columns - 1)) {
                    if (isEmpty) {
                        remainingRow = i;
                        cc.log("remainingRow = " + remainingRow);
                        return remainingRow;
                    }
                }
            }
        }
        // var remainingRow = bottom - this.columnoffset;
        return remainingRow;

    },

    startGameCameraAdjust: function () {
        this.movingBlockingLayer.active = true;
        // this.player.bubbleNode.active = false;

        var layerX = this.levelLayer.x;
        var layerY = this.levelLayer.y + (this.columnoffset * this.level.rowheight);
        //var layerY = this.levelLayer.y + (this.columnoffset*100);

        var adjustCamera = cc.moveTo((this.columnoffset / 4), cc.v2(layerX, layerY));

        this.scheduleOnce(function () {
            this.levelLayer.runAction(adjustCamera);
        }, 1);

        this.scheduleOnce(function () {
            this.movingBlockingLayer.active = false;
           this.renderPlayer(1);
            // this.player.bubbleNode.active = true;
            // this.player.nextBubbleNode.active = true;
        }, 1 + this.columnoffset / 4);


    },

    adjustCamera: function (adjustIndex) {
        this.movingBlockingLayer.active = true;
        var tempAdjustIndex = adjustIndex;

        if (tempAdjustIndex > this.columnoffset) {
            tempAdjustIndex = this.columnoffset;
        }
        this.columnoffset = this.columnoffset - tempAdjustIndex;

        var layerX = this.levelLayer.x;
        var layerY = this.levelLayer.y - (tempAdjustIndex * this.level.rowheight);

        var adjustCamera = cc.moveTo((tempAdjustIndex / 4), cc.v2(layerX, layerY));

        this.scheduleOnce(function () {
            this.playerNextBubble.active = true;
            this.playerNextBubble.getComponent(cc.Sprite).spriteFrame = this.ballsImage[this.player.bubble.tiletype];

            this.playerNextBubble.width = 90;
            this.playerNextBubble.height = 90;

            this.player.nextBubbleNode.active = false;
            this.levelLayer.runAction(adjustCamera);
        }, 1);

        this.scheduleOnce(function () {
            this.playerNextBubble.active = false;
            this.movingBlockingLayer.active = false;
            this.player.nextBubbleNode.active = true;

            this.renderPlayer(0);
        }, 1 + tempAdjustIndex / 4);
    },

    resetAWB(){
        this.clusterMadeTime=0;
        this.progressBar.progress = 0;
    },

    // Create a random bubble for the player
    nextBubble: function () {
        // Set the current bubble
        this.player.tiletype = this.player.nextbubble.tiletype;
        this.player.bubble.tiletype = this.player.nextbubble.tiletype;
        this.player.bubble.x = this.player.x;
        this.player.bubble.y = this.player.y;
        this.player.bubble.visible = true;
        // this.player.bubbleNode.visible = true;

        var isFinished = this.updateAvailableColor();
        var nextcolor;
        // Get a random type from the existing colors
        if (this.clusterMadeTime >= this.valueToFillAWB) {
            this.scheduleOnce(function () {
                this.isAwb = true;
                this.playEffect(this.fillingJackPotSound, globalData.getEffectVolume());

            }, 0.5)

            //this.progressBar.progress=0;
            this.clusterMadeTime = 0;
            nextcolor = 6;
        }
        else {
            nextcolor = gameLibUtils.getRandomInt(0, this.ballsImage.length - 3);
            // nextcolor=6;

        }


        if (isFinished == false) {
            while (this.availableBubblesColor[nextcolor] == false) {
                nextcolor = gameLibUtils.getRandomInt(0, this.ballsImage.length - 3);
            }
        }

        // Set the next bubble
        this.player.nextbubble.tiletype = nextcolor;

        if (nextcolor == 6) {
            this.player.nextbubble.tiletype = gameLibUtils.getRandomInt(0, this.ballsImage.length - 3);
            this.player.tiletype = nextcolor;
            this.player.bubble.tiletype = nextcolor;
            this.scheduleOnce(function () {
                this.spark.active = true;
            }, 1.5);
            // this.scheduleOnce(function(){
            //     this.playEffect(this.jackPotBoomSound, globalData.getEffectVolume());
            // },2);
        }


    },

    // Render the player bubble
    //action list
    //0 = normal render
    //1 = first time render
    //2 = switch
    renderPlayer: function (action) {
        cc.log("RENDER PLAYER");

        if (this.gamestate != constant.getGameStates("gameover")) {
            if (this.player.nextBubbleNode != null) {
                this.player.nextBubbleNode.destroy();
            }

            // Draw the bubble
            this.player.bubbleNode = this.drawBubble(this.player.nextbubble.x, this.player.nextbubble.y, this.player.bubble.tiletype, this.staticLevelLayer, true);
            this.player.bubbleNode.y = this.player.bubbleNode.y - (this.columnoffset * this.level.rowheight);
            this.player.bubbleNode.active = true;

            var bezierMovement = [cc.v2(this.player.bubbleNode.x + 50, this.player.bubbleNode.y + 50), cc.v2(this.player.bubbleNode.x + 100, this.player.bubbleNode.y + 100), cc.v2(this.player.bubble.x, this.player.bubble.y - (this.columnoffset * this.level.rowheight))];
            var moveBubbleToPlayer = cc.bezierTo(0.3, bezierMovement);

            this.player.bubbleNode.runAction(moveBubbleToPlayer);
            this.setGameState(constant.getGameStates("init"));

            if (action == 2) {

                cc.log("SWITCH");

                // Draw the next bubble
                this.player.nextBubbleNode = this.drawBubble(this.player.bubble.x, this.player.bubble.y, this.player.nextbubble.tiletype, this.staticLevelLayer, false, true);
                this.player.nextBubbleNode.active = true;
                this.player.nextBubbleNode.y = this.player.nextBubbleNode.y - (this.columnoffset * this.level.rowheight);

                var bezierMovement = [cc.v2(this.player.nextBubbleNode.x - 50, this.player.nextBubbleNode.y + 50), cc.v2(this.player.nextBubbleNode.x - 100, this.player.nextBubbleNode.y + 100), cc.v2(this.player.nextbubble.x, this.player.nextbubble.y - (this.columnoffset * this.level.rowheight))];
                var moveBubbleToPlayer = cc.bezierTo(0.3, bezierMovement);

                this.player.nextBubbleNode.runAction(moveBubbleToPlayer);

                this.scheduleOnce(function () {
                    cc.log(this.player.nextBubbleNode.y);
                    cc.log(this.player.nextBubbleNode.y);
                    if (!this.isMovingCamera) {
                        this.setGameState(constant.getGameStates("ready"));
                         this.slotCollider.active = false;
                         this.switchBtn.interactable=true;

                    }
                }, 0.5);
            } else if (action == 0) {
                cc.log("NORMAL");

                // Draw the next bubble
                this.player.nextBubbleNode = this.drawBubble(this.player.nextbubble.x, this.player.nextbubble.y - 60, this.player.nextbubble.tiletype, this.staticLevelLayer, false, true);
                this.player.nextBubbleNode.active = true;
                this.player.nextBubbleNode.y = this.player.nextBubbleNode.y - (this.columnoffset * this.level.rowheight);
                //this.player.nextBubbleNode.y=this.player.nextBubbleNode.y+10;
                var moveNextBubbleUp = cc.moveTo(0.3, cc.v2(this.player.nextbubble.x, this.player.nextbubble.y - (this.columnoffset * this.level.rowheight)));
                this.player.nextBubbleNode.runAction(moveNextBubbleUp);
                this.scheduleOnce(function () {
                    if (!this.isMovingCamera) {
                        this.setGameState(constant.getGameStates("ready"));
                        if (!this.aimingline.active) {
                            this.aimingline.active = true;
                            // this.slotCollider.active = false;
                            this.switchBtn.interactable=true;

                        }
                    }
                }, 0.5);

                if (this.player.bubble.tiletype == 6) {
                    this.isJackPot = true;
                    this.switchBtn.interactable = false;
                }

            } else {
                cc.log("FIRST");
                // Draw the next bubble
                this.player.nextBubbleNode = this.drawBubble(this.player.nextbubble.x, this.player.nextbubble.y - 60, this.player.nextbubble.tiletype, this.staticLevelLayer, false, true);
                this.player.nextBubbleNode.y = this.player.nextBubbleNode.y - (this.columnoffset * this.level.rowheight);
                this.player.nextBubbleNode.active = true;

                var moveNextBubbleUp = cc.moveTo(0.3, cc.v2(this.player.nextbubble.x, this.player.nextbubble.y - (this.columnoffset * this.level.rowheight)));

                this.scheduleOnce(function () {
                    this.player.nextBubbleNode.runAction(moveNextBubbleUp);
                    if (!this.isMovingCamera) {
                        this.setGameState(constant.getGameStates("ready"));
                        // this.slotCollider.active = false;
                        this.switchBtn.interactable=true;

                    }
                    cc.log(this.player.nextBubbleNode.y);
                }, 1);
            }

            this.scheduleOnce(function () {
                for (var i = 0; i < this.aimingline.bubbles.length; i++) {
                    this.aimingline.bubbles[i].getComponent(cc.Sprite).spriteFrame = this.aimingBallsImage[this.player.bubble.tiletype];
                }
            }, 0.3);

            this.panda.getComponent(cc.Animation).play("pandaIdle2");
        }
    },

    switchPlayerBubble: function () {
        if (this.isJackPot != true) {
            if (this.gamestate != constant.getGameStates("shootbubble")) {
                this.player.bubbleNode.destroy();
                this.player.nextBubbleNode.destroy();

                var currentType = this.player.bubble.tiletype;
                this.player.bubble.tiletype = this.player.nextbubble.tiletype;
                this.player.nextbubble.tiletype = currentType;

                this.player.tiletype = this.player.bubble.tiletype;

                this.renderPlayer(2);
            }
        }
    },

    // Shoot the bubble
    shootBubble: function () {
        this.switchBtn.interactable=false;
        this.slotCollider.active = false;
        this.aimingline.active = false;
        this.playEffect(this.shootingEffect, globalData.getEffectVolume());

        this.remainingBubbles = this.remainingBubbles - 1;
        this.remainingBubblesText.getComponent(cc.Label).string = this.remainingBubbles;
        if (this.spark.active) {
            this.spark.active = false;
        }
        // Shoot the bubble in the direction of the mouse
        this.player.bubble.x = this.player.x;
        this.player.bubble.y = this.player.y;
        this.player.bubble.angle = this.player.angle;
        this.player.bubble.tiletype = this.player.tiletype;

        this.setGameState(constant.getGameStates("shootbubble"));

    },

    // Render tiles
    renderTiles: function () {
        for (var j = 0; j < this.level.maxrows; j++) {
            for (var i = 0; i < this.level.columns; i++) {
                if (this.level.tiles[i][j].bubbleNode != null) {
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
        for (var j = 0; j < this.level.maxrows; j++) {
            for (var i = 0; i < this.level.columns; i++) {
                // Get the tile
                var tile = this.level.tiles[i][j];

                // Get the shift of the tile for animation
                var shift = tile.shift;

                // Calculate the tile coordinates
                var coord = this.getTileCoordinate(i, j);

                // Check if there is a tile present
                if (tile.type >= 0) {
                    // Draw the tile using the color
                    this.level.tiles[i][j].bubbleNode = this.drawBubble(coord.tilex, coord.tiley + shift, tile.type, this.levelLayer, false);
                }
            }
        }

        // cc.log(this.level.tiles);
    },

    // Get the tile coordinate
    getTileCoordinate: function (column, row) {
        var tilex = this.level.x + column * this.level.tilewidth;

        // X offset for odd or even rows
        if ((row + this.rowoffset) % 2) {
            tilex += this.level.tilewidth / 2;
        }

        var tiley = this.level.y - row * this.level.rowheight;

        // cc.log(tilex, tiley);
        return { tilex: tilex, tiley: tiley };
    },

    // Get the closest grid position
    getGridPosition: function (x, y) {
        cc.log("getGridPosition", x, y);

        var gridy = -1;
        var startingY = this.level.y;
        var startingGridY = 0;

        while (gridy == -1) {
            var tempSub = startingY - y;

            if (tempSub < 45) {
                gridy = startingGridY;
            } else {
                startingY = startingY - this.level.rowheight;
                startingGridY = startingGridY + 1;
            }
        }

        // Check for offset
        var xoffset = 0;
        if ((gridy + this.rowoffset) % 2) {
            xoffset = this.level.tilewidth / 2;
        }

        var gridx = Math.round((x - xoffset - this.level.x) / this.level.tilewidth);
        cc.log(gridx, gridy);

        if (gridy % 2 != 0 && gridx == 11) {
            if (this.level.tiles[gridx - 1][gridy].type == -1) {
                gridx = 10;
            } else if (this.level.tiles[gridx][gridy + 1].type == -1) {
                gridy = gridy + 1;
            }
        }

        return { x: gridx, y: gridy };
    },

    // Check if two circles intersect
    circleIntersection: function (x1, y1, r1, x2, y2, r2) {
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

    checkGameOver: function (value) {
        var self = this;


        // Check for game over
        var remainingRow = self.checkRemainingRowOnScreen();
        var remainingBubbles = self.remainingBubbles;
        cc.log("PANDA DESTROYED = " + self.panda_destroyed_quick + "TOTAL PANDA = " + self.total_panda);
        cc.log("REMAININGROW = " + remainingRow + "MAXROW = " + self.level.maxrows);

        //lose condition
        if (remainingRow >= 18 || value) {
            self.alreadyCheck = true;
            self.resultLayer.gameoverLabel.active = true;
            self.resultLayer.resultPopup.resultLabel.active = true;
            self.resultLayer.resultPopup.retryButton.active = false;
            //self.resultLayer.resultPopup.retryButton2.active = true;
            self.resultLayer.resultPopup.homeButton.active = false;
            self.resultLayer.resultPopup.homeButton2.active = true;
            self.resultLayer.resultPopup.playButton.active = false;
            self.resultLayer.resultPopup.nextButton.active = false;
            for (var i = 0; i < self.resultLayer.resultPopup.emptyStar.length; i++) {
                self.resultLayer.resultPopup.emptyStar[i].active = false;
            }
            displayResult();
        }


        function displayResult() {
            if (remainingRow == 0 || remainingRow >= 18 /*|| self.panda_destroyed == self.total_panda*/ || self.remainingBubbles == 0 || value) {
                cc.log("GAME OVER");
                self.setGameState(constant.getGameStates("gameover"));
                var starCount = 0;
                self.resultLayer.active = true;
                self.resultLayer.pauseLabel.active = false;
                self.resultLayer.resultPopup.active = true;
                self.resultLayer.resultPopup.nextButton.active = true;

                if (self.resultLayer.gameoverLabel.active == true) {
                    self.resultLayer.resultPopup.nextButton.active = false;
                }
                self.goToHome.active = true;

                if (self.isEnding) {
                    self.quitButton.active = true;
                    self.resultLayer.resultPopup.homeButton2.active = false;
                    self.goToHome.active = false;
                }
                self.resultLayer.resultPopup.playButton.active = false;

                if (self.panda_destroyed != self.total_panda) {
                    self.resultLayer.resultPopup.lose_panda.active = true;

                    for (var i = 0; i < self.resultLayer.resultPopup.emptyStar.length; i++) {
                        self.resultLayer.resultPopup.emptyStar[i].active = false;
                        self.resultLayer.resultPopup.star[i].active = false;
                    }
                } else {
                    self.resultLayer.resultPopup.lose_panda.active = false;

                    // if (globalData.getIsLogin()) {
                    //     self.node.getComponent("API").storeScore(URL.username, starCount, globalData.getLevelSelected(), global.getCoin());
                    // }

                    var star = globalData.getLevelStar();
                    if (globalData.getCurrentPlayerLevel() <= globalData.getLevelSelected()) {
                        globalData.setCurrentPlayerLevel(globalData.getLevelSelected() + 1);
                        cc.sys.localStorage.setItem('level', globalData.getCurrentPlayerLevel());
                    }

                    if (star[globalData.getLevelSelected() - 1] < starCount || star[globalData.getLevelSelected() - 1] == null) {
                        var starDiff = starCount - star[globalData.getLevelSelected() - 1];

                        if (starDiff > 0) {
                            globalData.setCoin(globalData.getCoin() + (5 * starDiff));
                            cc.sys.localStorage.setItem('coin', globalData.getCoin());
                        }

                        star[globalData.getLevelSelected() - 1] = starCount;
                        var data = {
                            "data": star
                        };
                        data = JSON.stringify(data);
                        cc.sys.localStorage.setItem('star', data);
                        globalData.setLevelStar(star);
                    }

                }

                self.resultLayer.resultPopup.levelLabel.getComponent(cc.Label).string = "LEVEL " + globalData.getSelectionLevel();
                self.resultLayer.resultPopup.scoreLabel.getComponent(cc.Label).string = Math.round(self.finalWin * 100) / 100;
                if (self.finalWin > 0) {
                    self.resultLabelText.string = "Congratulations!";
                    self.playEffect(self.winEffect, globalData.getEffectVolume());

                }
                else {
                    self.resultLabelText.string = "Thank You For Playing!";
                    self.playEffect(self.loseEffect, globalData.getEffectVolume());

                }
                if(self.selfClickEnd){
                    self.resultBalanceLabel.string = (Math.round((globalData.settings.balance+self.inGameBetting.getComponent("InGameBetting").currentBetting) * 100) / 100)+" ";
                }else{
                    self.resultBalanceLabel.string = (Math.round((globalData.settings.balance) * 100) / 100)+" ";

                }
                self.total_betLabel.string = Math.round(self.total_bet * 100) / 100;
                return true;
            } else {
                self.movingBlockingLayer.active = false;
            }
        }
        return false;
    },

    addBubbles: function (value) {
        this.setGameState(constant.getGameStates("adjustingCamera"));
        this.aimingline.active = false;
        for (var k = 0; k < value; k++) {
            // Move the rows downwards
            for (var i = 0; i < this.level.columns; i++) {
                for (var j = 0; j < this.level.maxrows - 1; j++) {
                    this.level.tiles[i][this.level.maxrows - 1 - j].type = this.level.tiles[i][this.level.maxrows - 1 - j - 1].type;
                }
            }


            // Add a new row of bubbles at the top
            var forchecking = 0;
            var maxInSuccession = 0;
            var newtile = 0;
            var previoustile = -1;
            for (var i = 0; i < this.level.columns; i++) {
                // Add random, existing, colors
                // if (forchecking >= maxInSuccession) {
                //     previoustile = newtile;
                //     newtile = parseInt(Math.random() * (4 + 1 - 0) + 0);
                //     while (previoustile == newtile) {
                //         newtile = parseInt(Math.random() * (4 + 1 - 0) + 0);
                //     }
                //     maxInSuccession = parseInt(Math.random() * (3 + 1 - 1) + 1);
                //     forchecking = 0;
                // }
                // this.level.tiles[i][0].type = newtile;
                // forchecking = forchecking += 1;
                this.level.tiles[i][0].type = gameLibUtils.getRandomInt(0, this.ballsImage.length - 3);
            }
        }
        this.renderTiles();

        if (this.checkRemainingRowOnScreen() >= 19) {
            // cc.log("HI");
            //   this.player.bubbleNode.active = false;
            this.aimingline.active = false;
        };
        this.levelLayer.y = 78 * value;
        var action = cc.moveTo(0.5, cc.v2(0, 0));
        this.levelLayer.runAction(action);
        this.scheduleOnce(function () {
            this.isMovingCamera = false;
            this.setGameState(constant.getGameStates("ready"));
            this.aimingline.active = true;
            this.switchBtn.interactable=true;

        }, 0.7);

        this.scheduleOnce(function () {
            if (!this.alreadyCheck) {
                this.checkGameOver(false);
            }
        }, 0.5);


        // cc.log(this.level.tiles);
    },

    // Snap bubble to the grid
    snapBubble: function (indeX, indexY) {
        this.movingBlockingLayer.active = true;

        // Get the grid position
        var gridpos = this.getGridPosition(this.player.bubbleNode.x, this.player.bubbleNode.y);
        cc.log("SNAPPING BUBBLE ssssssssssssssssssssss  = ", gridpos.x + " " + gridpos.y);
        this.setGameState(constant.getGameStates("snapping"));

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

        // Hide the player bubble
        // this.player.bubble.visible = false;
        // this.player.bubbleNode.visible = false;

        var tempCoor = this.getTileCoordinate(gridpos.x, gridpos.y);
        if (gridpos.x == indeX && gridpos.y == indexY) {
            gridpos.y += 1;
            if (gridpos.y < this.level.maxrows - 1) {
                if (this.level.tiles[gridpos.x][gridpos.y].type != -1) {
                    // var ori = gridpos.x;
                    if (this.level.tiles[gridpos.x + 1][gridpos.y].type == -1) {
                        gridpos.x += 1;
                    } else if (this.level.tiles[gridpos.x - 1][gridpos.y].type == -1) {
                        gridpos.x -= 1;
                    }
                }
            } else {
                this.checkGameOver(false);
                return;
            }
            tempCoor = this.getTileCoordinate(gridpos.x, gridpos.y);
            cc.log("Update to new coordinate");
        }


        cc.log("Drawing single bubble");
        cc.log(indeX, indexY);
        cc.log(gridpos);
        cc.log(tempCoor);

        // Set the tile
        var levelTile;
        try {
            levelTile = this.level.tiles[gridpos.x][gridpos.y].type;
        }
        catch {
            cc.log("type is null :D");
            levelTile = -5;
        }
        cc.log("My type ", levelTile);
        if (levelTile == -1) {
            this.level.tiles[gridpos.x][gridpos.y].type = this.player.bubble.tiletype;
            levelTile = this.player.bubble.tiletype;
            this.level.tiles[gridpos.x][gridpos.y].bubbleNode = this.drawBubble(tempCoor.tilex, tempCoor.tiley, this.player.bubble.tiletype, this.levelLayer, false);
        }
        this.player.bubbleNode.destroy();

        for (var j = 0; j < this.level.maxrows; j++) {
            for (var i = 0; i < this.level.columns; i++) {
                this.level.tiles[i][j].removed = false;
                this.level.tiles[i][j].shift = 0;
                this.level.tiles[i][j].processed = false;
            }
        }

        var spawnPos = this.level.tiles[gridpos.x][gridpos.y].bubbleNode.position;

        if (levelTile == 6) {
            this.cameraAnim.play("CamaraShake");
            this.playEffect(this.boomExplodeSound, globalData.getEffectVolume());
            this.schedule(function () {
                // var explosionParticle = cc.instantiate(this.explosion);
                // //var actualSpawnPos = cc.v2(parseInt(Math.random() * ((spawnPos.x+50) + 1 - spawnPos.x-50)) + (spawnPos.x-50),parseInt(Math.random() * ((spawnPos.y+50) + 1 - spawnPos.y-50)) + (spawnPos.y-50));
                // explosionParticle.position = spawnPos;
                // explosionParticle.parent = this.levelLayer;

                var explosionParticle2 = cc.instantiate(this.explosion2);
                explosionParticle2.position = spawnPos;
                explosionParticle2.parent = this.levelLayer;

            }, 0.2, 2, 0.01);

        }

        // Find clusters
        if (levelTile != 6) {
            this.cluster = this.findCluster(gridpos.x, gridpos.y, true, true, false, false);
        } else {
            this.cluster = this.findCluster(gridpos.x, gridpos.y, false, true, false, true);
        }
        if (gridpos.y < 6) {
            this.isMovingCamera = true;
        }
        if (this.cluster.length >= 3 || levelTile == 6) {
            this.bubblePopCount = this.bubblePopCount + this.cluster.length;
            if (levelTile == 6) {
                this.switchBtn.interactable = true;

            }

            // Remove the cluster
            this.clusterMadeTime = this.clusterMadeTime + 1;
            this.progressBar.progress += 1 / this.valueToFillAWB;

            this.tbao.getComponent(cc.Animation).play("tbao_happy");
            this.setGameState(constant.getGameStates("removecluster"));
            this.scheduleOnce(function () {
                this.ballInSlotCount = [0, 0, 0, 0, 0];
                this.removeCluster();
            }, 0.1);

            this.scheduleOnce(function () {
                this.valueToAdd = 0;
                this.scoreAnimate = true;
                this.valueToAdd = this.total_add * 1 / this.scoreSpeed;
            }, 2);


            this.scheduleOnce(function () {
                this.loadingLayer.active = true;
                this.loadingLayer.opacity=0;
                this.timerForLoading = 0;
                if(!globalData.isDemo){
                    var emit_result = {
                        'host_id': globalData.host_id,
                        'access_token': globalData.access_token,
                        'ticket_id': globalData.ticket_id,
                        'result': this.total_add,
                        'key': "BubbleShooter Score: " + this.total_add,
                        'game_code': globalData.game_code,
                        'description': "Send actual result to server",
                        'user_id': globalData.settings.user_id,
                        'api_url': globalData.api_url,
                        'changeBet':false,
                        'is_angpao': 0,
                    };
                    if(globalData.isEncrypt){
                        emit_result = ecrypt.encrypt(JSON.stringify(emit_result));
                    }
                    globalData.getSocket().emit('send-result', emit_result);
                    this.generatingBalance = true;

                }
                else{
                    globalData.settings.balance+=this.total_add;
                    this.generatingBalance = true;
                }
                globalData.previousBet = this.inGameBetting.getComponent("InGameBetting").currentBetting;
                globalData.previousWin = this.total_add;
            }, 2);

            this.scheduleOnce(function () {


                this.delayTime = 0;
                this.creditAddLabel.string = Math.round(this.total_add * 100) / 100;
                if (gridpos.y < 6) {
                    this.addBubbles(2);
                }
            }, 2)



            this.slotCollider.active = true;
            return;
        }
        else {

            this.missedTime = this.missedTime + 1;
            if (this.missedTime >= this.missForDrop) {
                this.isMovingCamera = true;
                this.missedTime = 0;
                this.scheduleOnce(function () {
                    this.addBubbles(this.rowToSpawn);
                }, 0.5);
            }

        }

        if (gridpos.y < 6) {
            this.addBubbles(2);
        }


        // Next bubble
        this.nextBubble();

        if(!globalData.isDemo){
            var emit_result = {
                'host_id':globalData.host_id,
                'access_token': globalData.access_token,
                'ticket_id': globalData.ticket_id,
                'result': this.total_add,
                'key': "BubbleShooter Score: " + this.total_add,
                'game_code': globalData.game_code,
                'description': "Send actual result to server",
                'user_id': globalData.settings.user_id,
                'api_url':globalData.api_url,
                'changeBet':false,
                'is_angpao': 0,
            };
            cc.log(globalData.ticket_id);
            cc.log(globalData.game_code);
            cc.log(globalData.settings.user_id);
            if(globalData.isEncrypt){
                emit_result = ecrypt.encrypt(JSON.stringify(emit_result));
            }
            globalData.getSocket().emit('send-result', emit_result);
        }
        else{
            globalData.settings.balance+=this.total_add;
        }
        globalData.previousBet = this.inGameBetting.getComponent("InGameBetting").currentBetting;
        globalData.previousWin = this.total_add;

        this.loadingLayer.active = true;
        this.loadingLayer.opacity=0;
        this.timerForLoading = 0;

       this.generatingBalance =true;
        // Check for game over
        if (this.checkGameOver(false)) {
            return;
        }
        else {
            this.movingBlockingLayer.active = false;
        }



    },

    // Find cluster at the specified tile location
    findCluster: function (tx, ty, matchtype, reset, skipremoved, boom) {
        // Reset the processed flags
        var i = 0;
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
            if (!boom) {
                if (!matchtype || (currenttile.type == targettile.type)) {
                    // Add current tile to the cluster

                    foundcluster.push(currenttile);
                    // Get the neighbors of the current tile
                    var neighbors = this.getNeighbors(currenttile);
                    // cc.log("My neighbors", neighbors);
                    // Check the type of each neighbor
                    for (var i = 0; i < neighbors.length; i++) {
                        if (!neighbors[i].processed) {
                            // Add the neighbor to the toprocess array
                            toprocess.push(neighbors[i]);
                            neighbors[i].processed = true;
                        }
                    }
                }
            }
            else {

                //foundcluster.push(currenttile);
                // var neighbors = this.getNeighbors(currenttile);
                // for (var i = 0; i < neighbors.length; i++) {
                //     if (!neighbors[i].processed) {
                //         if (neighbors[i].type != -1) {
                //             foundcluster.push(neighbors[i]);
                //         }
                //         neighbors[i].processed = true;
                //     }
                // }

                var neighbors = this.getSurrounding(currenttile);
                for (var i = 0; i < neighbors.length; i++) {

                    foundcluster.push(neighbors[i]);
                }
            }
        }

        // Return the found cluster
        return foundcluster;
    },

    getSurrounding(tile) {
        var neighbors = [];
        var tilerow = tile.y % 2; // Even or odd rows
        var x = -1;
        var y = -2;
        var continueLoop = true;
        while (continueLoop) {
            let t = Object.assign({}, tile);
            var nx = t.x + x;
            var ny = t.y + y;
            if (nx >= 0 && nx < this.level.columns && ny >= 0 && ny < this.level.maxrows && this.level.tiles[nx][ny].type != -1) {
                neighbors.push(this.level.tiles[nx][ny]);
                cc.log(neighbors[neighbors.length - 1]);
            }
            x++;
            if (tilerow == 0) {
                switch (y) {
                    case -2:
                        if (x > 1) {
                            y++;
                            x = -2;
                        }
                        break;
                    case -1:
                        if (x > 2) {
                            y++;
                            x = -2;
                        }
                        break;
                    case 0:
                        if (x > 2) {
                            y++;
                            x = -2;
                        }
                        break;
                    case 1:
                        if (x > 2) {
                            y++;
                            x = -1;
                        }
                        break;
                    case 2:
                        if (x > 1) {
                            continueLoop = false;
                        }
                        break;
                }
            } else {
                switch (y) {
                    case -2:
                        if (x > 1) {
                            y++;
                            x = -1;
                        }
                        break;
                    case -1:
                        if (x > 2) {
                            y++;
                            x = -2;
                        }
                        break;
                    case 0:
                        if (x > 2) {
                            y++;
                            x = -1;
                        }
                        break;
                    case 1:
                        if (x > 2) {
                            y++;
                            x = -1;
                        }
                        break;
                    case 2:
                        if (x > 1) {
                            continueLoop = false;
                        }
                        break;
                }
            }
        }
        return neighbors;
    },

    // Find floating clusters
    findFloatingClusters: function () {
        // Reset the processed flags
        this.resetProcessed();

        var foundclusters = [];

        // Check all tiles
        for (var i = 0; i < this.level.columns; i++) {
            for (var j = 0; j < this.level.maxrows; j++) {
                var tile = this.level.tiles[i][j];
                if (!tile.processed) {
                    // Find all attached tiles
                    var foundcluster = this.findCluster(i, j, false, false, true, false);

                    // There must be a tile in the cluster
                    if (foundcluster.length <= 0) {
                        continue;
                    }

                    // Check if the cluster is floating
                    var floating = true;
                    for (var k = 0; k < foundcluster.length; k++) {
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
        cc.log(foundclusters.length+"ALAMASSAJS");
        return foundclusters;
    },

    // Reset the processed flags
    resetProcessed: function () {
        for (var i = 0; i < this.level.columns; i++) {
            for (var j = 0; j < this.level.rows; j++) {
                this.level.tiles[i][j].processed = false;
            }
        }
    },

    // Reset the removed flags
    resetRemoved: function () {
        for (var i = 0; i < this.level.columns; i++) {
            for (var j = 0; j < this.level.rows; j++) {
                this.level.tiles[i][j].removed = false;
            }
        }
    },

    // Get the neighbors of the specified tile
    getNeighbors: function (tile) {
        var tilerow = (tile.y + this.rowoffset) % 2; // Even or odd row
        var neighbors = [];
        // Get the neighbor offsets for the specified tile
        var n = this.neighborsoffsets[tilerow];

        // Get the neighbors
        for (var i = 0; i < n.length; i++) {
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

    getNeighbors2(tile) {
        var neighbors = [];

        var neighbor = tile;
        neighbors.add(tile);
    },

    // Convert radians to degrees
    radToDeg: function (angle) {
        return angle * (180 / Math.PI);
    },

    // Convert degrees to radians
    degToRad: function (angle) {
        return angle * (Math.PI / 180);
    },

    setGameState: function (newgamestate) {
        cc.log("newgamestate = " + newgamestate);

        if (this.gamestate != constant.getGameStates("gameover")) {
            this.gamestate = newgamestate;

            this.animationstate = 0;
            this.animationtime = 0;
        }
    },

    restartGame: function () {
        //globalData.getSocket().disconnect();
        cc.sys.garbageCollect();
        constant.setBubblesAmount(constant.getRecordBubble(), constant.getBubblesJSONBase()[constant.getRecordBubble()]);
        globalData.setSceneToLoad("MainScene");
        cc.director.loadScene("Loading");
        cc.sys.garbageCollect();
    },

    generatePath: function (valueX, value) {
        var path;
        if (value == true) {
            if (this.currentPath >= this.pathToIn.length) {
                path = 4;
            }
            else {
                path = this.pathToIn[this.currentPath];
            }
            cc.log("this.pathToIn:", this.pathToIn);
            this.currentPath++;
        }
        else {
            path = parseInt(Math.random() * (4 + 1 - 0) + 0); // 0(inclusive) - 5(exclusive)
        }
        this.ballInSlotCount[path] = this.ballInSlotCount[path] + 1;
        this.addTotalCredit(path);
        return parseInt(Math.random() * ((this.slotsOriginPosition[path] + 50) + 1 - (this.slotsOriginPosition[path] - 50)) + (this.slotsOriginPosition[path] - 50));
    },

    generateJackpotPath: function (valueX, value) {
        var path;
        if (value == true) {
            path = this.pathToIn[this.currentPath];
            this.currentPath++;
        }
        else {
            path = parseInt(Math.random() * (4 + 1 - 0) + 0);
        }
        this.ballInSlotCount[path] = this.ballInSlotCount[path] + 1;
        this.addTotalCredit(path);
        return parseInt(Math.random() * ((this.slotsOriginPosition[path] + 50) + 1 - (this.slotsOriginPosition[path] - 50)) + (this.slotsOriginPosition[path] - 50));
    },

    calculateJackpotBall(value){
        var numberOfBallHit;

        if(value){
            numberOfBallHit = 5;
        }
        var tempArray = [];
        for (var i = 0; i < numberOfBallHit; i++) {
            tempArray.push(4)
        }
        return tempArray;
    },

    calculateBallToInNew(value){
        let numberOfBallHit = this.floatingclusters.length;
        if(value){
            numberOfBallHit = this.cluster.length + this.currentClusterAdd;
        }
        let numberOfBallCalculate = 0;
        let landSlot = 0;
    
        if(this.isJackPot){
            numberOfBallCalculate = 10;
            landSlot = 7;
            numberOfBallHit += 7;
        }
        else{
            switch(numberOfBallHit){
                case 3:
                    numberOfBallCalculate = 3;
                    landSlot = 0;
                    break;
                case 4:
                    numberOfBallCalculate = 4;
                    landSlot = 1;
                    break;
                case 5:
                    numberOfBallCalculate = 5;
                    landSlot = 2;
                    break;
                case 6:
                    numberOfBallCalculate = 6;
                    landSlot = 3;
                    break;
                case 7:
                    numberOfBallCalculate = 7;
                    landSlot = 4;
                    break;
                case 8:
                    numberOfBallCalculate = 8;
                    landSlot = 5;
                    break;
            }
            if(numberOfBallHit >= 9){
                landSlot = 6;
                numberOfBallCalculate = 9;
            }
        }
    
        let bigWeightage = globalData.happyShooter.bigWeightage[landSlot];
        let maxNumber = globalData.happyShooter.totalWeight[landSlot];
        let minNumber = 1;
        let tempArray = [];
    
        for (let i = 0; i < numberOfBallHit; i++){
            if(i < numberOfBallCalculate){
                let random = Math.trunc(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
                if(random <= bigWeightage[0]){
                    if(globalData.maxMultiplier >= 0.5){
                        tempArray.push(2);
                        globalData.maxMultiplier -= 0.5;
                    }
                    else{
                        tempArray.push(4);
                    }
                }
                else if(random <= bigWeightage[1]){
                    if(globalData.maxMultiplier >= 0.25){
                        tempArray.push(3);
                        globalData.maxMultiplier -= 0.25;
                    }
                    else{
                        tempArray.push(4);
                    }
                }
                else if(random <= bigWeightage[2]){
                    if(globalData.maxMultiplier >= 0.15){
                        tempArray.push(1);
                        globalData.maxMultiplier -= 0.15;
                    }
                    else{
                        tempArray.push(4);
                    }
                }
                else if(random <= bigWeightage[3]){
                    if(globalData.maxMultiplier >= 0.05){
                        tempArray.push(0);
                        globalData.maxMultiplier -= 0.05;
                    }
                    else{
                        tempArray.push(4);
                    }
                }
            }
            else{
                tempArray.push(4);
            }
        }
        let bonus = 0;
        if(globalData.previousWin == 0 && globalData.previousBet > 0){
            let maxBonus = this.inGameBetting.getComponent("InGameBetting").currentBetting * globalData.maxMultiplier;
            bonus = globalData.previousBet;
            if(bonus > maxBonus){
                bonus = maxBonus;
            }
            bonus = Math.round(bonus * 100) / 100;
        }
        this.addBonusCredit(bonus);
        return tempArray;
        // 0 = x0.05
        // 1 = x0.15
        // 2 = x0.5
        // 3 = x0.25
        // 4 = x0
    },

    addTotalCredit(index) {
        this.total_add += this.inGameBetting.getComponent("InGameBetting").returnSlotAmount(index);

        if (this.inGameBetting.getComponent("InGameBetting").returnSlotAmount(index) != 0) {
            this.addScoreEffect(-296.056, 750.518, this.inGameBetting.getComponent("InGameBetting").returnSlotAmount(index), this.delayTime);
            this.delayTime = this.delayTime + 0.2;
        }
        this.updateBallInSlot();
        //this.finalWin = this.finalWin+ this.total_add;

    },
    addBonusCredit(value){
        this.total_add += value;
        if (value != 0) {
            this.addScoreEffect(-296.056, 750.518, value, this.delayTime);
            this.delayTime = this.delayTime + 0.2;
        }
    },


    removeCluster: function () {
        this.resetRemoved();


        //calculate path.

        // Mark the tiles as removed
        for (var i = 0; i < this.cluster.length; i++) {
            // Set the removed flag
            this.cluster[i].removed = true;
        }

        // this.renderTiles();
        for (var j = 0; j < this.level.maxrows; j++) {
            for (var i = 0; i < this.level.columns; i++) {
                this.level.tiles[i][j].removed = false;
                this.level.tiles[i][j].shift = 0;
                this.level.tiles[i][j].processed = false;
            }
        }

        var self = this;
        var count = 0;

        var count1 = 0;
        var count2 = 0;
        this.currentPath =0;
        this.ballcheck=0;
        this.currentClusterAdd=0;
        this.scheduleOnce(function(){
            this.pathToIn = this.calculateBallToInNew(true);
        },1);


        function delayRemoveItem(x, y) {

           // this.floatingclustersMy = this.findFloatingClusters();
            if (self.level.tiles[x][y].isPanda == true) {
                self.panda_destroyed_quick++;
            }

            self.scheduleOnce(function () {
                if (self.level.tiles[x][y].bubbleNode != null) {
                    var tempBursting = new cc.Node("burstingEffect");
                    var sprite = tempBursting.addComponent(cc.Sprite);
                    sprite.trim = false;
                    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;

                    tempBursting.addComponent(cc.Animation);
                    tempBursting.parent = self.levelLayer;

                    if (self.level.tiles[x][y].isPanda == true) {
                        self.playEffect(self.starBlink, globalData.getEffectVolume());
                        tempBursting.getComponent(cc.Animation).addClip(self.starBurstAnimation, "burst");
                    } else {
                        tempBursting.getComponent(cc.Animation).addClip(self.bubbleBurstAnimation, "burst");
                    }

                    tempBursting.x = self.level.tiles[x][y].bubbleNode.x;
                    tempBursting.y = self.level.tiles[x][y].bubbleNode.y;
                    tempBursting.width = self.level.tilewidth;
                    tempBursting.height = self.level.tileheight;


                    self.scheduleOnce(function(){
                        var burstAnimation = tempBursting.getComponent(cc.Animation).play("burst");
                        self.playEffect(self.bubblePop, globalData.getEffectVolume());
                    },0.2);

                    var action = cc.fadeOut(0.15);

                    //self.level.tiles[x][y].bubbleNode.runAction(action);

                    self.scheduleOnce(function () {
                        tempBursting.destroy();
                    }, 0.5);
                }
            }, 0.025);

            self.scheduleOnce(function () {
                if (self.level.tiles[x][y].bubbleNode != null) {
                    //self.level.tiles[x][y].bubbleNode.stopAllActions();

                   self.scheduleOnce(function(){
                       if (self.level.tiles[x][y].bubbleNode != null) {
                           self.level.tiles[x][y].bubbleNode.getComponent("Ball").putRigidbody(this.generatePath(self.level.tiles[x][y].bubbleNode.x, true), self.level.tiles[x][y].bubbleNode.y + 700, self.level.tiles[x][y].bubbleNode.y + 300, 0, 0.8, self.level.tiles[x][y]);
                           if(self.level.tiles[x][y].type ==6){
                            self.level.tiles[x][y].type = -1;
                           }
                           this.droppingBall = true;
                       }
                   },1);

                   if(self.level.tiles[x][y].type !=6 && self.level.tiles[x][y].bubbleNode!=null){
                    self.level.tiles[x][y].type = -1;
                   }

                    //self.level.tiles[x][y].bubbleNode.destroy();
                    // self.level.tiles[x][y].bubbleNode.active = false;
                    // this.scheduleOnce(function(){
                    //     self.level.tiles[x][y].bubbleNode.destroy();
                    //
                    //  },2)

                    //self.level.tiles[x][y].bubbleNode = null;
                    self.score = self.score + 100;
                    //self.scoreLabel.getComponent(cc.Label).string = self.finalWin;

                    // Check is panda
                    if (self.level.tiles[x][y].isPanda == true) {
                        if (self.panda_destroyed < self.total_panda) {
                            self.panda_destroyed++;
                        }
                        self.pandaScoreLabel.getComponent(cc.Label).string = self.panda_destroyed + "/" + self.total_panda;
                    }
                }
            }, 0.05);

            self.scheduleOnce(function () {
                if (count == -1) {
                    if (self.floatingclusters.length > count1) {
                        if (self.floatingclusters[count1][count2 + 1] != null) {
                            count2 = count2 + 1;
                        } else {
                            count2 = 0;
                            count1 = count1 + 1;
                        }

                        if (self.floatingclusters[count1] != null && self.floatingclusters[count1][count2] != null) {
                            // self.currentPath =0;
                            self.currentClusterAdd++;

                            delayRemoveItem(self.floatingclusters[count1][count2].x, self.floatingclusters[count1][count2].y);
                        } else {
                            cc.log("floatingcluster finished");
                            checkStatus();
                        }
                    }
                } else {
                    if (self.cluster[count + 1] != null) {
                        count++;
                        delayRemoveItem(self.cluster[count].x, self.cluster[count].y);
                    } else {
                        count = -1;
                        // Find floating clusters
                        self.floatingclusters = self.findFloatingClusters();
                        if (self.floatingclusters.length > 0) {
                            // self.currentPath =0;
                            self.currentClusterAdd++;
                            delayRemoveItem(self.floatingclusters[count1][count2].x, self.floatingclusters[count1][count2].y);
                        } else {
                            cc.log("no floating cluster");
                            checkStatus();
                        }
                    }
                }
            }, 0.05);
        }

        delayRemoveItem(this.cluster[count].x, this.cluster[count].y);

        function checkStatus() {
            cc.log("CHECKING STATUS");

            if (self.checkGameOver(false)) {
                return;
            }

            for (var j = 0; j < self.level.maxrows; j++) {
                for (var i = 0; i < self.level.columns; i++) {
                    self.level.tiles[i][j].removed = false;
                    self.level.tiles[i][j].shift = 0;
                    self.level.tiles[i][j].processed = false;
                }
            }

            self.player.bubbleNode.destroy();

            cc.log(self.checkRemainingRowOnScreen());
            cc.log(self.columnoffset);
            self.nextBubble();
            var tempRemain = self.checkRemainingRowOnScreen();

            if (tempRemain <= 10 && self.columnoffset > 0) {
                var tempAdjustIndex = 13 - tempRemain;
                self.adjustCamera(0);
            } else {
                self.scheduleOnce(function () {

                    self.player.bubble.visible = true;
                    self.player.bubbleNode.visible = true;
                    self.movingBlockingLayer.active = false;
                }, 1);
            }

        }
    },

    pause: function () {
        if (this.gamestate != constant.getGameStates("gameover") && this.movingBlockingLayer.active == false) {
            if (this.resultLayer.active == true) {
                this.resultLayer.active = false;
                cc.audioEngine.resume(this.mainSceneBgm);
            } else {
                this.resultLayer.active = true;
                this.resultLayer.pauseLabel.active = true;
                this.resultLayer.resultPopup.active = true;
                this.resultLayer.resultPopup.lose_panda.active = false;

                for (var i = 0; i < this.resultLayer.resultPopup.emptyStar.length; i++) {
                    this.resultLayer.resultPopup.emptyStar[i].active = true;
                    this.resultLayer.resultPopup.star[i].active = false;
                }

                this.resultLayer.resultPopup.levelLabel.getComponent(cc.Label).string = "LEVEL " + globalData.getSelectionLevel();
                this.resultLayer.resultPopup.scoreLabel.getComponent(cc.Label).string = this.score;
                cc.audioEngine.pause(this.mainSceneBgm);
            }
        }
    },

    pauseFunction() {
        //ys Do de
        this.resumeCount = 0;
        this.isPausing = true;
        this.settingLayer.active = true;
    },

    resumeFunction() {
        this.isPausing = false;
        this.settingLayer.active = false;
    },

    restartGame() {
        this.isPausing = false;
        this.settingLayer.active = false;
        this.checkGameOver(true);
    },
    quitGame() {
        this.isPausing = false;
        this.isEnding = true;
        this.settingLayer.active = false;
        this.selfClickEnd = true;
        this.checkGameOver(true);

    },

    closeGame() {
        if (globalData.settings.lobby_url != null && globalData.settings.lobby_url != "") {
            window.open(globalData.settings.lobby_url, "_self");
        } else {
            window.open("about:blank", "_self");
        }    },

     close_window() {
        if (window.confirm("Close Window?")) {
          window.close();
        }
    },


    backToHome: function () {
       // window.confirm("sometext");
        cc.sys.garbageCollect();
        cc.director.loadScene("StartScene")
        cc.director.loadScene("Loading");
        cc.sys.garbageCollect();
    },
    restartMain: function () {
        cc.sys.garbageCollect();
        cc.director.loadScene("MainScene")
        cc.director.loadScene("Loading");
        cc.sys.garbageCollect();
    },
    nextLevel: function () {
        cc.log("globalData.getSelectionLevel() = " + globalData.getSelectionLevel());
        cc.log("globalData.getCurrentPlayerLevel() = " + globalData.getCurrentPlayerLevel());

        if (globalData.getSelectionLevel() < globalData.getCurrentPlayerLevel()) {
            globalData.setLevelSelected(globalData.getSelectionLevel() + 1);
            globalData.setSelectionLevel(globalData.getSelectionLevel() + 1);
            this.restartGame();
        } else {
            cc.sys.garbageCollect();
            globalData.setSceneToLoad("LevelSelection");
            cc.director.loadScene("Loading");
            cc.sys.garbageCollect();
        }
    },

    onEffectValueChange() {
        cc.log(this.effect_slider.progress);
        global.setEffectVolume(this.effect_slider.progress);
    },

    toggleMute() {
        if (this.musicToggle.isChecked) {
            globalData.setSound(1);
            cc.audioEngine.setMusicVolume(0.5);
            globalData.setEffectVolume(1);


        }
        else {
            globalData.setSound(0);
            cc.audioEngine.setMusicVolume(0);
            globalData.setEffectVolume(0);


        }
    },

    playEffect: function (audio, volume) {
        this.effect_id2 = cc.audioEngine.play(audio, false);
        if (globalData.getSound() == 0) {
            cc.audioEngine.setVolume(this.effect_id2, 0.0);
        } else if (volume != null) {
            cc.audioEngine.setVolume(this.effect_id2, volume / 6);
        }
        return this.effect_id2;
    },

    playButtonSound: function (audio, volume) {

        if (globalData.getSound() == 0) {

        } else {
            this.playEffect(this.buttonClick, globalData.getEffectVolume());
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(globalData.isKicked){
			this.message.string = globalData.kickMessage;
            this.prompt.active = true;
		}
        this.physicCollider.x = -581.098;
        this.physicCollider2.x = 585.537;

        if (this.scoreAnimate) {
            if (this.progressValue < this.total_add) {
                this.progressValue += this.valueToAdd;
                this.creditLabel.string = Math.round((globalData.settings.balance + this.progressValue) * 100) / 100;
            }
            else {
                //globalData.settings.balance = globalData.settings.balance + this.total_add;
                this.creditLabel.string = Math.round((globalData.settings.balance) * 100) / 100;
                this.finalWin = this.finalWin + this.total_add;
                this.scoreLabel.getComponent(cc.Label).string = Math.round(this.finalWin * 100) / 100;
                this.scoreAnimate = false;
                this.progressValue = 0;
                this.total_add = 0;


            }
        }


        if (this.isAwb) {
            this.progressBar.progress -= dt * this.dropspeed;
            if (this.progressBar.progress <= 0) {
                this.progressBar.progress = 0;
                this.isAwb = false;
            }
        }

        if (this.gamestate == constant.getGameStates("shootbubble")) {
            // Move the bubble in the direction of the mouse

            this.player.bubbleNode.x += 28 * Math.cos(this.degToRad(this.player.bubble.angle));
            this.player.bubbleNode.y += 28 * Math.sin(this.degToRad(this.player.bubble.angle));

            this.player.bubble.x = this.player.bubbleNode.x;
            this.player.bubble.y = this.player.bubbleNode.y;

            // Handle left and right collisions with the level
            if (this.player.bubbleNode.x <= this.level.x) {
                // Left edge
                if (this.downside) {
                    this.player.bubble.angle = 180 - this.player.bubble.angle;
                }
                else {
                    this.player.bubble.angle = 190 - this.player.bubble.angle;
                }
                this.player.bubbleNode.angle = this.player.bubble.angle;
                this.player.bubbleNode.x = this.level.x;

            } else if (this.player.bubbleNode.x + this.level.tilewidth >= this.level.x + this.level.width) {
                // Right edge
                if (this.downside) {
                    cc.log("HERE downside right");
                    this.player.bubble.angle = 175 - this.player.bubble.angle;
                }
                else {
                    cc.log("HERE Upside right");
                    this.player.bubble.angle = 168 - this.player.bubble.angle;
                }
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
            for (var i = 0; i < this.level.columns; i++) {
                for (var j = 0; j < this.level.maxrows; j++) {
                    var tile = this.level.tiles[i][j];

                    // Skip empty tiles
                    if (tile.type < 0) {
                        continue;
                    }

                    //help change to using cocos collision to detect collision
                    // Check for intersections
                    var coord = this.getTileCoordinate(i, j);
                    if (this.circleIntersection(this.player.bubbleNode.x, this.player.bubbleNode.y, this.level.radius-3,
                        coord.tilex, coord.tiley, this.level.radius)) {

                        cc.log("player bubble", this.player.bubbleNode.x, this.player.bubbleNode.y);
                        cc.log("collided with", i, j);
                        // Intersection with a level bubble
                        this.snapBubble(i, j);
                        return;
                    }
                }
            }
        } else if (this.gamestate == constant.getGameStates("gameover")) {

        }


        if (!this.isPausing) {
            if (!this.isGenerating) {
                this.timerCount += dt;
            }
            this.timerLabel.string = 180 - parseInt(this.timerCount);
            if (this.timerCount >= 175) {
                if (globalData.settings.balance >= this.inGameBetting.getComponent("InGameBetting").currentBetting) {
                    this.timerObject.active = true;
                }
                else {
                    this.timerObject.active = false;

                }
                if (this.timerCount >= 180) {
                    this.timerCount = 0;
                    // this.autoShoot();
                    // End session, return bet
                    this.quitGame();
                }
            } else {
                this.timerObject.active = false;

            }
        }


        if (this.isGenerating) {
            this.timerForLoading+=dt;
            if(!globalData.isDemo){
                if (globalData.finishGetData) {
                    //sendresult
                    this.scheduleOnce(function () {
                        this.generateScore();
                    }, 0.2);
                    globalData.finishGetData =false;
                    this.isGenerating=false;

                }
            }
            else{
                this.scheduleOnce(function () {
                    this.generateScore();
                }, 0.2);
                this.isGenerating=false;
            }
        }

        if(this.timerForLoading>=1.5){
            this.loadingLayer.opacity=255;
        }
        if(this.generatingBalance){
            if(!globalData.isDemo){
                if(globalData.finishGetBalance){
                    this.timerForLoading+=dt;
                    if (globalData.settings.balance >= this.inGameBetting.getComponent("InGameBetting").currentBetting) {
                        this.insufficient.active = false;
                        var emit_obj = {
                            'host_id':globalData.host_id,
                            'access_token': globalData.access_token,
                            'game_code': 26,
                            'betAmount': this.inGameBetting.getComponent("InGameBetting").currentBetting,
                            "key": "bubble shooter bet with these index 1st",
                            "description": "bet",
                            "user_id": globalData.settings.user_id,
                            'api_url':globalData.api_url,
                            "requestType": "bet",

                        }

                        if( this.gamestate !=constant.getGameStates("gameover"))
                        {
                            if(globalData.isEncrypt){
                                emit_obj = ecrypt.encrypt(JSON.stringify(emit_obj));
                            }
                            globalData.getSocket().emit('changeBet', emit_obj);
                            this.generateScore2(true);
                        }
                        else{
                            this.loadingLayer.active=false;
                        }

                    }
                    else {
                        this.insufficient.active = true;
                    }

                    this.generatingBalance = false;
                    globalData.finishGetBalance = false;
                }

            }
            else{
                if (globalData.settings.balance >= this.inGameBetting.getComponent("InGameBetting").currentBetting) {
                    this.insufficient.active = false;
                    if( this.gamestate !=constant.getGameStates("gameover"))
                    {
                        globalData.settings.balance-=this.inGameBetting.getComponent("InGameBetting").currentBetting;
                        this.demoGenerateScore(true);
                    }
                    else{
                        this.loadingLayer.active=false;
                    }
                }
                else {
                    this.insufficient.active = true;
                }
                this.generatingBalance = false;
            }

        }
    },

    autoShoot() {
        if (this.gamestate == constant.getGameStates("ready")) {
            // Set the gamestate
            if (!this.insufficient.active) {
                this.total_bet = this.total_bet + this.inGameBetting.getComponent("InGameBetting").currentBetting;
                this.panda.getComponent(cc.Animation).play("pandaShoot");
                this.dragon.getComponent(cc.Animation).play("dragonShooting");
                this.setGameState(constant.getGameStates("init"));

                this.scheduleOnce(function () {
                    this.shootBubble();
                }, 0.1);

                this.scheduleOnce(function () {
                    this.panda.getComponent(cc.Animation).play("pandaIdle");
                }, 0.5);

            }
            // Get the mouse position
            // var pos = this.getMousePos(this.canvas, e);

        }
    },

    addScoreEffect(x, y, value, delayTime) {
        this.scheduleOnce(function () {
            var my_score = new cc.Node("score");
            my_score.width = 350;
            my_score.height = 120;
            var label = my_score.addComponent(cc.Label);
            var outLine = my_score.addComponent(cc.LabelOutline);
            outLine.width = 10;
            outLine.color = new cc.Color(0, 0, 0);
            my_score.color = new cc.Color(255, 255, 255);
            label.font = this.myFont;
            label.string = "+" + value;
            label.fontSize = 50;
            label.lineHeight = 60;
            label.verticalAlign = cc.Label.VerticalAlign.CENTER;
            label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.enableWrapText = false;
            my_score.parent = this.scoreParent;
            my_score.position = cc.v2(x, y);
            my_score.scale = 0;
            label.enableBold = true;
            cc.tween(my_score)
                .by(1.5, { position: cc.v2(0, 80) })
                .start();

            cc.tween(my_score)
                .to(0.5, { scale: 1.5 })
                .to(0.2, { scale: 1 })
                .start();

            var action = cc.fadeOut(1.5);
            this.scheduleOnce(function () {
                my_score.runAction(action);
            }, 0.1);
            this.scheduleOnce(function () {
                my_score.destroy();
            }, 1.5);
        }, delayTime);
    },


    drawRayCast(startLocation, vector_dir) {
        var left_length = 1080 - this._cur_length;
        if (left_length <= 0)
            return;
        var endLocation = startLocation.add(vector_dir.mul(left_length));
        var results = cc.director.getPhysicsManager().rayCast(startLocation, endLocation, cc.RayCastType.Closest);
        if (results.length > 0) {
            var result = results[0];
            // 指定射线与穿过的碰撞体在哪一点相交。
            var point = result.point;
            // 画入射线段
            this.drawAimLine(startLocation, point);
            // 计算长度
            var line_length = point.sub(startLocation).mag();

            // 计算已画长度
            this._cur_length += line_length;
            // 指定碰撞体在相交点的表面的法线单位向量。
            var vector_n = result.normal;
            // 入射单位向量
            var vector_i = vector_dir;
            // 反射单位向量
            var vector_r = vector_i.sub(vector_n.mul(2 * vector_i.dot(vector_n)));

            // 接着计算下一段
            this.drawRayCast(point, vector_r);
        } else {
            // 画剩余线段
            this.drawAimLine(startLocation, endLocation);
        }
    },

    drawAimLine(startLocation, endLocation) {
        var graphic_startLocation = this.graphic_line.node.convertToNodeSpaceAR(startLocation);
        this.graphic_line.lineTo(graphic_startLocation.x, graphic_startLocation.y);
        var delta = 50;

        var vector_dir = endLocation.sub(startLocation);

        // 数量
        var total_count = Math.round(vector_dir.mag() / delta);
        // 每次间隔向量
        vector_dir.normalizeSelf().mulSelf(delta);
        for (let index = 0; index < total_count; index++) {
            graphic_startLocation.addSelf(vector_dir)
            this.graphic_line.circle(graphic_startLocation.x, graphic_startLocation.y, 2);
        }
    },




    fullScreen() {
        if (cc.screen.fullScreen()) {
            cc.screen.exitFullScreen();

        }
        else {
            cc.screen.requestFullScreen();
        }
    },

    generateScore(){
        this.loadingLayer.active = false;
        this.updateCredit();
        if( this.render){
            this.renderPlayer(0);
        }
        this.maxWinLable.string = "Max Win Score:  " + Math.round(globalData.maxWin*10)/10;

    },

    generateScore2(value) {
        this.isGenerating = true;
       this.render = value;
    },


    demoGenerateScore(value) {

        var result;
        var jackpotResult;

        result =(Math.random() * (5 - 1) + 1);
        jackpotResult =(Math.random() * (5 - 1) + 1);

        var jackpot = 5 * this.inGameBetting.getComponent("InGameBetting").currentBetting;
        var score = 5 * this.inGameBetting.getComponent("InGameBetting").currentBetting;
        globalData.maxMultiplier = 5;

        this.isGenerating = true;
        globalData.maxWin = score;
        // globalData.jackpot = jackpot;
        this.render = value;
    },
});
