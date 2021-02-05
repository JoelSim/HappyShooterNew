// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import * as globalData from "GlobalData";
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
        generatingBalance:false,
        myButton: {
            default: [],
            type: [cc.Node],
        },
        slotPrize: {
            default: [],
            type: [cc.Float],
        },
        loadingLayer:{
            default: null,
            type: cc.Node
        },
        firstSlotLabel: {
            default: null,
            type: cc.Label
        },
        secondSlotLabel: {
            default: null,
            type: cc.Label
        },
        thirdSlotLabel: {
            default: null,
            type: cc.Label
        },
        forthSlotLabel: {
            default: null,
            type: cc.Label
        },
        fifthSlotLabel: {
            default: null,
            type: cc.Label
        },
        mainGame: {
            default: null,
            type: cc.Node
        },

        insufficient: {
            default: null,
            type: cc.Node
        },
        bettingOptionText: {
            default: [],
            type: [cc.Node]
        },
        // mainBetSelection:{
        //     default:null,
        //     type:cc.Node
        // },
        bettingOptionSprite: {
            default: [],
            type: [cc.Sprite]
        },
        selectedBet: {
            default: [],
            type: [cc.Node]
        },

        nonSelectedSprite: {
            default: [],
            type: [cc.SpriteFrame]
        },

        currentBettingLabel: {
            default: null,
            type: cc.Label,
        },
        canPlay: false,
        hiding: false,
        currentBetting: 0,
        lastBetting: 0,

        sureToChange:{
            default:null,
            type:cc.Node,
        },
        cannotChange:{
            default:null,
            type:cc.Node,
        },
        valueOnHold:0,
        valueOnHoldBetSelection:0,
        valueToConfirm:0,
    },

    // LIFE-CYCLE CALLBACKS:

    openSureToChange(event, value){
        if(this.mainGame.getComponent("MainScene").switchBtn.interactable==false||this.mainGame.getComponent("MainScene").gamestate!=constant.getGameStates("ready")){
            this.openCannotChange();
        }
        else{
            this.sureToChange.active=true;
            this.valueOnHold = Number(value);
            this.valueToConfirm=0;
        }
       

    },

    openCannotChange(){
        this.cannotChange.active = true;
    },
    closeCannotChange(){
        this.cannotChange.active = false;
    },
    openSureToChangeBetSelection(event, value){
        if(this.mainGame.getComponent("MainScene").switchBtn.interactable==false||this.mainGame.getComponent("MainScene").gamestate!=constant.getGameStates("ready")){
            this.openCannotChange();
        }
        else{
            this.sureToChange.active=true;
            this.valueOnHoldBetSelection = Number(value);
            this.valueToConfirm=1;
        }
    },
    confirmChange(){
        if(this.valueToConfirm==1){
            cc.find("Canvas").getComponent("BetSelection").selectBetOption1(this.valueOnHoldBetSelection);
            this.SetAmount(0);
            this.mainGame.getComponent("MainScene").resumeFunction();
            this.mainGame.getComponent("MainScene").playBetSound();

        }
        else{
            this.selectBetOption(this.valueOnHold);
        }
        this.closeSureToChange();
    },
    closeSureToChange(){
        this.sureToChange.active=false;
    },
    onLoad() {
        this.canPlay = false;
        this.anim = this.node.getComponent(cc.Animation);
        this.selectedBetOption = 0;
        cc.log(globalData.settings.user_id);
        this.SetAmount(1);
    },

    returnCanPlay() {
        return this.canPlay;
    },

    setCanPlay() {
        this.canPlay = false;

    },

    playShake() {
        this.anim.play('shake');
    },
    SetAmount(value) {
        // this.maintBetOption = this.mainBetSelection.getComponent("BetSelection").selectedBetOption;
        this.maintBetOption = globalData.getBetSelection();
        if (this.maintBetOption == 0) {
            this.myValue = 1;
        }
        if (this.maintBetOption == 1) {
            this.myValue = 5;

        }
        if (this.maintBetOption == 2) {
            this.myValue = 10;
        }
        if (this.maintBetOption == 3) {
            this.myValue = 20;
        }
        for (let i = 0; i < this.bettingOptionText.length; i++) {
            if (i == 0) {
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1 * this.myValue));
            }
            else if (i == 1) {
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1 * this.myValue)) * 2;
            }
            else if (i == 2) {
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1 * this.myValue)) * 3;
            }
            else {
                this.bettingOptionText[i].getComponent(cc.Label).string = ((1 * this.myValue) / (this.bettingOptionText.length - i)) * 10;
            }
        }

        if (this.selectedBetOption < 3) {
            this.currentBetting = ((1 * this.myValue)) * (this.selectedBetOption + 1);
        }
        else {
            this.currentBetting = ((1 * this.myValue) / (this.bettingOptionText.length - this.selectedBetOption)) * 10;
        }


        for (let i = 0; i < this.selectedBet.length; i++) {
            if (i == this.selectedBetOption) {
                this.selectedBet[i].active = true;
                this.myButton[i].scale = cc.v2(0.9, 0.9);

            } else {
                this.selectedBet[i].active = false;
                this.myButton[i].scale = cc.v2(0.7, 0.7);

            }
        }
       // this.lastBetting = this.currentBetting;

        if (this.lastBetting != this.currentBetting) {

            if (globalData.settings.balance + this.lastBetting >= this.currentBetting) {
                this.currentBettingLabel.string = this.currentBetting;
                //eligible for betting;
                this.lastBetting = this.currentBetting;
                this.loadingLayer.opacity=255;
                this.loadingLayer.active=true;
                if (value == 0) {
                    if(!globalData.isDemo){
                        var emit_result = {
                            'host_id':globalData.host_id,
                            'access_token': globalData.access_token,
                            'ticket_id': globalData.ticket_id,
                            'result': this.lastBetting,
                            'key': "Change bet: " + this.lastBetting,
                            'game_code': globalData.game_code,
                            'description': "Get previous bet and change bet",
                            'user_id': globalData.settings.user_id,
                            'api_url':globalData.api_url,
                            'changeBet':true,
                            'is_refund':1,
                        };
                        if(globalData.isEncrypt){
                            emit_result = btoa(JSON.stringify(emit_result));
                        }
                        globalData.getSocket().emit('send-result', emit_result);
                        this.generatingBalance = true;
                    }
                    else{
                        globalData.settings.balance+=this.lastBetting;
                        this.generatingBalance = true;
                    }
                    this.mainGame.getComponent("MainScene").resetAWB();

                }
               
                else{
                    this.insufficient.active = false;
                    this.loadingLayer.active=true;
                    this.loadingLayer.opacity=255;
                    if (!globalData.isDemo) {
                        var emit_obj = {
                            'host_id': globalData.host_id,
                            'access_token': globalData.access_token,
                            'game_code': 26,
                            'betAmount': this.currentBetting,
                            "key": "bubble shooter bet with these index 1st",
                            "description": "bet",
                            "user_id": globalData.settings.user_id,
                            'api_url':globalData.api_url,
                            "requestType": "bet",
                        }
                        if(globalData.isEncrypt){
                            emit_obj = btoa(JSON.stringify(emit_obj));
                        }
                        globalData.getSocket().emit('changeBet', emit_obj);
                        this.updateSlotAmount();
                        this.mainGame.getComponent("MainScene").generateScore2(false);
                        this.mainGame.getComponent("MainScene").canShootBall = true;
                    }
                    else{
                        globalData.settings.balance -= this.currentBetting;
                        this.updateSlotAmount();
                        this.mainGame.getComponent("MainScene").demoGenerateScore(false);
                        this.mainGame.getComponent("MainScene").canShootBall = true;
                    }
                }
            }
            else {
                this.insufficient.active = true;
                this.mainGame.getComponent("MainScene").canShootBall = false;


            }
        }
        else{
            if (globalData.settings.balance + this.lastBetting >= this.currentBetting) {
                    this.insufficient.active = false;
                    this.mainGame.getComponent("MainScene").canShootBall = true;

            }
        }

    },

    updateSlotAmount() {
        this.slotPrize = [];
        this.firstSlotLabel.string = Math.round((this.currentBetting * 0.05) * 100) / 100;
        this.secondSlotLabel.string = Math.round((this.currentBetting * 0.15) * 100) / 100;
        this.thirdSlotLabel.string = Math.round((this.currentBetting * 0.5) * 100) / 100;
        this.forthSlotLabel.string = Math.round((this.currentBetting * 0.25) * 100) / 100;
        this.fifthSlotLabel.string = 0
        this.slotPrize.push(Math.round((this.currentBetting * 0.05) * 100) / 100);
        this.slotPrize.push(Math.round((this.currentBetting * 0.15) * 100) / 100);
        this.slotPrize.push(Math.round((this.currentBetting * 0.5) * 100) / 100);
        this.slotPrize.push(Math.round((this.currentBetting * 0.25) * 100) / 100);
        this.slotPrize.push(0);
    },

    returnSlotAmount(value) {
        return this.slotPrize[value];
    },

    returnSlotAmountArray() {
        return this.slotPrize;
    },
    selectBetOption(value) {
        this.selectedBetOption = Number(value);
        //this.lastBetting = this.currentBetting;

        this.canPlay = true;
        // this.node.active = false;
        cc.log("Selected bet option:" + this.selectedBetOption);
        for (let i = 0; i < this.selectedBet.length; i++) {
            if (i == value) {
                this.selectedBet[i].active = true;
                this.myButton[i].scale = cc.v2(0.9, 0.9);

            } else {
                this.selectedBet[i].active = false;
                this.myButton[i].scale = cc.v2(0.7, 0.7);

            }
        }

        if (this.selectedBetOption < 3) {
            this.currentBetting = ((1 * this.myValue)) * (this.selectedBetOption + 1);
        }
        else {
            this.currentBetting = ((1 * this.myValue) / (this.bettingOptionText.length - this.selectedBetOption)) * 10;
        }



        if (this.lastBetting != this.currentBetting) {
            if (globalData.settings.balance + this.lastBetting >= this.currentBetting) {
                //eligible for betting;
                this.currentBettingLabel.string = this.currentBetting;
                this.loadingLayer.active=true;
                this.loadingLayer.opacity=255;
                if(!globalData.isDemo){
                    var emit_result = {
                        'host_id':globalData.host_id,
                        'access_token': globalData.access_token,
                        'ticket_id': globalData.ticket_id,
                        'result': this.lastBetting,
                        'key': "Change bet: " + this.lastBetting,
                        'game_code': globalData.game_code,
                        'description': "Get previous bet and change bet",
                        'user_id': globalData.settings.user_id,
                        'api_url':globalData.api_url,
                        'changeBet':true,
                        'is_refund':1,
                    };
                    if(globalData.isEncrypt){
                        emit_result = btoa(JSON.stringify(emit_result));
                    }
                    globalData.getSocket().emit('send-result', emit_result);
                }
                else{
                    globalData.settings.balance +=this.lastBetting;
                }
                this.mainGame.getComponent("MainScene").resetAWB();
                this.lastBetting = this.currentBetting;
                this.generatingBalance = true;

            }
            else {
                this.insufficient.active = true;
                this.mainGame.getComponent("MainScene").canShootBall = false;


            }
        }
        else{
            if (globalData.settings.balance + this.lastBetting >= this.currentBetting) {
                    this.insufficient.active = false;
                    this.mainGame.getComponent("MainScene").canShootBall = true;

            }
        }

    },
    start() {

    },

    hide() {
        if (this.hiding) {
            this.anim.play('show');
            this.hiding = false;
        }
        else {
            this.anim.play('hide');
            this.hiding = true;

        }
    },
    onDestroy() {
        if (!globalData.isDemo) {
            var emit_result = {
                'host_id': globalData.host_id,
                'access_token': globalData.access_token,
                'ticket_id': globalData.ticket_id,
                'result': this.lastBetting,
                'key': "Go to home: " + this.lastBetting,
                'game_code': globalData.game_code,
                'description': "Cancel bet and go to home",
                'user_id': globalData.settings.user_id,
                'api_url':globalData.api_url,
                'changeBet':true,
                'is_refund': 1,
            };
            if (this.mainGame.getComponent("MainScene").selfClickEnd) {
                if(globalData.isEncrypt){
                    emit_result = btoa(JSON.stringify(emit_result));
                }
                globalData.getSocket().emit('send-result', emit_result);
            }
        } 
        else {
            if (this.mainGame.getComponent("MainScene").selfClickEnd) {
                globalData.settings.balance += this.lastBetting;
            }
        }
    },



     update (dt) {

        if(this.generatingBalance){
            if(!globalData.isDemo){
                if(globalData.finishGetBalance){
                    this.insufficient.active = false;
                    var emit_obj = {
                        'host_id':globalData.host_id,
                        'access_token': globalData.access_token,
                        'game_code': 26,
                        'betAmount': this.currentBetting,
                        "key": "bubble shooter bet with these index 1st",
                        "description": "bet",
                        "user_id": globalData.settings.user_id,
                        'api_url':globalData.api_url,
                        "requestType": "social_addon",
                        'ticket_id': globalData.ticket_id,
                    }
                    if(globalData.isEncrypt){
                        emit_obj = btoa(JSON.stringify(emit_obj));
                    }
                    globalData.getSocket().emit('changeBet', emit_obj);
                    this.updateSlotAmount();
                    this.mainGame.getComponent("MainScene").generateScore2(false);
                    this.mainGame.getComponent("MainScene").canShootBall = true;
                    this.generatingBalance =false;
                    globalData.finishGetBalance = false;
                }
            }
            else{
                globalData.settings.balance -=  this.currentBetting;
                this.updateSlotAmount();
                this.mainGame.getComponent("MainScene").demoGenerateScore(false);
                this.mainGame.getComponent("MainScene").canShootBall = true;
                this.generatingBalance=false;
            }


        }

     },
});
