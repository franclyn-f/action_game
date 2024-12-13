import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuControl')
export class MenuControl extends Component {
    start() {
        // this.node.active=false
    }

    update(deltaTime: number) {
        
    }

    public disable() {
        cc.log("start " + this.node.name)
        this.node.active=false
        // this.node.setScale(this.node.scale.x, this.node.scale.y, 0)
        cc.log(this.node.active)
    }
}


