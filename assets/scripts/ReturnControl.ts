import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReturnControl')
export class ReturnControl extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    public return() {
        this.node.active=false
    }

    public enter() {
        this.node.active=true
    }
}


