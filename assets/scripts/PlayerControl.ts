import { _decorator, Component, Vec3, Node, AudioSource, KeyCode, UITransform, RigidBody2D, BoxCollider2D, Contact2DType, animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerControl')
export class PlayerControl extends Component {
    @property(cc.Integer)
    private jumpHeight: number = 0;
    // 主角跳跃持续时间
    @property(cc.Integer)
    private jumpDuration: number = 0;
    // 最大移动速度
    @property(cc.Integer)
    private maxMoveSpeed: number = 1000;
    // 加速度
    @property(cc.Integer)
    private accel: number = 0;
    @property(cc.Integer)
    public jumpHeight = 100;
    @property(cc.Integer)
    public jumpTime:number = 2;
    @property(cc.AudioSource)
    private audio: AudioSource;
    @property(cc.Integer)
    private blood: number = 3;

    private xSpeed: number = 0;
    private isJumping: boolean = false;
     // 跳跃步长
     private _jumpStep: number = 100;
    // 当前跳跃时间
    private _curJumpTime: number = 0;
    // 当前跳跃速度
    private _curJumpSpeed: number = 0;
    // 当前角色位置
    private _curPos: Vec3 = new Vec3();
    // 每次跳跃过程中，当前帧移动位置差
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    // 角色目标位置
    private _targetPos: Vec3 = new Vec3();
    private _tmpHeight = 0;
    public gameOver = false;
    private positionY: number;
    private anim: cc.Animation;
    private minX;
    private maxX;
    private mapNode: Node;
    private body: RigidBody2D;
    private animControl: animation.AnimationController;


    private addEventListeners() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    jumpByStep(step: number) {
        if (this.isJumping) {
            return;
        }
        this.isJumping=true
        this.animControl.setValue("isJumping", true)
        this.body.linearVelocity = cc.v2(this.body.linearVelocity.x, 32)
        this.playSound()
        // cc.log(this.animControl.getValue("isJumping"))
        // cc.log(this.animControl.getCurrentStateStatus(0))
        // cc.log(this.animControl.getCurrentClipStatuses(0))
        // cc.log(this.body.linearVelocity)
    }

    public decBlood() {
        if (this.blood > 0) {
            this.blood -= 1
        }
        let heartsNode = this.node.parent.getChildByPath("Camera/state/hearts")
        if (this.blood == 2) {
            heartsNode.getChildByName("heart2").active=false
        }
        if (this.blood == 1) {
            heartsNode.getChildByName("heart1").active=false
        }
        if (this.blood == 0) {
            heartsNode.getChildByName("heart0").active=false
        }
        cc.log("blood " + this.blood)
        // 向相反的方向弹跳一下
        let dir = this.xSpeed > 0 ? -1 : 1
        this.body.linearVelocity = cc.v2(dir * 13, 20)
    }

    jumpByStepOld(step: number) {
        if (this.isJumping) {
            return;
        }
        this.isJumping = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this.jumpHeight / this.jumpDuration / 2;
        this._tmpHeight = 0;
        this.playSound();
    }

    playSound() {
        this.audio.play()
    }

    private moveLeft() {
        this.accel -= 10;
        this.xSpeed = -100 + this.accel;
        if (this.xSpeed < -this.maxMoveSpeed) {
            this.xSpeed = -this.maxMoveSpeed;
        }
        this.animControl.setValue("speed", this.xSpeed);
        // cc.log(this.animControl.getValue("speed"))
        // cc.log(this.animControl.getValue("isJumping"))
        // cc.log(this.animControl.getCurrentStateStatus(0))
        // cc.log(this.animControl.getCurrentClipStatuses(0))
    }

    private moveRight() {
        this.accel += 10;
        this.xSpeed = 100 + this.accel;
        if (this.xSpeed > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed;
        }
        this.animControl.setValue("speed", this.xSpeed);
        // cc.log(this.animControl.getValue("isJumping"))
        // cc.log(this.animControl.getValue("speed"))
        // cc.log(this.animControl.getCurrentStateStatus(0))
        // cc.log(this.animControl.getCurrentClipStatuses(0))
    }

    private stopMove() {
        this.xSpeed = 0;
        this.accel = 0;
        this.animControl.setValue("speed", this.xSpeed);
    }




    private onKeyDown(event: cc.Event.EventKeyboard) {
        // cc.log("on key down");
        switch ((event as any).keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.moveLeft();
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.moveRight();
                break;
            case KeyCode.SPACE:
                this.jumpByStep(1);
                break;
        }
    }

    private onKeyUp(event: cc.Event.EventKeyboard) {
        // cc.log("on key up");
        switch ((event as any).keyCode) {
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.stopMove();
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.stopMove();
                break;
        }
    }

    // use this for initialization
    protected onLoad() {
        // 主角当前水平方向速度
        this.xSpeed = 0;
        // 初始化输入监听
        this.addEventListeners();
    }

    protected start() {
        this.positionY = this.node.position.y;
        this.body = this.getComponent(RigidBody2D)
        let collider = this.getComponent(BoxCollider2D);
        this.animControl = this.getComponent(animation.AnimationController)
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        // this.anim = this.node.getComponent(cc.Animation);
        // this.anim.getState("figure_idle_new").wrapMode = cc.AnimationClip.WrapMode.Loop;
        // this.anim.getState("figure_idle_new").repeatCount = Infinity
        // let animState = this.anim.play("figure_idle_new")
        this.audio = this.node.getComponent(AudioSource);
        this.mapNode = this.node.parent.getChildByName("game")
        this.minX = this.node.worldPosition.x;
        this.maxX = this.node.worldPosition.x + this.mapNode.getComponent(UITransform).contentSize.width - 5;
        cc.log("minX " + this.minX + " maxX " + this.maxX)
    }

    onBeginContact() {
        this.isJumping = false
        this.animControl.setValue("isJumping", false)
    }

    // called every frame
    protected update(dt: number) {
        if (this.blood <= 0) {
            cc.log("gameover")
            cc.director.loadScene("gameover")
        }
        // 掉入陷阱，游戏结束
        if (this.node.position.y < this.positionY - 20) {
            this.gameOver = true
            // this.node.parent.getChildByName("slide").active = true;
        }
        let dir = cc.v3(this.xSpeed * dt, 0, 0)
        this.node.position = this.node.position.add(dir)
        let x = this.node.worldPosition.x
        if (x < this.minX) {
            x = this.minX
        } else if (x > this.maxX) {
            x = this.maxX
        }
        this.node.setWorldPosition(x, this.node.worldPosition.y, this.node.worldPosition.z)

        // cc.log(this.animControl.getValue("isJumping"))
        // cc.log(this.animControl.getValue("speed"))
        // cc.log(this.animControl.getCurrentStateStatus(0))
        // cc.log(this.animControl.getCurrentClipStatuses(0))

        // if (this.isJumping) {
        //     cc.log(this.body.linearVelocity.y)
        //     if (this.body.linearVelocity.y == 0) {
        //         this.isJumping = false
        //     }
        // }
    }
}


