import { _decorator, Component, Node, TiledMap, RigidBody2D, BoxCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapControl')
export class MapControl extends Component {
    start() {
        cc.log("begin to load")
        let tiledMap = this.getComponent(TiledMap)
        cc.log(tiledMap)
        let tiledSize = tiledMap.getTileSize();
        let layer = tiledMap.getLayer("ground")
        cc.log(layer)
        let layerSize = layer.getLayerSize()
        cc.log("layer tiles " + layer.tiles)
        cc.log("width : " + layerSize.width + " height: " + layerSize.height)
        let cnt = 0;
        for (let i = 0; i < layerSize.width; ++i) {
            for (let j = 0; j < layerSize.height; ++j) {
                let tileGid = layer.getTileGIDAt(i, j)
                if (tileGid != null && tileGid != 0) {
                    // tiled.node.group = "wall"
                    cc.log("i " + i + " j " + j + " tileGid " + tileGid)
                    let tiled = layer.getTiledTileAt(i, j, true)
                    let body = tiled.node.addComponent(RigidBody2D);
                    body.type = 0
                    let collider = tiled.node.addComponent(BoxCollider2D)
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2)
                    collider.size = tiledSize
                    collider.apply()
                    ++cnt
                }
            }
        }
        cc.log("cnt = " + cnt)
    }

    update(deltaTime: number) {
        let tiledMap = this.getComponent(TiledMap)
        let tiledSize = tiledMap.getTileSize();
        let layer = tiledMap.getLayer("ground")
        let layerSize = layer.getLayerSize()
        let a = 1
    }

    onLoad() {
        
    }
}


