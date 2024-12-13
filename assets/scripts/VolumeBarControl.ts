import { _decorator, Component, Node, ProgressBar } from 'cc';
import { VolumeControl } from './VolumeControl';
const { ccclass, property } = _decorator;

@ccclass('VolumeBarControl')
export class VolumeBarControl extends Component {
    private progressBar: ProgressBar;
    private volumeControl: VolumeControl;
    start() {
        this.progressBar=this.node.getComponent(ProgressBar)
        this.volumeControl=this.node.parent.parent.getChildByName("volume_node").getComponent(VolumeControl)
    }

    update(deltaTime: number) {
        let val = this.progressBar.progress
        this.volumeControl.adjustVolume(val, 1.0)
    }
}


