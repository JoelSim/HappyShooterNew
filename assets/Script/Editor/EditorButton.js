var globalEditor = require('GlobalEditor');


cc.Class({
    extends: cc.Component,

    properties: {
        eventType:
        {
            default:"0"
        },
        isEvent:
        {
            default:false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function ()
    {
        let self = this;
        self.nodePositon = Math.abs(self.node.parent.y);
        function onTouchDown(event)
        {
            // cc.log("Click");
            if(self.isEvent)
            {
                // cc.log("isAddRow " );
                var mySelectionEvent = new cc.Event.EventCustom(self.eventType,true);
                self.node.dispatchEvent( mySelectionEvent );
            }else
            {
                // cc.log("ballType = " +self.ballType);
                globalEditor.setItemType(parseInt(self.eventType));
                // cc.log(globalEditor.getItemType());
            }
            
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

    // update (dt) {},
});
