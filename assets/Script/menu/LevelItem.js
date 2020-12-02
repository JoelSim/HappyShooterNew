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

        star:{
            default:[],
            type:[cc.Node]
        },

        lock_layer:{
            default:null,
            type:cc.Node
        },

        level:{
            default:1
        },

        label_layer:{
            default:null,
            type:cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.game = cc.find("Canvas");
        this.game = this.game.getComponent("LevelSelection");
        // this.lock_layer.active = false;
    },

    disableItem(){
        this.lock_layer.active = true;
        for(var i=0; i<this.star.length; i++){
            this.star[i].active  = false;
        }
        this.label_layer.active= false;
        this.node.getComponent(cc.Button).interactable = false;
    },

    onLevelPressed(){
        // global.setSceneToLoad("Level_"+this.level);
        global.setSceneToLoad("MainScene");
        global.setLevelSelected(this.level);
        global.setSelectionLevel(this.level);
        this.game.openLevelConfirmation(this.level);
        cc.log("-------------------- item = " +global.getSelectionLevel() +" " +this.level);

    },

    // update (dt) {},
});
