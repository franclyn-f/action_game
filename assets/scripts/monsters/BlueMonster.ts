import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { Monster } from './Monster';
import { PlayerControl } from '../PlayerControl';
const { ccclass, property } = _decorator;

@ccclass('BlueMonster')
export class BlueMonster extends Monster {
    @property(cc.Integer)
    private limit: number = 100;
    @property(cc.Integer)
    private speed: number = 100;

    protected onLoad(): void {
        let collider = this.getComponent(BoxCollider2D);
        if (collider) {
            // Builtin 2D 物理模块只会发送 BEGIN_CONTACT 和 END_CONTACT 回调消息。
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

     /**
         * 只在两个碰撞体开始接触时被调用一次
         * @param selfCollider 指的是回调脚本的节点上的碰撞体
         * @param otherCollider 指的是发生碰撞的另一个碰撞体
         * @param contact 碰撞主要的信息, 位置和法向量, 带有刚体的本地坐标来
         */
        onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
            cc.log('onBeginContact monster: ' + otherCollider.node.name);
            if (otherCollider.node.name == "figure") {
                let node = otherCollider.node
                let player = node.getComponent(PlayerControl)
                player.decBlood()
            }
        }
        onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
            // 只在两个碰撞体结束接触时被调用一次
            cc.log('onEndContact');
        }

    start() {
        this.xMin = this.node.worldPosition.x - this.limit
        this.xMax = this.node.worldPosition.x + this.limit
        this.xSpeed = this.speed
    }

    update(deltaTime: number) {
        super.update(deltaTime)
    }


}


