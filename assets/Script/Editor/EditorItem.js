// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var globalEditor=require('GlobalEditor');

cc.Class({
    extends: cc.Component,

    properties: {
        ballType:
        {
            default:-1
        },
    },

    onLoad: function ()
    {
        let self = this;
        self.nodePositon = Math.abs(self.node.parent.y);
        function onTouchDown(event)
        {
            // cc.log("Click");
            var mySelectionItemEvent = new cc.Event.EventCustom("change-item",true);
                mySelectionItemEvent.setUserData(self.node);
                self.node.dispatchEvent( mySelectionItemEvent );
        }

        function onTouchMove(event)
        {
            
            
        }

        function onTouchUp(event)
        {
            
            
        }

        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchmove', onTouchMove, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    },
   
     

        
    
});
