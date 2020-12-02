// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import * as globalData from "GlobalData";

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
        fadeOutClip:{
            default:null,
            type:cc.AudioClip
        },
        playSound:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        this.game = cc.find('Canvas');
        this.game = this.game.getComponent('MainScene');
    },

    onCollisionEnter: function (other, self) {
        // cc.log(this.need_check);
        if(this.need_check ){
             cc.log("hit", other);
            this.need_check = false;
            //this.game.snapBubble();
        }

        if (this.playSound) {
            this.game.playEffect(this.fadeOutClip, globalData.getEffectVolume());
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (this.playSound) {
            this.game.playEffect(this.fadeOutClip, globalData.getEffectVolume());
        }
    },

    onCollisionStay:function(other, self){
    },

    checkCollision(){

    },


    putRigidbody(valueX,firstY,secondY,thirdY,bezierTime,xyTile){
        if (xyTile.type != 6) {
            this.node.addComponent(cc.RigidBody);
            this.node.addComponent(cc.PhysicsCircleCollider);
            let rigidBody = this.node.getComponent(cc.RigidBody);
            let cirCollider = this.node.getComponent(cc.PhysicsCircleCollider);
            rigidBody.type = cc.RigidBodyType.Static;
            rigidBody.gravityScale = 8;
            rigidBody.enabledContactListener = true;
            cirCollider.radius = 40;
            cirCollider.density = 30;
            cirCollider.restitution = 1;
            cirCollider.enabled = false;
            cirCollider.enabled = true;
            let bezier = [cc.v2(valueX, firstY), cc.v2(valueX, secondY), cc.v2(valueX, thirdY)];
            let goBezier = cc.bezierTo(bezierTime, bezier);
            this.node.runAction(goBezier);
            let scaleSmallAgain = cc.scaleTo(0.3,0.6);
            this.node.runAction(scaleSmallAgain);
            this.DestorySelf(xyTile.bubbleNode);

        }else{
            

            let tempBubble = [];
            this.game.jackpotCurrentPath = 0;
            // this.game.jackpotPathToIn = this.game.calculateJackpotBall(true);
            for (let i = 0; i < 7; i++){
                tempBubble[i] = cc.instantiate(this.game.ballPrefab);
                tempBubble[i].parent = this.game.staticLevelLayer;
                tempBubble[i].getComponent(cc.Sprite).spriteFrame = this.game.ballsImage[6];
                tempBubble[i].position = xyTile.bubbleNode.position;
                tempBubble[i].width = tempBubble[i].width / 2;
                tempBubble[i].height = tempBubble[i].height / 2;

                tempBubble[i].addComponent(cc.RigidBody);
                tempBubble[i].addComponent(cc.PhysicsCircleCollider);
                let rigidBody = tempBubble[i].getComponent(cc.RigidBody);
                let cirCollider = tempBubble[i].getComponent(cc.PhysicsCircleCollider);
                rigidBody.enabledContactListener = true;
                rigidBody.type = cc.RigidBodyType.Static;
                rigidBody.gravityScale = 8;
                cirCollider.radius = cirCollider.radius / 2;
                cirCollider.restitution = 1;
                cirCollider.density = 30;
                cirCollider.enabled = false;
                cirCollider.enabled = true;
                let x = this.game.generatePath(tempBubble[i].x ,true);
                let bezier = [cc.v2(x, firstY), cc.v2(x, secondY), cc.v2(x, thirdY)];
                let goBezier = cc.bezierTo(bezierTime, bezier);
                tempBubble[i].runAction(goBezier);
                tempBubble[i].getComponent("Ball").DestorySelf(tempBubble[i]);
            
            }

            if(xyTile.bubbleNode != null){
                xyTile.bubbleNode.destroy();
                xyTile.bubbleNode = null;
            }
        }
    },

    DestorySelf(n){
        let rigidBody = n.getComponent(cc.RigidBody);
        this.scheduleOnce(function () {
            rigidBody.type = cc.RigidBodyType.Dynamic;
            this.playSound=true;
            this.scheduleOnce(function () {
                let action = cc.fadeOut(0.5);
                let scaleSmall = cc.scaleTo(0.3,0.2);
                n.runAction(action);
                n.runAction(scaleSmall);
                this.scheduleOnce(function () {
                    if(n != null){
                        n.destroy();
                        n = null;
                    }
                }, 0.6)
            }, 0.6)
        }, 0.3);
    }
    // update (dt) {},
});
