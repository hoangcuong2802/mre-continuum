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
        this.expectedResultDescription = "Fill in the signup form";
        this.drawObjects = [];
        this.worldBuildersListEnabled = false;
        this.assets = new MRE.AssetContainer(context);
    }
    cleanup() {
        this.assets.unload();
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
    }
    createSubmitButton() {
        const buttonMesh = this.assets.createBoxMesh('eraseButton', .2, .2, .01);
        const mat = this.assets.createMaterial("previewMaterial", { color: MRE.Color3.Black(), emissiveColor: MRE.Color3.FromHexString("#012451") });
        this.eraseButton = MRE.Actor.Create(this.context, {
            actor: {
                name: 'NoButton',
                parentId: this.drawSurface.id,
                transform: { local: { position: { x: 1.2 } } },
                appearance: {
                //meshId: buttonMesh.id,
                //materialId: mat.id,
                },
                collider: { geometry: { shape: MRE.ColliderType.Auto } }
            }
        });
    }
    createInstructionText() {
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'TextLabel',
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
        MRE.Actor.Create(this.context, {
            actor: {
                name: 'TextLabel',
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
                name: 'TextLabel',
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
                name: 'TextLabel',
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
        const nameButton = MRE.Actor.CreateFromLibrary(this.context, {
            //resourceId: 'artifact:1579238678213952234',
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Name Button',
                transform: {
                    local: {
                        position: { x: 0.7, y: 1.55, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } }
            }
        });
        nameButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
        });
        nameButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
          Enter your name and click "OK"
          (e.g. David).`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    MRE.Actor.Create(this.context, {
                        actor: {
                            name: 'ResultLabel',
                            parentId: this.eraseButton.id,
                            transform: { local: { position: { x: -2.0, y: 0.2, z: -0.1 } } },
                            text: {
                                contents: res.text,
                                height: .1,
                                anchor: MRE.TextAnchorLocation.MiddleLeft,
                                color: MRE.Color3.White()
                            }
                        }
                    });
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
        const emailButton = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Email Button',
                transform: {
                    local: {
                        position: { x: 0.7, y: 1.225, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } }
            }
        });
        emailButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
          Enter your email and click "OK"
          (e.g. abc@gmail.com).`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    MRE.Actor.Create(this.context, {
                        actor: {
                            name: 'ResultLabel',
                            parentId: this.eraseButton.id,
                            transform: { local: { position: { x: -2.0, y: -.1, z: -0.1 } } },
                            text: {
                                contents: res.text,
                                height: .1,
                                anchor: MRE.TextAnchorLocation.MiddleLeft,
                                color: MRE.Color3.White()
                            }
                        }
                    });
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
        const contactButton = MRE.Actor.CreateFromLibrary(this.context, {
            //resourceId: 'artifact:1579239194507608147',
            resourceId: 'artifact:1579238405710021245',
            actor: {
                name: 'Contact Number Button',
                transform: {
                    local: {
                        position: { x: 0.7, y: 0.9, z: 0 }
                    }
                },
                collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } }
            }
        });
        contactButton.setBehavior(MRE.ButtonBehavior).onClick(user => {
            user.prompt(`
          Enter your contact number and click "OK"
          (e.g. 084-3214-144).`, true)
                .then(res => {
                if (res.submitted && res.text.length > 0) {
                    MRE.Actor.Create(this.context, {
                        actor: {
                            name: 'ResultLabel',
                            parentId: this.eraseButton.id,
                            transform: { local: { position: { x: -2.0, y: -0.45, z: -0.1 } } },
                            text: {
                                contents: res.text,
                                height: .1,
                                anchor: MRE.TextAnchorLocation.MiddleLeft,
                                color: MRE.Color3.White()
                            }
                        }
                    });
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