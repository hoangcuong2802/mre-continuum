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
const BUTTON_HEIGHT = 0.6;
class SignupForm {
    constructor(context) {
        this.context = context;
        this.expectedResultDescription = "Draw on the surface to place red ink";
        this.drawObjects = [];
        this.worldBuildersListEnabled = false;
        this.assets = new MRE.AssetContainer(context);
    }
    cleanup() {
        this.assets.unload();
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
    }
    //CREATE CUSTOM SIGNUP FORM MRE
    async started() {
        const root = MRE.Actor.Create(this.context, {});
        this.assets = new MRE.AssetContainer(this.context);
        this.createFormSurface(root);
        this.createSubmitButton();
        this.createInstructionText();
        this.createInterface();
    }
    eraseDrawObjects() {
        this.drawObjects.forEach(actor => actor.destroy());
        this.drawObjects = [];
    }
    createFormSurface(root) {
        const surfaceMesh = this.assets.createBoxMesh('drawSurface', 2, 1, .01);
        const mat = this.assets.createMaterial("previewMaterial", { color: MRE.Color3.Black(), emissiveColor: MRE.Color3.FromHexString("#012451") });
        // Create draw surface
        this.drawSurface = MRE.Actor.Create(this.context, {
            actor: {
                name: 'drawSurface',
                parentId: root.id,
                transform: { local: { position: { y: 1.2 } } },
                appearance: {
                    meshId: surfaceMesh.id,
                    materialId: mat.id,
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
    createSubmitButton() {
        const buttonMesh = this.assets.createBoxMesh('eraseButton', .2, .2, .01);
        const mat = this.assets.createMaterial("previewMaterial", { color: MRE.Color3.Black(), emissiveColor: MRE.Color3.FromHexString("#012451") });
        this.eraseButton = MRE.Actor.Create(this.context, {
            actor: {
                name: 'eraseButton',
                parentId: this.drawSurface.id,
                transform: { local: { position: { x: 1.2 } } },
                appearance: {
                    meshId: buttonMesh.id,
                    materialId: mat.id,
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'eraseButtonLabel',
                parentId: this.eraseButton.id,
                transform: { local: { position: { x: -1.2, y: .7 } } },
                text: {
                    contents: "Register your interest in Continuum products",
                    height: .1,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    color: MRE.Color3.White()
                }
            }
        });
        const eraseButtonBehavior = this.eraseButton.setBehavior(MRE.ButtonBehavior);
        eraseButtonBehavior.onClick((_, __) => this.eraseDrawObjects());
    }
    createInstructionText() {
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'eraseButtonLabel',
                parentId: this.eraseButton.id,
                transform: { local: { position: { x: -2.0, y: 0.3, z: -0.1 } } },
                text: {
                    contents: "Enter your name",
                    height: .1,
                    anchor: MRE.TextAnchorLocation.MiddleLeft,
                    color: MRE.Color3.White()
                }
            }
        });
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'eraseButtonLabel',
                parentId: this.eraseButton.id,
                transform: { local: { position: { x: -2.0, y: 0, z: -0.1 } } },
                text: {
                    contents: "Enter your email",
                    height: .1,
                    anchor: MRE.TextAnchorLocation.MiddleLeft,
                    color: MRE.Color3.White()
                }
            }
        });
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'eraseButtonLabel',
                parentId: this.eraseButton.id,
                transform: { local: { position: { x: -2.0, y: -0.3, z: -0.1 } } },
                text: {
                    contents: "Enter your contact number",
                    height: .1,
                    anchor: MRE.TextAnchorLocation.MiddleLeft,
                    color: MRE.Color3.White()
                }
            }
        });
    }
    createInterface() {
        const favoritesButton = MRE.Actor.CreateFromLibrary(this.context, {
            //resourceId: 'artifact:1579238678213952234',
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Favorites Button',
                transform: {
                    local: {
                        position: { x: 0.7, y: 1.55, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } }
            }
        });
        favoritesButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
        });
        favoritesButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
          Enter your name and click "OK"
          (e.g. David).`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    //this.infoText.text.contents = this.resultMessageFor(res.text);
                    //this.search(res.text);
                }
                else {
                    // user clicked 'Cancel'
                }
            })
                .catch(err => {
                console.error(err);
            });
        });
        const helpButton = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Help Button',
                transform: {
                    local: {
                        position: { x: 0.7, y: 1.225, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } }
            }
        });
        helpButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
          Enter your email and click "OK"
          (e.g. abc@gmail.com).`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    //this.infoText.text.contents = this.resultMessageFor(res.text);
                    //this.search(res.text);
                }
                else {
                    // user clicked 'Cancel'
                }
            })
                .catch(err => {
                console.error(err);
            });
        });
        const hashtagButton = MRE.Actor.CreateFromLibrary(this.context, {
            //resourceId: 'artifact:1579239194507608147',
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Search Button',
                transform: {
                    local: {
                        position: { x: 0.7, y: 0.9, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } }
            }
        });
        hashtagButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
          Enter your contact number and click "OK"
          (e.g. 084-3214-144).`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    //this.infoText.text.contents = this.resultMessageFor(res.text);
                    //this.search(res.text);
                }
                else {
                    // user clicked 'Cancel'
                }
            })
                .catch(err => {
                console.error(err);
            });
        });
    }
}
exports.default = SignupForm;
//# sourceMappingURL=signupform.js.map