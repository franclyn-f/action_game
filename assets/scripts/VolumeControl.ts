import { _decorator, Component, Node, AudioSource} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VolumeControl')
export class VolumeControl extends Component {
    private audio: AudioSource;
    start() {
        this.audio = this.node.parent.getChildByName("game").getComponent(AudioSource)
    }

    update(deltaTime: number) {
        
    }

    public closeVoice() {
        cc.log("close voice")
        this.audio.enabled=false
    }

    public openVoice() {
        cc.log("open voice")
        this.audio.enabled=true
    }

    public adjustVolume(value, limit) {
        cc.log("adjust volume " + value + " " + limit)
        this.audio.volume=value * 1.0 / limit
    }

    public adjustVolumeEvent(event: Event, value) {
        this.adjustVolume(value, 5)
    }
}


