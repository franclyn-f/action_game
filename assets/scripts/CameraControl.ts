import { _decorator, Component, Node, Script, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraControl')
export class CameraControl extends Component {
    private cameraXMin: number;
    private cameraXMax: number;
    private startX;
    private startY;

    start() {
        this.startX = this.node.worldPosition.x;
        this.startY = this.node.worldPosition.y;
        let bg = this.node.parent.parent.getChildByName("bg");
        let x = bg.worldPosition.x - bg.getComponent(UITransform).width / 2;
        // this.cameraXMax = x + bg.getComponent(UITransform).width - cc.winSize.width / 2;
        this.cameraXMin = x + cc.winSize.width / 2;
        console.log("cameraMaxX " + this.cameraXMax + " minX: " + this.cameraXMin)
    }

    update(deltaTime: number) {
        if (this.node.parent.getComponent("PlayerControl").gameOver) {
            // cc.log("x" + this.node.worldPosition.x + " " + this.node.worldPosition.y)
            this.node.setWorldPosition(this.startX, this.startY, 1000);
            this.scheduleOnce(function(){
                cc.director.loadScene("level2");
           }, 1.5);
            return;
        }
        // console.log("current " + this.node.worldPosition.x)
        // if (this.node.worldPosition.x > this.cameraXMax) {
        //     this.node.setWorldPosition(this.cameraXMax, this.node.worldPosition.y, this.node.worldPosition.z);
        // }
        if (this.node.worldPosition.x < this.cameraXMin) {
            this.node.setWorldPosition(this.cameraXMin, this.node.worldPosition.y, this.node.worldPosition.z);
        }
    }
}


