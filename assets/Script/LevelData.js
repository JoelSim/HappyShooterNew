// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       level:
       {
            default:1,
       }
    },

    onLoad ()
    {
        // 1 = green , 2 = red = , 3 = orange , 4 = blue , 0= null
        var level = {
            "level":[
                [1,1,1,1,1,1,1,1,1,1,1,1,1],
                [0,2,2,2,2,3,3,3,3,4,4,4,4],
                [0,2,2,2,3,3,3,3,4,4,4,4,0],
                [0,0,2,2,2,3,3,3,3,4,4,4,0],
                [0,0,2,2,2,3,3,3,4,4,4,0,0],
                [0,0,2,2,2,3,3,3,4,4,0,0,0],
                [0,0,0,2,2,2,3,3,4,4,0,0,0],
                [0,0,0,2,2,3,3,4,4,0,0,0,0],
                [0,0,0,0,3,3,3,3,3,0,0,0,0],
                [0,0,0,0,0,3,3,3,3,0,0,0,0],
                [0,0,0,0,0,0,3,3,3,0,0,0,0],
                [0,0,0,0,0,0,3,3,0,0,0,0,0],
                [0,0,0,0,0,0,0,3,0,0,0,0,0]
            ]
        };

        cc.log(level);
    },

});
