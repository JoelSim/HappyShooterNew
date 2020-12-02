var globalEditor=require('GlobalEditor');


cc.Class({
    extends: cc.Component,

    properties: {
        ballSpriteFrame:
        {
            default:[],
            type:[cc.SpriteFrame]
        },
        group:
        {
            default:[],
            type:[cc.Prefab]
        },
        containObject:
        {
            default:null,
            type:cc.Node
        },

    },

    onLoad: function () {
        this.isEven = true;
        this.lastPositonY = 0;
        this.rowData = [];
        let self = this;
        self.setInputControl();
        this.node.on("add-row",function(event)
        {
            // cc.log("add row");
            self.addRow();
        });
        this.node.on("change-item",function(event)
        {
            // cc.log(event.detail.name);
            event.detail.getComponent(cc.Sprite).spriteFrame = self.ballSpriteFrame[globalEditor.getItemType()];
            event.detail.getComponent("EditorItem").ballType = globalEditor.getItemType();
        });
        this.node.on("export",function(event)
        {
           
            var tempData = [];
            var rowChildData = [];
            for(var i =0;i<self.rowData.length;i++)
            {
                tempData[i]=[];
                for(var j=0;j<self.rowData[i].getComponent("RowItem").group_row.length;j++)
                {
                    if(self.rowData[i].getComponent("RowItem").group_row[j]!=null)
                    {
                        tempData[i].push(self.rowData[i].getComponent("RowItem").group_row[j].ballType);
                    }else
                    {
                        tempData[i].push(-1);
                    }
                }
                
            }
            var data = {
                data :tempData
            };
            cc.log(data);
            cc.log(JSON.stringify(data));
        });
    },


    addRow:function()
    {
        let self = this;
        // cc.log("self.lastPositonY = " +self.lastPositonY);
        if(this.isEven)
        {
            var row = cc.instantiate(self.group[0]);
            self.containObject.addChild(row);
            row.setPosition(cc.p(0, self.lastPositonY ));
            self.rowData.push(row);
            
        }else
        {
            var row = cc.instantiate(self.group[1]);
            self.containObject.addChild(row);
            row.setPosition(cc.p(45, self.lastPositonY ));
            self.rowData.push(row);
        }
        self.lastPositonY = self.lastPositonY-90;
        self.isEven =!self.isEven;
    },

    setInputControl: function ()
    {
        var self = this;

        cc.eventManager.addListener({

            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function(keyCode, event)
            {
                switch(keyCode)
                {
                   
                    case cc.KEY.q:
                        globalEditor.setItemType(6);
                    break;
                     case cc.KEY.w:
                        globalEditor.setItemType(3);
                    break;
                     case cc.KEY.e:
                        globalEditor.setItemType(0);
                    break;
                    case cc.KEY.r:
                        globalEditor.setItemType(2);
                    break;
                    case cc.KEY.t:
                        globalEditor.setItemType(5);
                    break;
                    case cc.KEY.y:
                        globalEditor.setItemType(1);
                    break;
                    case cc.KEY.u:
                        globalEditor.setItemType(4);
                    break;
         

                }
            }

        }, this.node);
    },
});
