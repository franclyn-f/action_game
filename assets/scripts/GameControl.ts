import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    public quit() {
        cc.log("quit")
        cc.director.end()
    }
}


