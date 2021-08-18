// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import * as gameLib from "GameLibUtils";
import * as global from "GlobalData";
import * as constant from "Constant";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        loadingLayer:{
            default:null,
            type:cc.Node,
        },
        settingLayer:{
            default:null,
            type:cc.Node,
        },
        
        musicToggle:{
            default:null,
            type:cc.Toggle,
        },

        balance:{
            default:null,
            type:cc.Label,
        },
        sureToExit:{
            default:null,
            type:cc.Node,
        },
        message:{
			default:null,
			type:cc.Label
		},
        prompt:{
            default:null,
            type:cc.Node
        },
        errorButtons:{
            default:[],
            type:[cc.Node],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    openSureToExit(){
        this.sureToExit.active=true;
    },
    closeSureToExit(){
        this.sureToExit.active=false;
    },
    onLoad () {
        if(cc.sys.isMobile){
			cc.view.resizeWithBrowserSize(true);
			cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.SHOW_ALL);
		}else{
			this.node.getComponent(cc.Canvas).fitHeight = true;
			this.node.getComponent(cc.Canvas).fitWidth = true;
        }
        
        if(global.getSound()==0){
            this.musicToggle.isChecked=false;
        }

        this.api = this.node.getComponent("API");
        this.api.getSettings();
        // this.getComponent("Socket").connectSocket();
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
        
    },

    start () {
        // if(cc.sys.isMobile){
        //     cc.view.resizeWithBrowserSize(true);
        //     cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.EXACT_FIT);
        // }else{
        //     this.node.getComponent(cc.Canvas).fitHeight = true;
        //     this.node.getComponent(cc.Canvas).fitWidth = true;
        // }
        var self = this;
        // this.musicBG =null;
        cc.loader.loadRes("Audio/start_button_click", function(err,audio){
            cc.log(audio);
            self.button_click = audio;
        });
        cc.loader.loadRes("Audio/start_game_bgm", function(err,audio){
            cc.log(audio);
            self.musicBG = audio;
            cc.audioEngine.playMusic(self.musicBG,true);
        });
        this.load_layer = cc.find("Canvas/load_layer");
        this.versionLabel = cc.find("Canvas/version");
        this.versionLabel.getComponent(cc.Label).string = constant.getVersion();

        this.effect_id2;
        cc.log(URL.username);
        if(URL.username != null && global.getIsLogin() == false){
            if(URL.isLive != null){
                if(URL.isLive == 1){
                    // global.setAPIURL("http://togacapital.cn");
                }else{
                    // global.setAPIURL("http://tca-test.togacapital.com");
                }
            }else{
                cc.log("Null");
                // global.setAPIURL("http://togacapital.cn");
            }
            this.load_layer.active = true;
            // this.node.getComponent("API").getUser(URL.username);
            // this.node.getComponent("API").getAllScore(URL.username);
            // this.node.getComponent("API").getRandomFriend(false);
        }else if(URL.username != null){
            // this.node.getComponent("API").getAllScore(URL.username);
            this.load_layer.active = false;
        }else{
            this.load_layer.active= false;
        }

        if(URL.lang != null){
            global.setLang(URL.lang);
        }

        this.loadingLayer.active = true;
     
    },

    setBalance(){
        this.loadingLayer.active = false;
        this.balance.string = (Math.round((global.settings.balance) * 100) / 100)+" "; 
    },
    playEffect:function(audio, volume){
        this.effect_id2 = cc.audioEngine.play(audio, false);
        if(global.getSound() == 0 ){
            cc.audioEngine.setVolume(this.effect_id2, 0.0);
        }else if(volume != null){
            cc.audioEngine.setVolume(this.effect_id2, volume);
        }
        return this.effect_id2;
    },

    levelSelectionPage(){


        //global.getSocket().disconnect();

        this.loadingLayer.active=true;
        this.playEffect(this.button_click, global.getEffectVolume());
        cc.audioEngine.stopMusic(this.musicBG);
        //global.setSceneToLoad("LevelSelection")
        global.setSceneToLoad("MainScene")
        cc.director.loadScene("Loading");
    },

    playButtonSound(){
        this.playEffect(this.button_click, global.getEffectVolume());
    },
    toggleMute(){
        if(this.musicToggle.isChecked){
            global.setSound(1);        
            cc.audioEngine.setMusicVolume(0.5);
            global.setEffectVolume(1);


        }
        else{
            global.setSound(0);        
            cc.audioEngine.setMusicVolume(0);
            global.setEffectVolume(0);


        }
    },

    openSetting(){

        this.settingLayer.active = true;
    },

    closeSetting(){
        this.settingLayer.active = false;
    },

    
    fullScreen() {
        if (cc.screen.fullScreen()) {
            cc.screen.exitFullScreen();

        }
        else {
            cc.screen.requestFullScreen();
        }
    },
    
    closeGame(){
        if (global.settings.lobby_url != null && global.settings.lobby_url != "") {
            window.open(global.settings.lobby_url, "_self");
        } else {
            window.open("about:blank", "_self");
        }
    },

    update (dt) {
        if(global.isKicked){
            this.errorButtons[0].active = false;
            this.errorButtons[1].active = true;
			this.message.string = global.kickMessage;
            this.prompt.active = true;
		}
    },
});
