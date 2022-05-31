var username = "GUEST"+Math.round(Math.random()*1000000);
export var balance = 10000;
export var isDemo= false;
export var isProduction = false;
var sound = 1;
var isLogin = false;
var gameVersion = "1.00";
var highest_score = 0
var lang = "en";
var apiURL= "http://tca-test.togacapital.com";
export var host_id = 0;
export var access_token =0;
export var h5_app = null;
export var is_promotion = null;
// var apiURL= "http://api.tclub.biz";
var loginURL = "/member/findMember?";
var scoreURL = "/member/saveScore?";
var highScoreURL = "/member/getScore?";
var leaderboardURL = "/member/getLeaderboard?";
var prizeHistory = "/member/getRewardHistory?";
var allScoreURL = "/member/getAllScore?";
var randomFriend = [];
var game_key = "Panda-Shooter";
var todayHighScore = 0;
export var finishGetData=false;
export var finishGetBalance =false;
//#region Settings from API
export var settings = {
    balance : 9999999999999999,
    currency : "MYR",
    exit_btn : 0,
    game_on : 0,
    game_type : "dsg-007",
    guest_mode : 0,
    hyperdrive: "",
    is_demo: 0,
    is_jackpot: 0,
    isroundednumber: 0,
    jackpot: 0,
    lobby_url: "",
    socket_url: "https://socket-apollo.velachip.com",
    status: "",
    user_id: "",
    username: ""
}

export var game_code = 26;

export var ticket_id = null;
export var errorMessage = "";
export var isEncrypt = true;
export var isKicked = false;
export var kickMessage = "";
export var commonErrorMessage =  null;
var socket = null;
export function getSocket(){
    return socket;
}

export function setSocket(value){
    cc.log("Setting socket");
    socket = value;
    return (socket);
}

export var maxWin = -1;
export var maxMultiplier = 100;
export var jackpot = -1;
export var previousBet = 0;
export var previousWin = 0;
//#endregion

var playerReward = [];

var session_id = 0;
var levelSelected = 1;
var sceneToLoad = "StartScene";

var selectionLevel = 1;

var currentMaxLevel = 5;
var currentPlayerLevel = 5;

var level_star = [];
var effect_volume = 1.0;
var bg_volume = 1.0;

var coin = 100;

export var configBetRange = [2,4,6,8];
export var configBetAmount = [2,4,6,8,10];

var betSelection =0;

export function getBetSelection(){
    return betSelection;
}

export function setBetSelection(value){
    betSelection = value;
    return (betSelection);
}

export function getAllScoreURL(){
    return allScoreURL;
}

export function setAllScoreURL(value){
    allScoreURL = value;
    return (allScoreURL);
}

export function getCoin(){
    return coin;
}

export function setCoin(value){
    coin = value;
    return (coin);
}

export function setEffectVolume(value){
    effect_volume = value;
    return (effect_volume);
}

export function getEffectVolume(){
    return effect_volume;
}

export function setBgVolume(value){
    bg_volume = value;
    return (bg_volume);
}

export function getBgVolume(){
    return bg_volume;
}

export function setLevelStar(value){
    level_star  = value ;
    return (level_star);
}

export function getLevelStar(){
    return level_star;
}

export function setCurrentPlayerLevel(value){
    currentPlayerLevel = value;
    return (currentPlayerLevel);
}

export function getCurrentPlayerLevel(){
    return currentPlayerLevel;
}

export function setCurrentMaxLevel(value){
    currentMaxLevel = value;
    return (currentMaxLevel);
}

export function getCurrentMaxLevel(){
    return currentMaxLevel;
}

export function setSceneToLoad(value){
    sceneToLoad = value
    return(sceneToLoad);
}

export function getSceneToLoad(){
    return sceneToLoad;
}

export function getLevelSelected(){
    return levelSelected;
}

export function setLevelSelected(value){
    levelSelected = value;
    return (levelSelected);
}

export function getTodayHighScore(){
    return todayHighScore;
}

export function setTodayHighScore(value){
    todayHighScore = value;
    return todayHighScore;
}

export function getPrizeHistory(){
    return prizeHistory;
}

export function setPrizeHistory(value){
    prizeHistory = value;
    return (prizeHistory)
}

export function getGameKey(){
    return game_key;
}

export function getSessionID(){
    return session_id;
}

export function setSessionID(value){
    session_id = value;
    return (session_id);
}

export function getPlayerReward(){
    return playerReward;
}

export function setPlayerReward(value){
    playerReward = value;
    return (playerReward);
}

export function getRandomFriend(){
    return randomFriend;
}

export function setRandomFriend(value){
    randomFriend = value;
    return (randomFriend)
}

export function setAPIURL(value){
    apiURL = value
    return (apiURL);
}

export function getHighScoreURL(){
    return highScoreURL;
}

export function getLeaderboardURL(){
    return leaderboardURL;
}

export function getGameVersion(){
    return gameVersion;
}

export function getIsLogin(){
    return isLogin;
}

export function setIsLogin(value){
    isLogin = value;
    return (isLogin);
}

export function getAPIURL(){
    return apiURL;
}

export function getLoginURL(){
    return loginURL;
}

export function getScoreURL(){
    return scoreURL;
}

export function getHighestScore(){
    return highest_score;
}

export function setHighestScore(value){
    highest_score = value;
    return (highest_score);
}

export function getSound(){
    return sound;
}

export function setSound(value){
    sound = value;
    return (sound);
}

export function getUsername(){
    return username;
}

export function setUsername(value){
    username = value;
    return (username);
}

// export function getBalance(){
//     return balance;
// }

// export function setBalance(value){
//     balance = value;
//     return (balance);
// }

export function getLang(){
    return lang;
}

export function setSelectionLevel(value)
{
    selectionLevel = value;
    return selectionLevel;
}

export function getSelectionLevel()
{
    return selectionLevel;
}

export function setLang(value){
    if (value != null){
        if (value == "en" || value =="ch" || value == "tw" || value == "my"){
            lang = value;
        }
    }

    return (lang);
}

export function formatTime(time){
    var minutes = Math.floor(time/60);
    var seconds = time - (minutes * 60);

    function str_pad_left(string,pad,length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    }

    var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);

    return finalTime;
}

export var api_url;
export var geoIp_url;


export var happyShooter = {
    totalWeight: [
        7 + 2 + 2 + 3, //0
        4 + 7 + 2 + 5, //1
        1 + 3 + 5 + 2, //2
        1 + 4 + 4 + 6,  //3
        1 + 4 + 5 + 10, //4
        1 + 2 + 5 + 11, //5
        1 + 2 + 5 + 15, //6
        1 + 1 + 3 + 14  //7
    ],
    bigWeightage: [
        [7, 7 + 2, 7 + 2 + 2, 7 + 2 + 2 + 3], //0
        [4, 4 + 7, 4 + 7 + 2, 4 + 7 + 2 + 5], //1
        [1, 1 + 3, 1 + 3 + 5, 1 + 3 + 5 + 2], //2
        [1, 1 + 4, 1 + 4 + 4, 1 + 4 + 4 + 6],  //3
        [1, 1 + 4, 1 + 4 + 5, 1 + 4 + 5 + 10], //4
        [1, 1 + 2, 1 + 2 + 5, 1 + 2 + 5 + 11], //5
        [1, 1 + 2, 1 + 2 + 5, 1 + 2 + 5 + 15], //6
        [1, 1 + 1, 1 + 1 + 3, 1 + 1 + 3 + 14]  //7
    ]
}