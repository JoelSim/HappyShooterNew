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

        progressBar:{
            default:null,
            type:cc.ProgressBar
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

        cc.loader.onProgress = (completedCount, totalCount, item) => {
            // cc.log("Progress");
            // cc.log(totalCount);
            // cc.log(completedCount);
            if (this.progressBar != null) {
                var percent = 0;
                if (totalCount > 0) {
                    percent = completedCount / totalCount;
                }
                this.progressBar.progress = percent;
            }else{
                cc.loader.onProgress = null;
            }
        };

        this.preloadScene(global.getSceneToLoad());
    },

    preloadScene: function (scene) {
        cc.director.preloadScene(scene, (err) => {
            if (err) {
                // error handling
                return;
            }
            // cc.loader.removeAllListeners();
            cc.director.loadScene(scene);
        });
    },

    // update (dt) {},
});
