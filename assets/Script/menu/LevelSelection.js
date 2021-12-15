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

		level_view :{
			default:null,
			type:cc.ScrollView
		},

		level_prefab:{
			default:null,
			type:cc.Prefab
		},

		total_level:{
			default:5
		},

		current_player_level:{
			default:2
		},

		star_sprite:{
			default :[],
			type:[cc.SpriteFrame]
		},

		level_star_sprite:{
			default:[],
			type:[cc.SpriteFrame]
		},

		effect_slider:{
			default:null,
			type:cc.Slider
		},

		music_slider:{
			default:null,
			type:cc.Slider
		},

		language_off:{
			default:[],
			type:[cc.SpriteFrame]
		},

		language_on:{
			default:[],
			type:[cc.SpriteFrame]
		},
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start () {
		if(cc.sys.isMobile){
			cc.view.resizeWithBrowserSize(true);
			cc.view.setDesignResolutionSize(1080, 1920, cc.ResolutionPolicy.EXACT_FIT);
		}else{
			this.node.getComponent(cc.Canvas).fitHeight = true;
			this.node.getComponent(cc.Canvas).fitWidth = true;
		}
		global.setCurrentMaxLevel(this.total_level);
		// cc.log(constant.getLevelList());
		// this.total_level = constant.getLevelList().length;
		// cc.log(this.total_level +" " +constant.getLevelList().length);
		// cc.log(constant.getLevelList());
		// global.setCurrentMaxLevel(constant.getLevelList().length);
		this.purchaseCoinTotal = 0;
		this.level_confirmation_layer = cc.find("Canvas/level_confirmation");
		this.level_label = cc.find("Canvas/level_confirmation/label");
		this.level_coin = cc.find("Canvas/bg/coin_title/coin");
		this.settings_layer = cc.find("Canvas/settings_layer");
		this.exit_layer = cc.find("Canvas/exit_layer");

		this.tutorial = cc.find("Canvas/tutorial");
		this.tutorial.page1 = cc.find("Canvas/tutorial/page1");
		this.tutorial.page2 = cc.find("Canvas/tutorial/page2");
		this.tutorial.leftButton = cc.find("Canvas/tutorial/btn_left");
		this.tutorial.rightButton = cc.find("Canvas/tutorial/btn_right");

		this.confirmation_star = [];
		for(var i=0; i<3; i++){
			this.confirmation_star[i] = cc.find("Canvas/level_confirmation/star_"+(i+1));
		}

		this.confirmation_purchase = [];
		for(var i=0; i<3; i++){
			this.confirmation_purchase[i] = cc.find("Canvas/level_confirmation/purchase_"+i+"/checkbox");
		}
		cc.log("level max = " +global.getCurrentMaxLevel());
		cc.log(this.confirmation_purchase);
		if(global.getIsLogin()){
			this.node.getComponent("API").getAllScore(URL.username, true);
		}else{
			this.current_player_level = cc.sys.localStorage.getItem('level');
			if(this.current_player_level == null){
				this.current_player_level = 1;
			}
			global.setCurrentPlayerLevel(this.current_player_level);

			this.level_star = cc.sys.localStorage.getItem('star');
			cc.log(this.level_star);
			function isJson(str) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			}

			if(this.level_star == null  || !isJson(this.level_star)){
				this.level_star = [];
				for(var i=0; i<this.current_player_level ;i++){
					this.level_star[i] = 0;
				}
			}else{
				this.level_star = JSON.parse(this.level_star);
				this.level_star= this.level_star["data"];
			}

			this.spawnAllLevel();
		}

		var coin = cc.sys.localStorage.getItem('coin');
		if(coin == null){
			coin = 100
		}else{
			coin = Number(coin);
		}
		this.level_coin.getComponent(cc.Label).string =coin;
		global.setCoin(coin);
		var self = this;
		cc.loader.loadRes("Audio/start_button_click", function(err,audio){
			cc.log(audio);
			self.button_click = audio;
		});

		cc.loader.loadRes("Audio/level_selection_bgm", function(err,audio){
            cc.log(audio);
            self.musicBG = audio;
            cc.audioEngine.playMusic(self.musicBG,true);
			cc.audioEngine.setMusicVolume(global.getEffectVolume() / 6);
        });
        cc.loader.loadRes("Audio/button_click", function(err,audio){
            cc.log(audio);
            self.button_normal_click= audio;
        });

		this.effect_id2;

		this.effect_slider.progress = global.getEffectVolume();
		this.music_slider.progress = global.getBgVolume();

		this.flag_node = [];
		this.flag_node[0] = cc.find("Canvas/settings_layer/language/language_en");
		this.flag_node[1] = cc.find("Canvas/settings_layer/language/language_cn");
		this.flag_node[2] = cc.find("Canvas/settings_layer/language/language_cnt");
		this.changeLanguage();

		if(global.getLang() == "en"){
			this.flag_node[0].getComponent(cc.Sprite).spriteFrame = this.language_on[0];
		}else if(global.getLang() == "ch"){
			this.flag_node[1].getComponent(cc.Sprite).spriteFrame = this.language_on[1];
		}else{
			this.flag_node[2].getComponent(cc.Sprite).spriteFrame = this.language_on[2];
		}
		
		constant.setBubblesAmount(constant.getRecordBubble(),constant.getBubblesJSONBase()[constant.getRecordBubble()]);
	

	},

	changeLanguage(){
		var title = cc.find("Canvas/panel_ribbon/level_title");
		var settings_title = cc.find("Canvas/settings_layer/label");
		var sound = cc.find("Canvas/settings_layer/sound");
		var music = cc.find("Canvas/settings_layer/music");

		title.getComponent(cc.Label).string = language[global.getLang()].select_level;
		settings_title.getComponent(cc.Label).string = language[global.getLang()].settings;
		sound.getComponent(cc.Label).string = language[global.getLang()].sound;
		music.getComponent(cc.Label).string = language[global.getLang()].music;
	},

	setLevelStar(score){
		// var score = parsed.score;
		cc.log(score);
		this.level_star = [];
		for(var i=0; i<score.length; i++){
			this.level_star[Number(score[i].level) - 1] = Number(score[i].score);
		}
		cc.log(this.level_star);
		global.setCurrentPlayerLevel(score.length + 1);
		this.current_player_level = score.length + 1;
		this.spawnAllLevel();
	},

	spawnAllLevel(){
		if(this.level_star.length < this.total_level){
			for(var i=0; i<this.total_level	; i++){
				if(this.level_star[i] == null){
					this.level_star[i] = 0;
				}
			}
		}

		var data = {
			"data" : this.level_star
		};
		data = JSON.stringify(data);
		cc.log(data);
		cc.sys.localStorage.setItem('star', data);

		global.setLevelStar(this.level_star);
		cc.log(this.level_star);
		this.level_view.content.height = (300) + (Math.ceil(this.total_level/3)*320);
		for(var i=0; i<this.total_level; i++){
			var x = i%3;
			var y = Math.floor(i/3);
			var newLevel = cc.instantiate(this.level_prefab);
			newLevel.parent = this.level_view.content;
			newLevel.setPosition(cc.v2((newLevel.x - 115) + (x * 340), newLevel.y - (y * 320)));
			// cc.log(newLevel ,newLevel.parent.name );
			var item = newLevel.getComponent("LevelItem");
			if( (i + 1)  > this.current_player_level){
				item.disableItem();
				item.lock_layer.active = true;
			}else{
				item.lock_layer.active = false;
				var label = newLevel.getChildByName("label");
				label.getComponent(cc.Label).string = (i+1);
				for(var j=0; j<3; j++){
					if(j < this.level_star[i]){
						item.star[j].getComponent(cc.Sprite).spriteFrame = this.star_sprite[1];
						cc.log("Enter");
					}else{
						item.star[j].getComponent(cc.Sprite).spriteFrame = this.star_sprite[0];
						cc.log("else");
					}
				}
			}
			item.level = (i+1);
		}
	},

	playEffect:function(audio, volume){
		this.effect_id2 = cc.audioEngine.play(audio, false);
		if(global.getSound() == 0 ){
			cc.audioEngine.setVolume(this.effect_id2, 0.0);
		}else if(volume != null){
			cc.audioEngine.setVolume(this.effect_id2, volume / 6);
		}
		return this.effect_id2;
	},

	toggleSettingsLayer(){
		this.playEffect(this.button_normal_click, global.getEffectVolume());
		this.settings_layer.active = !this.settings_layer.active;
	},
	toggleExitLayer(){
		this.playEffect(this.button_normal_click, global.getEffectVolume());
		this.exit_layer.active = !this.exit_layer.active;
	},

	backToStartScene()
	{
		global.setSceneToLoad("StartScene");
		cc.director.loadScene("Loading");
	},
	openLevelConfirmation(level){
		this.playEffect(this.button_normal_click, global.getEffectVolume());
		cc.log("Level confirm", global.getSceneToLoad());

		this.level_confirmation_layer.active = true;
		this.level_label.getComponent(cc.Label).string = language[global.getLang()].level+" "+level;

		for(var i=0;i<3; i++){
			if(i < this.level_star[level - 1]){
				this.confirmation_star[i].getComponent(cc.Sprite).spriteFrame = this.level_star_sprite[1];
				cc.log("Enter");
			}else{
				this.confirmation_star[i].getComponent(cc.Sprite).spriteFrame = this.level_star_sprite[0];
				cc.log("else");
			}
		}
	},

	closeLevelConfirmation(){
		this.playEffect(this.button_normal_click, global.getEffectVolume());
		cc.log("close level");
		this.level_confirmation_layer.active = false;
	},

	confirmEnterScene(){
		this.playEffect(this.button_click, global.getEffectVolume());
		this.confirmPurchase();
		cc.director.loadScene("Loading");
		cc.audioEngine.stopMusic(this.musicBG);
	},

	onEffectValueChange(){
		cc.log(this.effect_slider.progress);
		global.setEffectVolume(this.effect_slider.progress);
	},

	onBgValueChange(){
		cc.log(this.music_slider.progress);
		global.setBgVolume(this.music_slider.progress);
		cc.audioEngine.setMusicVolume(this.music_slider.progress / 6);
	},

	selectLanguage(event, value){
		// cc.log(value);
		// cc.log(value2);
		for(var i=0; i<this.flag_node.length;i++){
			this.flag_node[i].getComponent(cc.Sprite).spriteFrame = this.language_off[i]
		}
		// this.flag_node[Number(value)].getComponent(cc.Sprite).spriteFrame = this.language_on[Number(value)];
		// if(Number(value) == 0){
		// 	global.setLang("en")
		// }else if(Number(value) == 1){
		// 	global.setLang("ch")
		// }else{
		// 	global.setLang("tw")
		// }

		this.changeLanguage();
	},
	
	purchase_1() // - 5 coin  + 5 bubble
	{
		// this.confirmation_purchase[0].getComponent(cc.Toggle).isChecked=!this.confirmation_purchase[0].getComponent(cc.Toggle).isChecked;
		cc.log(this.confirmation_purchase[0].getComponent(cc.Toggle).isChecked);
		if(this.confirmation_purchase[0].getComponent(cc.Toggle).isChecked)
		{
			this.purchaseCoinTotal = this.purchaseCoinTotal+5;
		}else
		{
			if(this.purchaseCoinTotal>=5)
			{
				this.purchaseCoinTotal = this.purchaseCoinTotal-5;
			}
			
		}
		cc.log(this.purchaseCoinTotal);
		// constant.setBubblesAmount(global.getSelectionLevel(),constant.getBubblesAmount(global.getSelectionLevel())+5);
		// this.purchaseBubble(global.getSelectionLevel(),constant.getBubblesAmount(global.getSelectionLevel())+5,5);
		// cc.log(constant.getBLevelJsonBubblesCount());
	},
	purchase_2()// - 10 coin  + 10 bubble
	{
		// this.confirmation_purchase[1].getComponent(cc.Toggle).isChecked=!this.confirmation_purchase[0].getComponent(cc.Toggle).isChecked;
		if(this.confirmation_purchase[1].getComponent(cc.Toggle).isChecked)
		{
			this.purchaseCoinTotal = this.purchaseCoinTotal+10;
		}else
		{
			if(this.purchaseCoinTotal>=10)
			{
				this.purchaseCoinTotal = this.purchaseCoinTotal-10;
			}
		}

		cc.log(this.purchaseCoinTotal);
		// this.purchaseBubble(global.getSelectionLevel(),constant.getBubblesAmount(global.getSelectionLevel())+10,10);
		// cc.log(constant.getBLevelJsonBubblesCount());
	},
	purchase_3()// - 20 coin   + 20 bubble
	{
		// this.confirmation_purchase[2].getComponent(cc.Toggle).isChecked=!this.confirmation_purchase[0].getComponent(cc.Toggle).isChecked;
		if(this.confirmation_purchase[2].getComponent(cc.Toggle).isChecked)
		{
			this.purchaseCoinTotal = this.purchaseCoinTotal+20;
		}else
		{
			if(this.purchaseCoinTotal>=20)
			{
				this.purchaseCoinTotal = this.purchaseCoinTotal-20;
			}
		}
		cc.log(this.purchaseCoinTotal);
		// this.purchaseBubble(global.getSelectionLevel(),constant.getBubblesAmount(global.getSelectionLevel())+20,20);
		// cc.log(constant.getBLevelJsonBubblesCount());
	},
	confirmPurchase()
	{
		this.purchaseBubble(global.getSelectionLevel(),constant.getBubblesAmount(global.getSelectionLevel())+this.purchaseCoinTotal,this.purchaseCoinTotal);

	},
	purchaseBubble(level,total,coinUsed)
	{
		cc.log("purchase bubble level = " + level +" total amount =  " + total);
		if(global.getCoin()>=coinUsed)
		{
			constant.setBubblesAmount(level,total);
			constant.setRecordBubble(level);
			global.setCoin(global.getCoin()-coinUsed);
			this.level_coin.getComponent(cc.Label).string =global.getCoin();
			cc.sys.localStorage.setItem('coin', global.getCoin());
		}
	},
	displayTutorialPage1()
	{
		this.playEffect(this.button_normal_click, global.getEffectVolume());
		this.tutorial.active = true;
		this.tutorial.page1.active = true;
		this.tutorial.page2.active = false;
	},
	displayTutorialPage2()
	{
		this.playEffect(this.button_normal_click, global.getEffectVolume());
		this.tutorial.active = true;
		this.tutorial.page1.active = false;
		this.tutorial.page2.active = true;
	},
	closeTutorial()
	{
		this.playEffect(this.button_normal_click, global.getEffectVolume());
		this.tutorial.active = false;
	},
	// update (dt) {},
});
