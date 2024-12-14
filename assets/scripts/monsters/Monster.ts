import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {
    protected xSpeed: number;
    protected xMin: number;
    protected xMax: number;
    private dir = 1;

    start() {

    }

    update(deltaTime: number) {
        let position = this.node.worldPosition
        let dx = this.xSpeed * deltaTime
        let x = position.x + dx * this.dir
        if (x > this.xMax) {
            this.dir *= -1
            x = position.x + dx * this.dir
        } else if (x < this.xMin) {
            this.dir *= -1
            x = position.x + dx * this.dir
        }
        this.node.setWorldPosition(x, position.y, position.z)
    }
}


