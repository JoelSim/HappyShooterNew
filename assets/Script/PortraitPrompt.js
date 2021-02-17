// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import * as global from "GlobalVar";

cc.Class({
    extends: cc.Component,

    properties: {
        portraitNode:{
			default: null,
 			type: cc.Node,
		},
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        if(!global.firstPrompt){
            this.portraitNode.active = true;
            global.firstPrompt = true;
        }
    },

    onclick(){
        this.portraitNode.active = false;
    }
    // update (dt) {},
});
