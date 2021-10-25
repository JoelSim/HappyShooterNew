import * as global from "./menu/GlobalData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UpdateTicketIdSystem extends cc.Component {
    actualTicketId = null;
    actualDemoMode = null;
    label = null;

    onLoad(){
        this.label = this.getComponent(cc.Label);
    }
    update(){
        if(global.ticket_id == this.actualTicketId && global.isDemo == this.actualDemoMode) return;
        this.actualTicketId = global.ticket_id;
        this.actualDemoMode = global.isDemo;
        if(global.isDemo){
            this.label.string = "DEMO MODE";
        }
        else{
            if(this.actualTicketId == null){
                this.label.string = "";
            }else{
                this.label.string = global.ticket_id;
            }
        }
    }
}