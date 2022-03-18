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
		startScene:{
			default:null,
			type:cc.Node,
		},
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

		errorLayer:{
			default:null,
			type:cc.Node,
		},
		errorLabel:{
			default:null,
			type:cc.Label
		},

		backHome:{
			default:null,
			type:cc.Node,	
		},

		betSelectionNode:{
			default:null,
			type:cc.Node
		},
	},

	startGuestMode() {
		this.errorLayer.active=false;
		global.isDemo = true;
		this.startScene.getComponent("Start_Scene").setBalance();
	},
	// LIFE-CYCLE CALLBACKS:

	onLoad () {
		this.reconnect = null;

		if(URL.profile_pic == null || URL.profile_pic == ""){
			URL.profile_pic = "null";
		}

		if(URL.nickname == null || URL.nickname == ""){
			URL.nickname = URL.username;
		}
	},

	getSettings(){
		global.host_id = this.getParameterByName('host_id');
		global.access_token = this.getParameterByName('access_token');
		global.is_promotion = this.getParameterByName('is_promotion');
		global.h5_app = this.getH5App();

		let xhr = new XMLHttpRequest();
		var self = this;

		if(global.host_id==null && global.access_token==null){
			if(!global.isDemo){
				self.errorLayer.active = true;
				self.errorLabel.string=" You Are Playing For Fun.";
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4 &&(xhr.status >= 200 && xhr.status < 400)) {
						var response = xhr.responseText;
						var parsed = JSON.parse(response);
		
						global.settings = parsed.data;
						cc.log(global.settings);
						constant.setSocketURL(global.settings.socket_url);
						if(!global.getSocket()){
							self.getComponent("Socket").connectSocket();
						}
						self.getErrorMessage();
						self.betSelectionNode.getComponent("BetSelection").setOptionsAmount(global.settings);
					}
				};
			}
			else{
				self.scheduleOnce(function(){
					self.startScene.getComponent("Start_Scene").setBalance();
				},0.2);
			}
		

			var body = {
				"device_type": "Desktop",
				"game_code": 26,
				"country_code": "MY"
			}
	
			var json = JSON.stringify(body);
			var apiURL= global.api_url;
			if (global.api_url == undefined) {
				apiURL = "https://bo-stage.apollogames.co";
				if (global.isProduction) {
					apiURL = "https://bo.apollogames.co";
				}

				global.api_url=apiURL;
			}
			let url = apiURL+"/api/user/get-settings-demo";
			// let url = "https://bo-stage-apl.velachip.com/api/user/get-settings?host_id=0e83088027d4c42c8e9934388480c996&access_token=demo01&game_code=21";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Accept-Language", "en-US");
			xhr.send(json);
		}
		else{
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4 &&(xhr.status >= 200 && xhr.status < 400)) {
					var response = xhr.responseText;
					var parsed = JSON.parse(response);
	
					global.settings = parsed.data;
					cc.log(global.settings);
					// global.setSettings(parsed.data);
					constant.setSocketURL(global.settings.socket_url);
					if(!global.getSocket()){
						self.getComponent("Socket").connectSocket();
					}
					self.getErrorMessage();
					self.betSelectionNode.getComponent("BetSelection").setOptionsAmount(global.settings);

					if(global.settings==undefined){
						self.errorLayer.active = true;
						self.errorLabel.string = parsed.error.message;
						global.settings.lobby_url="www.google.com";
					}
					else{
						global.playerBalance = global.settings.balance;
						global.isPlayerBalanceUpdated = true;
						self.startScene.getComponent("Start_Scene").setBalance();
	
					}
				}
			};
	
			var body = {
				"host_id": this.getParameterByName('host_id'), 
				"access_token": this.getParameterByName('access_token'),
				"device_type": "Desktop",
				"game_code": 26,
				"country_code": "MY"
			}
	
			var json = JSON.stringify(body);
			var apiURL = global.api_url;
			if (global.api_url == undefined) {
				apiURL = "https://bo-stage.apollogames.co";
				if (global.isProduction) {
					apiURL = "https://bo.apollogames.co";
				}
				global.api_url=apiURL;
			}

			let url = apiURL + "/api/user/get-settings?host_id="+global.host_id+
			"&access_token="+global.access_token+
			"&game_code="+global.game_code+
			"&is_promotion=" + global.is_promotion + 
            "&h5_app=" + global.h5_app;

			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Accept-Language", "en-US");
			xhr.send(json);
		}
	},

	getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';

			return decodeURIComponent(results[2].replace(/\+/g, " "));
	},
	getH5App()
    {
        let h5_app = this.getParameterByName('h5_app', undefined);
        if(h5_app == null || h5_app == "")
        {
            return 99;
        }
        return h5_app;
    },
	getErrorMessage(){
        let url = global.settings.dynamic_assets_url + '/errorMessage.json'; 
        cc.loader.load(url, function(err, info){
            if(!err){
                global.commonErrorMessage = info;
                cc.log("getErrorMessage:", global.commonErrorMessage);
            }
        });
    },
});
