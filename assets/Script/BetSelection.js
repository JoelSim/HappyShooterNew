// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import * as globalData from "GlobalData";

cc.Class({
    extends: cc.Component,

    properties: {

		playBtn:{

			default:null,
			type:cc.Button

		},
		bet_options:{
			default:[],
			type:[cc.Node]
		},

		selectedBet:{
			default:[],
			type:[cc.Node]
		},

		bet_options_label:{
			default:[],
			type:[cc.Label]
		}
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.setOptionsAmount(null);
	},

    start () {
      
		this.selectedBetOption = globalData.getBetSelection();
		// if (!(this.playBtn==null)) {
		// 	this.playBtn.interactable = false;
		// 	this.playBtn.node.opacity = 160;
		// }
		
    },

	// update (dt) {},
	
	setOptionsAmount(settings){
		if(settings != null){
			globalData.configBetRange[0] = settings.bet_chip_1;
			globalData.configBetRange[1] = settings.bet_chip_2;
			globalData.configBetRange[2] = settings.bet_chip_3;
			globalData.configBetRange[3] = settings.bet_chip_4;
			globalData.configBetAmount[0] = settings.bet_amount_1;
			globalData.configBetAmount[1] = settings.bet_amount_2;
			globalData.configBetAmount[2] = settings.bet_amount_3;
			globalData.configBetAmount[3] = settings.bet_amount_4;
			globalData.configBetAmount[4] = settings.bet_amount_5;
		}

		for(let i = 0; i < this.bet_options_label.length; i++){
			let index = i;
			this.label = this.bet_options_label[index].string = "x" + globalData.configBetRange[index];
		}
	},
	setSprite(){
		for(let i = 0; i < this.selectedBet.length; i++){
			if(i == this.selectedBetOption){
				this.selectedBet[i].active = true;
			}else{
				this.selectedBet[i].active = false;
			}
		}
	},
	selectBetOption(event, value){
		this.selectedBetOption = Number(value);
		cc.log("Selected bet option:" + this.selectedBetOption);

		for(let i = 0; i < this.selectedBet.length; i++){
			if(i == this.selectedBetOption){
				this.selectedBet[i].active = true;
			}else{
				this.selectedBet[i].active = false;
			}
		}

		if (!(this.playBtn==null)) {

			this.playBtn.interactable = true;
			this.playBtn.node.opacity = 255;
		}
		globalData.setBetSelection(this.selectedBetOption);
	},
	
    StartGame(){
		//send server
		//start game
		
	},

	arrayContainValue(array, value){
		for(let i = 0; i < array.length; i++){
			if(array[i] == value){
				return true;
			}
		}
		return false;
	},

	clearArray(array){
		while(array.length > 0){
			array.pop();
		}
	},

	getRandomInt(min, max){
		return parseInt(Math.random() * (max + 1 - min) + min);
	}
});
