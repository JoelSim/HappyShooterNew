var io;

// if (cc.sys.isNative) {
// 	io = SocketIO;
// }
// else {
// 	io = require('socket.io-client');
// }

var HyperDrive = HyperDrive || {};

(function (HyperDrive) {
	// include socket.io.js file before this js
	var _c;

	HyperDrive.Events = {
		onConnectDone: 'onConnectDone',
		onCreateRoomDone: 'onCreateRoomDone',
		onGetOnlineUsersCountDone: 'onGetOnlineUsersCountDone',
		onGetAllStaticRoomsDone: 'onGetAllStaticRoomsDone',
		onGetAllStaticRoomsInfoDone: 'onGetAllStaticRoomsInfoDone',
		onJoinRoomDone: 'onJoinRoomDone',
		onSubscribeRoomDone: 'onSubscribeRoomDone',
		onUnsubscribeRoomDone : 'onUnsubscribeRoomDone',
		onGetLiveRoomInfoDone : 'onGetLiveRoomInfoDone',
		onUserLeftRoom : 'onUserLeftRoom',
		onLeaveRoomDone : 'onLeaveRoomDone',
		onGetLiveUserInfoDone: 'onGetLiveUserInfoDone',
		onLockPropertiesDone : 'onLockPropertiesDone',
		onUserChangeRoomProperty : 'onUserChangeRoomProperty',
		onUnlockPropertiesDone : 'onUnlockPropertiesDone',
		onUserJoinedRoom : 'onUserJoinedRoom',
		onUpdatePropertyDone : 'onUpdatePropertyDone',
		onLeaveAndUnsubscribeRoomDone : 'onLeaveAndUnsubscribeRoomDone',
		onJoinAndSubscribeRoomDone : 'onJoinAndSubscribeRoomDone',
		onSendChatDone : 'onSendChatDone',
		onChatReceived : 'onChatReceived',
		onStartGameDone : 'onStartGameDone',
		onGameStarted : 'onGameStarted',
		onStopGameDone : 'onStopGameDone',
		onGameStopped : 'onGameStopped',
		onSendMoveDone : 'onSendMoveDone',
		onMoveCompleted : 'onMoveCompleted',
		onPauseGameDone : 'onPauseGameDone',
		onGamePaused : 'onGamePaused',
		onResumeGameDone : 'onResumeGameDone',
		onGamedResumed : 'onGamedResumed',
		onTurnBasedTimer : 'onTurnBasedTimer',
		onGetRoomByKeyDone: 'onGetRoomByKeyDone',
	}

	var Client = function (app_id) {
		var that = this;
		var _socket = null;
		// var socketURL = "http://192.168.100.45:8066";
		// var socketURL = "http://hyperdrive.casinoville.net";
		var room_id;
		this.app_id = app_id;

		var listeners = {
		};

		var notifyList = {
		};

		var response = function (event) {
			if (!listeners.hasOwnProperty(event) || typeof listeners[event] != 'function')
				return ;

			var args = Array.from(arguments);
			if (args.length > 1)
				args.shift();

			listeners[event].apply(that, args);
		}

		var notify = function (event) {
			if (!notifyList.hasOwnProperty(event) || typeof notifyList[event] != 'function')
				return ;

			var args = Array.from(arguments);
			if (args.length > 1)
				args.shift();

			notifyList[event].apply(that, args);
		}

		var _emit = function (event, data) {
			// process data
			_socket.emit(event, data);
		}

		var notifyListener = function(res){
			function isParsable(input) {
				try {
					JSON.parse(input);
				} catch (e) {
					return false;
				}
					return true;
			}

			if (isParsable(res) == true){
				res = JSON.parse(res);
			}

			cc.log("Notify");
			if(res.type == HyperDrive.Events.onUserLeftRoom){
				notify(HyperDrive.Events.onUserLeftRoom, res, res.username);
			} else if(res.type == HyperDrive.Events.onUserJoinedRoom){
				notify(HyperDrive.Events.onUserJoinedRoom, res, res.username);
			} else if(res.type == HyperDrive.Events.onChatReceived){
				notify(HyperDrive.Events.onChatReceived, res);
			} else if(res.type == HyperDrive.Events.onUserChangeRoomProperty){
				notify(HyperDrive.Events.onUserChangeRoomProperty, res.username,res.json.properties, res.json.lockProperties);
			} else if(res.type == HyperDrive.Events.onGameStarted){
				notify(HyperDrive.Events.onGameStarted, res);
			} else if(res.type == HyperDrive.Events.onGameStopped){
				notify(HyperDrive.Events.onGameStopped, res);
			} else if(res.type == HyperDrive.Events.onMoveCompleted){
				notify(HyperDrive.Events.onMoveCompleted, res);
			} else if(res.type == HyperDrive.Events.onGamePaused){
				notify(HyperDrive.Events.onGamePaused, res);
			} else if(res.type == HyperDrive.Events.onGamedResumed){
				notify(HyperDrive.Events.onGamedResumed, res);
			} else if(res.type == HyperDrive.Events.onTurnBasedTimer){
				notify(HyperDrive.Events.onTurnBasedTimer, res);
			}
		}

		var responseListener = function(res){
			function isParsable(input) {
				try {
					JSON.parse(input);
				} catch (e) {
					return false;
				}
					return true;
			}

			if (isParsable(res) == true){
				res = JSON.parse(res);
			}

			cc.log("Response");

			if(res.type == HyperDrive.Events.onConnectDone){
				response(HyperDrive.Events.onConnectDone,res);
			} else if(res.type == HyperDrive.Events.onCreateRoomDone){
				response(HyperDrive.Events.onCreateRoomDone, res);
			} else if(res.type == HyperDrive.Events.onJoinRoomDone){
				if(res.res == 0){
					room_id = res.json.id;
				}

				response(HyperDrive.Events.onJoinRoomDone, res);
			} else if(res.type == HyperDrive.Events.onSubscribeRoomDone){
				response(HyperDrive.Events.onSubscribeRoomDone, res);
			} else if(res.type == HyperDrive.Events.onUnsubscribeRoomDone){
				response(HyperDrive.Events.onUnsubscribeRoomDone, res);
			} else if(res.type == HyperDrive.Events.onGetLiveRoomInfoDone){
				response(HyperDrive.Events.onGetLiveRoomInfoDone, res);
			} else if(res.type == HyperDrive.Events.onLeaveRoomDone){
				if(res.res == 0){
					room_id = null;
				}

				response(HyperDrive.Events.onLeaveRoomDone, res);
			} else if(res.type == HyperDrive.Events.onGetLiveUserInfoDone){
				response(HyperDrive.Events.onGetLiveUserInfoDone, res);
			} else if(res.type == HyperDrive.Events.onLockPropertiesDone){
				response(HyperDrive.Events.onLockPropertiesDone, res);
			} else if(res.type == HyperDrive.Events.onUnlockPropertiesDone){
				response(HyperDrive.Events.onUnlockPropertiesDone, res);
			} else if(res.type == HyperDrive.Events.onUpdatePropertyDone){
				response(HyperDrive.Events.onUpdatePropertyDone, res);
			} else if(res.type == HyperDrive.Events.onLeaveAndUnsubscribeRoomDone){
				response(HyperDrive.Events.onLeaveAndUnsubscribeRoomDone, res);
			} else if(res.type == HyperDrive.Events.onJoinAndSubscribeRoomDone){
				response(HyperDrive.Events.onJoinAndSubscribeRoomDone, res);
			} else if(res.type == HyperDrive.Events.onSendChatDone){
				response(HyperDrive.Events.onSendChatDone, res);
			} else if (res.type == HyperDrive.Events.onGetOnlineUsersCountDone){
				response(HyperDrive.Events.onGetOnlineUsersCountDone, res.res, res.count);
			}else if (res.type == HyperDrive.Events.onGetAllStaticRoomsDone){
				response(HyperDrive.Events.onGetAllStaticRoomsDone, res);
			}else if (res.type == HyperDrive.Events.onGetAllStaticRoomsInfoDone){
				response(HyperDrive.Events.onGetAllStaticRoomsInfoDone, res);
			}else if (res.type == HyperDrive.Events.onStartGameDone){
				response(HyperDrive.Events.onStartGameDone, res);
			}else if (res.type == HyperDrive.Events.onStopGameDone){
				response(HyperDrive.Events.onStopGameDone, res);
			}else if (res.type == HyperDrive.Events.onSendMoveDone){
				response(HyperDrive.Events.onSendMoveDone, res);
			}else if (res.type == HyperDrive.Events.onPauseGameDone){
				response(HyperDrive.Events.onPauseGameDone, res);
			}else if (res.type == HyperDrive.Events.onResumeGameDone){
				response(HyperDrive.Events.onResumeGameDone, res);
			}else if(res.type == HyperDrive.Events.onGetRoomByKeyDone){
				response(HyperDrive.Events.onGetRoomByKeyDone, res);
			}
		}

		var startConnect = function(){
			_emit("request", {type:"connect" , params:{ "username": that.username, "game_type": that.app_id}});

			_socket.on("response", responseListener);
			_socket.on("notify", notifyListener);
		}

		this.connect = function (username, url) {
			// TODO: connect socket.io
			//Connect socket.io with the given username and app_id
			cc.log("====================================");
			cc.log("connect");
			cc.log("====================================");

			that.username = username;
			_socket = io.connect(url);

	        _socket.on("connect", startConnect);
			//Listen to socket.io response
		}

		this.disconnect = function (){
			cc.log("Disconnect");
			_socket.disconnect();
		}

		//TO create room with default properties
		// tableProperties in key, value format.
		this.createRoom = function (name, owner, maxUsers, tableProperties) {
			_emit("request", {type:"createRoom", params:{
				"room_name" : name,
				"max_users" : maxUsers,
				"owner"     : owner,
				"properties": tableProperties,
				"game_type" : that.app_id,
			}});
		}

		this.joinRoom = function (roomid) {
			_emit("request", {type:"joinRoom", params:{
				"username"  : that.username,
				"room_id"   : roomid,
				"game_type" : that.app_id,
			}});
		}

		this.getOnlineUsersCount = function () {
			_emit("request",{type:"getOnlineUsersCount", params:{
				game_type :  that.app_id,
			}})
			// response(HyperDrive.Events.onGetOnlineUsersCountDone, res, count);
		}

		this.getAllStaticRooms = function () {
			_emit("request",{type:"getAllStaticRooms", params:{
				game_type :  that.app_id,
			}})
			// response(HyperDrive.Events.onGetOnlineUsersCountDone, res, count);
		}

		this.getAllStaticRoomsInfo = function () {
			_emit("request",{type:"getAllStaticRoomsInfo", params:{
				game_type :  that.app_id,
			}})
			// response(HyperDrive.Events.onGetOnlineUsersCountDone, res, count);
		}

		this.setResponseListener = function (event, callback) {
			if (!HyperDrive.Events.hasOwnProperty(event))
				return ;
			listeners[event] = callback;
		}

		this.setResponseListener = function (event, callback) {
			if (!HyperDrive.Events.hasOwnProperty(event))
				return ;
			listeners[event] = callback;
		}

		this.setNotifyListener = function(event, callback){
			if(!HyperDrive.Events.hasOwnProperty(event))
				return;
			notifyList[event] = callback;
		}

		this.subscribeRoom = function(roomid){
			_emit("request", {type:"subscribeRoom", params:{
				"room_id"   : roomid,
				"game_type" : that.app_id,
			}});
		}

		this.unsubscribeRoom = function(roomid){
			_emit("request", {type:"unsubscribeRoom", params:{
				"room_id"   : roomid,
				"game_type" : that.app_id,
			}});
		}

		this.getLiveRoomInfo = function(roomid){
			_emit("request", {type:"getLiveRoomInfo", params:{
				"room_id"   : roomid,
				"game_type" : that.app_id,
			}});
		}

		this.leaveRoom = function(roomid){
			_emit("request", {type:"leaveRoom", params:{
				"username"  : that.username,
				"room_id"   : roomid,
				"game_type" : that.app_id,
			}});
		}

		this.getLiveUserInfo = function(username){
			_emit("request", {type:"getLiveUserInfo", params:{
				"username"  : username,
				"game_type" : that.app_id,
			}});
		}

		this.deleteRoom = function(roomid){
			_emit("request", {type:"getLiveUserInfo", params:{
				"room_id"  : roomid,
				"game_type" : that.app_id,
			}});
		}

		this.lockProperties = function(properties){
			cc.log(room_id);
			_emit("request", {type:"lockProperties", params:{
				"username"  : that.username,
				"room_id"   : room_id,
				"key"       : properties,
				"game_type" : that.app_id,
			}});
		}

		this.unlockProperties = function(properties){
			_emit("request", {type:"unlockProperties", params:{
				"username"  : that.username,
				"room_id"   : room_id,
				"key"       : properties,
				"game_type" : that.app_id,
			}});
		}

		this.joinRoomWithProperties = function(tableProperties){
			_emit("request", {type:"joinRoomWithProperties", params:{
				"username"  : that.username,
				"properties": tableProperties,
				"game_type" : that.app_id,
			}});
		}

		this.joinRoomWithPropertiesAndSequence = function(tableProperties, sequence){
			_emit("request", {type:"joinRoomWithProperties", params:{
				"username"  : that.username,
				"properties": tableProperties,
				"game_type" : that.app_id,
				"sequence"  : sequence,
			}});
		}

		this.updateRoomProperties = function(roomid, tableProperties, removeArray){
			cc.log(removeArray);
			if(removeArray === undefined){
				removeArray = null;
			}
			_emit("request", {type:"updateRoomProperties", params:{
				"username"   : that.username,
				"room_id"    : roomid,
				"properties" : tableProperties,
				"removeArray": removeArray,
				"game_type"  : that.app_id,
			}});
		}

		this.leaveAndUnsubscribeRoom = function(roomid){
			_emit("request", {type:"leaveAndUnsubscribeRoom", params:{
				"username"   : that.username,
				"room_id"    : roomid,
				"game_type"  : that.app_id,
			}});
		}

		this.joinAndSubscribeRoom = function(roomid){
			_emit("request", {type:"joinAndSubscribeRoom", params:{
				"username"   : that.username,
				"room_id"    : roomid,
				"game_type"  : that.app_id,
			}});
		}

		this.sendChat = function(message){
			_emit("request", {type:"sendChat", params:{
				"username"   : that.username,
				"room_id"    : room_id,
				"message"    : message,
				"game_type"  : that.app_id,
			}});
		}

		this.sendChat = function(message, roomid){
			_emit("request", {type:"sendChat", params:{
				"username"   : that.username,
				"room_id"    : roomid,
				"message"    : message,
				"game_type"  : that.app_id,
			}});
		}

		this.startGame = function(roomid, targetUsername){
			_emit("request", {type:"startGame", params:{
				"username"   		: that.username,
				"target_username"	: targetUsername,
				"room_id"			: roomid,
				"game_type"			: that.app_id,
			}});
		}

		this.stopGame = function(roomid){
			_emit("request", {type:"stopGame", params:{
				"username"   		: that.username,
				"room_id"			: roomid,
				"game_type"			: that.app_id,
			}});
		}

		this.sendMove = function(roomid, targetUsername, moveData){
			_emit("request", {type:"sendMove", params:{
				"username"   		: that.username,
				"target_username"	: targetUsername,
				"room_id"			: roomid,
				"move_data"			: moveData,
				"game_type"			: that.app_id,
			}});
		}

		this.pauseGame = function(roomid, timeout){
			_emit("request", {type:"pauseGame", params:{
				"username"   		: that.username,
				"timeout"			: timeout,
				"room_id"			: roomid,
				"game_type"			: that.app_id,
			}});
		}

		this.resumeGame = function(roomid){
			_emit("request", {type:"resumeGame", params:{
				"username"   		: that.username,
				"room_id"			: roomid,
				"game_type"			: that.app_id,
			}});
		}

		this.getRoomByKey = function(key){
			_emit("request", {type:"getRoomByKey", params:{
				"key"   		: key,
			}});
		}
	}

	HyperDrive.initialize = function (app_id) {
		_c = new Client(app_id);

		// initialize..

		return _c;
	}

	HyperDrive.getInstance = function () {
		return _c;
	}

	return HyperDrive;
})(HyperDrive);

window.HyperDrive = HyperDrive;