import { _decorator, Component, Vec3, Node, AudioSource, KeyCode, UITransform, RigidBody2D } from 'cc';
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
    private maxMoveSpeed: number = 700;
    // 加速度
    @property(cc.Integer)
    private accel: number = 0;
    @property(cc.Integer)
    public jumpHeight = 100;
    @property(cc.Integer)
    public jumpTime:number = 2;
    @property(cc.AudioSource)
    private audio: AudioSource;

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


    private addEventListeners() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    jumpByStep(step: number) {
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
    }

    private moveRight() {
        this.accel += 10;
        this.xSpeed = 100 + this.accel;
        if (this.xSpeed > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed;
        }
    }

    private stopMove() {
        this.xSpeed = 0;
        this.accel = 0;
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
        this.anim = this.node.getComponent(cc.Animation);
        this.anim.getState("figure_idle").wrapMode = cc.AnimationClip.WrapMode.Loop;
        this.anim.getState("figure_idle").repeatCount = Infinity
        let animState = this.anim.play("figure_idle")
        this.audio = this.node.getComponent(AudioSource);

        // this.getComponent(RigidBody2D).gravityScale = 0  
    }

    // called every frame
    protected update(dt: number) {
        // if (this.gameOver) {
        //     this.getComponent(RigidBody2D).gravityScale = 0
        //     return;
        // }
        // 掉入陷阱，游戏结束
        if (this.node.position.y < this.positionY - 20) {
            this.gameOver = true;
            // this.node.parent.getChildByName("slide").active = true;
        }
        let dir = cc.v3(this.xSpeed * dt, 0, 0)
        let curX = this.node.worldPosition.x
        // 限制在摄像机的范围内
        let cameraNode = this.node.getChildByName("Camera")
        let cameraX = cameraNode.worldPosition.x
        let minX = 0
        let maxX = 0
        minX = cameraX - cc.winSize.width / 2 + (this.node.getComponent(UITransform).width * this.node.scale.x) / 2 + 5
        maxX = cameraX + cc.winSize.width / 2 - (this.node.getComponent(UITransform).width * this.node.scale.x) / 2 - 5
        if (curX < minX - 0.5) {
            this.node.setWorldPosition(minX, this.node.worldPosition.y, this.node.worldPosition.z)
            cameraNode.setWorldPosition(cameraNode.worldPosition.x - (minX - curX) - 1, cameraNode.worldPosition.y, cameraNode.worldPosition.z)
            console.log("curx " + curX + " minX " + minX + " maxX " + maxX)
            this.stopMove()
        } else if (curX > maxX + 0.5) {
            this.node.setWorldPosition(maxX, this.node.worldPosition.y, this.node.worldPosition.z)
            cameraNode.setWorldPosition(cameraNode.worldPosition.x + (curX - maxX) + 1, cameraNode.worldPosition.y, cameraNode.worldPosition.z)
            this.stopMove();
            console.log("curx " + curX + " minX " + minX + " maxX " + maxX)
        } else {
            this.node.position = this.node.position.add(dir);
        }

        // 跳跃
        if (this.isJumping) {
            this._curJumpTime += dt;
            if (this._curJumpTime > this.jumpDuration) {
                this.isJumping = false;
            } else {
                let dirY;

                if (this._curJumpTime >= this.jumpDuration / 2) {
                    let tmpY = this._curJumpSpeed * dt;
                    if (tmpY > this._tmpHeight) {
                        tmpY = this._tmpHeight;
                    }
                    this._tmpHeight -= tmpY;
                    dirY = cc.v3(0, -tmpY, 0);
                } else {
                    let tmpY = this._curJumpSpeed * dt;
                    if (this._tmpHeight + tmpY > this.jumpHeight) {
                        tmpY = this.jumpHeight - this._tmpHeight;
                    }
                    this._tmpHeight += tmpY;
                    dirY = cc.v3(0, tmpY, 0);
                }
                this.node.position = this.node.position.add(dirY);
            }
        }
    }
}


