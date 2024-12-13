import { _decorator, Component, Node, BoxCollider2D, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrickControl')
export class BrickControl extends Component {
    start() {
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
     * @param contact 碰撞主要的信息, 位置和法向量, 带有刚体的本地坐标来， 
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log('onBeginContact');
        this.getComponent(cc.Animation).play("brick_jump");
 
        // contact.getWorldManifold在 Builtin 物理模块这个参数为空
        // const worldManifold = contact.getWorldManifold();
        // // 碰撞点数组
        // const points = worldManifold.points;
        // // 碰撞点上的法向量
        // const normal = worldManifold.normal;
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('onEndContact');
    }

    update(deltaTime: number) {
        
    }
}

