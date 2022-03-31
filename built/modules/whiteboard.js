"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
class WhiteBoard {
    constructor(context) {
        this.context = context;
        this.expectedResultDescription = "Draw on the surface to place red ink";
        this.drawObjects = [];
        this.assets = new MRE.AssetContainer(context);
    }
    cleanup() {
        this.assets.unload();
    }
    async started() {
        const root = MRE.Actor.Create(this.context, {});
        this.assets = new MRE.AssetContainer(this.context);
        this.drawMesh = this.assets.createSphereMesh('drawPoint', .01);
        this.hoverMaterial = this.assets.createMaterial('hoverMaterial', {
            color: MRE.Color3.White()
        });
        this.drawMaterial = this.assets.createMaterial('drawMaterial', {
            color: MRE.Color3.Black()
        });
        this.createDrawSurface(root);
        this.createEraseButton();
        // Create scene light
        MRE.Actor.Create(this.context, {
            actor: {
                name: "Light",
                parentId: root.id,
                light: {
                    type: 'point',
                    range: 5,
                    intensity: 2,
                    color: { r: 1, g: 0.5, b: 0.3 }
                },
                transform: {
                    local: {
                        position: { x: -2, y: 2, z: -2 }
                    }
                }
            }
        });
        return true;
    }
    spawnTargetObjects(targetingState, drawPoints) {
        const materialId = (targetingState === 'hover') ? this.hoverMaterial.id : this.drawMaterial.id;
        const drawActors = drawPoints.map(drawPoint => {
            return MRE.Actor.Create(this.context, {
                actor: {
                    name: targetingState === 'hover' ? 'hoverBall' : 'drawBall',
                    parentId: this.drawSurface.id,
                    transform: { local: { position: drawPoint } },
                    appearance: {
                        materialId: materialId,
                        meshId: this.drawMesh.id
                    }
                }
            });
        });
        if (targetingState === 'hover') {
            setTimeout(() => drawActors.forEach(actor => actor.destroy()), 1500);
        }
        else {
            this.drawObjects = this.drawObjects.concat(drawActors);
        }
    }
    eraseDrawObjects() {
        this.drawObjects.forEach(actor => actor.destroy());
        this.drawObjects = [];
    }
    createDrawSurface(root) {
        const surfaceMesh = this.assets.createBoxMesh('drawSurface', 2, 1, .01);
        // Create draw surface
        this.drawSurface = MRE.Actor.Create(this.context, {
            actor: {
                name: 'drawSurface',
                parentId: root.id,
                transform: { local: { position: { y: 1.2 } } },
                appearance: {
                    meshId: surfaceMesh.id,
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        // Create label for draw surface.
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'label',
                parentId: this.drawSurface.id,
                transform: { local: { position: { y: 0.1 } } },
                text: {
                    contents: 'Use surface to hove and draw over',
                    height: 0.1,
                    anchor: MRE.TextAnchorLocation.BottomCenter,
                    color: MRE.Color3.Teal()
                }
            }
        });
        this.surfaceBehavior = this.drawSurface.setBehavior(MRE.ButtonBehavior);
        // Hover handlers
        this.surfaceBehavior.onHover('enter', (_, data) => {
            this.spawnTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onHover('hovering', (_, data) => {
            this.spawnTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onHover('exit', (_, data) => {
            this.spawnTargetObjects('hover', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        // Button handlers
        this.surfaceBehavior.onButton('pressed', (_, data) => {
            this.spawnTargetObjects('draw', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onButton('holding', (_, data) => {
            this.spawnTargetObjects('draw', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
        this.surfaceBehavior.onButton('released', (_, data) => {
            this.spawnTargetObjects('draw', data.targetedPoints.map(pointData => pointData.localSpacePoint));
        });
    }
    createEraseButton() {
        // Create erase button for the surface
        const buttonMesh = this.assets.createBoxMesh('eraseButton', .2, .2, .01);
        this.eraseButton = MRE.Actor.Create(this.context, {
            actor: {
                name: 'eraseButton',
                parentId: this.drawSurface.id,
                transform: { local: { position: { y: -.7 } } },
                appearance: {
                    meshId: buttonMesh.id,
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        // MRE.Actor.Create(this.context, {
        //   actor: {
        //     name: 'eraseButtonLabel',
        //     parentId: this.eraseButton.id,
        //     transform: { local: { position: { y: -.3 } } },
        //     text: {
        //       contents: "Click Button to Erase Surface",
        //       height: .1,
        //       anchor: MRE.TextAnchorLocation.BottomCenter,
        //       color: MRE.Color3.Teal()
        //     }
        //   }
        // })
        const eraseButtonBehavior = this.eraseButton.setBehavior(MRE.ButtonBehavior);
        eraseButtonBehavior.onClick((_, __) => this.eraseDrawObjects());
    }
}
exports.default = WhiteBoard;
//# sourceMappingURL=whiteboard.js.map