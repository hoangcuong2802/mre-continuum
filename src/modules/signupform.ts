import * as MRE from "@microsoft/mixed-reality-extension-sdk";
import { Text, User } from "@microsoft/mixed-reality-extension-sdk";
import dotenv from "dotenv";

const BUTTON_HEIGHT = 0.6;


export default class SignupForm {
    private assets: MRE.AssetContainer;

    public expectedResultDescription = "Fill in the signup form";
    private userId: MRE.Guid;
    private userIds: Set<MRE.Guid>;
    private drawSurface: MRE.Actor;
    private eraseButton: MRE.Actor;
    private surfaceBehavior: MRE.ButtonBehavior;
    private drawMesh: MRE.Mesh;
    private hoverMaterial: MRE.Material;
    private drawMaterial: MRE.Material;
    private drawObjects: MRE.Actor[] = [];
    private worldBuildersListEnabled = false;
    private worldBuildersList : any;
    private infoText : any;
    public whiteButtonModel: MRE.Actor;
    private currentHost: MRE.User = null;


    public cleanup() {
        this.assets.unload();
      }
    
      constructor(private context: MRE.Context) {
        this.assets = new MRE.AssetContainer(context);
      }
    
    //CREATE CUSTOM SIGNUP FORM MRE
    public async started() {
      const app = this;
      const root = MRE.Actor.Create(this.context, {
      })
      this.assets = new MRE.AssetContainer(this.context);
      this.context.onUserJoined(async (user: MRE.User) => {
        this.userId = user.id;
      })
      this.createFormSurface(root);
      this.createSubmitButton();
      this.createInstructionText(); 
      this.createInterface();
      this._whiteButtonModel();
  }

  private eraseDrawObjects() {
    this.drawObjects.forEach(actor => actor.destroy());
    this.drawObjects = [];
  }

  private createFormSurface(root: MRE.Actor) {
    const surfaceMesh = this.assets.createBoxMesh('drawSurface', 2, 1, .01);
    const mat = this.assets.createMaterial("previewMaterial", {color: MRE.Color3.Black(), emissiveColor:MRE.Color3.FromHexString("#012451")})

    // Create draw surface
    this.drawSurface = MRE.Actor.Create(this.context, {
      actor: {
        name: 'drawSurface',
        parentId: root.id,
        transform: { local: { position: { y: 1.2, z:0.05 } } },
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

  private createSubmitButton() {
    const buttonMesh = this.assets.createBoxMesh('eraseButton', .2, .2, .01);
    const mat = this.assets.createMaterial("previewMaterial", {color: MRE.Color3.Black(), emissiveColor:MRE.Color3.FromHexString("#012451")})
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

  private createInstructionText() {

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
    })

    MRE.Actor.Create(this.context, {
      actor: {
        name: 'TextLabel',
        parentId: this.eraseButton.id,
        transform: { local: { position: { x: -2.0, y: 0.3, z: -0.15 } } },
        text: {
          contents: "Enter your name",
          height: .1,
          anchor: MRE.TextAnchorLocation.MiddleLeft,
          color: MRE.Color3.White()
        }
      }
    })

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
    })
  
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
    })
  }

  private _whiteButtonModel ()
  {
    // const blackButtonModel = MRE.Actor.CreateFromGltf(this.assets, {
    //   uri: `https://cdn-content-ingress.altvr.com/uploads/model/gltf/1972402042165002355/answerButton2.glb `,
    //   colliderType: "mesh",
    //   actor: {
    //     name: "submitButton",
    //     transform: {
    //       local: {
    //         scale: { x: 1, y: 1, z: 1 },
    //         position: { x: -1.5, y: 0.3, z: -.1 },
    //       },
    //     },
    //     parentId: this.eraseButton.id,
    //   },
    // });
    
    // const iconHover = blackButtonModel.setBehavior(MRE.ButtonBehavior);
    // iconHover.onHover(
    //   "hovering", 
    //   (user:any) => {
    //       console.log("hovering");
    //       const mat = this.assets.createMaterial("previewMaterial", {color: MRE.Color3.White()})
    //       this.whiteButtonModel = MRE.Actor.CreateFromGltf(this.assets, {
    //       uri: `https://cdn-content-ingress.altvr.com/uploads/model/gltf/1972409441848393759/answerButton.glb `,
    //       colliderType: "mesh",
    //       actor: {
    //         name: "Button",
    //         transform: {
    //           local: {
    //             scale: { x: 1, y: 1, z: 1 },
    //             position: { x: -1.5, y: 0.3, z: -0.12 },
    //           },
    //         },
    //         appearance: {
    //           materialId: mat.id,
    //          },
    //         parentId: this.eraseButton.id,
    //       },
    //     });         
    //   }
    // )
    // iconHover.onHover(
    //   "exit", 
    //   (user:any) => {
    //     console.log("unhovering");
    //     this.whiteButtonModel.destroy(); 
    //     delete this.whiteButtonModel;
    //   }
    // )
  }

  private createInterface()
  {
    //const answerButtonModel = new MRE.AssetContainer(this.context);
	  //answerButtonModel.loadGltf('https://cdn-content-ingress.altvr.com/uploads/model/gltf/1972402042165002355/answerButton2.glb', 'mesh');
   
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
        collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } },
        exclusiveToUser:  this.userId
      }
     });

    nameButton.setBehavior(MRE.ButtonBehavior).onClick((user: MRE.User) => {
      user.prompt(`
          Enter your name and click "OK"
          (e.g. David).`, true)
      .then(res => {
          this.userId = user.id;
          if(res.submitted && res.text.length > 0){
            MRE.Actor.Create(this.context, {
              actor: {
                exclusiveToUser: this.userId,
                name: 'ResultLabel',
                parentId: this.eraseButton.id,
                transform: { local: { position: { x: -2.0, y: 0.2, z: -0.1 } } },
                text: {
                  contents: res.text,
                  height: .1,
                  anchor: MRE.TextAnchorLocation.MiddleLeft,
                  color: MRE.Color3.White()
                },
              }
            })
            //this.infoText.text.contents = this.resultMessageFor(res.text);
            //this.search(res.text);
          }
          else{
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
        collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } },
        exclusiveToUser:  this.userId
      }
     });

     emailButton.setBehavior(MRE.ButtonBehavior).onClick((user: MRE.User) => {
      user.prompt(`
          Enter your email and click "OK"
          (e.g. abc@gmail.com).`, true)
      .then(res => {
          this.userId = user.id;
          if(res.submitted && res.text.length > 0){
            MRE.Actor.Create(this.context, {
              actor: {
                exclusiveToUser: this.userId,
                name: 'ResultLabel',
                parentId: this.eraseButton.id,
                transform: { local: { position: { x: -2.0, y: -.1, z: -0.1 } } },
                text: {
                  contents: res.text,
                  height: .1,
                  anchor: MRE.TextAnchorLocation.MiddleLeft,
                  color: MRE.Color3.White()                  
                },
              }
            })
            //this.infoText.text.contents = this.resultMessageFor(res.text);
            //this.search(res.text);
          }
          else{
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
        collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } },
        exclusiveToUser:  this.userId
      }
    });

    contactButton.setBehavior(MRE.ButtonBehavior).onClick((user: MRE.User) => {
      user.prompt(`
          Enter your contact number and click "OK"
          (e.g. 084-3214-144).`, true)
      .then(res => {
          this.userId = user.id;
          if(res.submitted && res.text.length > 0){
            MRE.Actor.Create(this.context, {
              actor: {
                exclusiveToUser:  this.userId,
                name: 'ResultLabel',
                parentId: this.eraseButton.id,
                transform: { local: { position: { x: -2.0, y: -0.45, z: -0.1  } } },
                text: {
                  contents: res.text,
                  height: .1,
                  anchor: MRE.TextAnchorLocation.MiddleLeft,
                  color: MRE.Color3.White()
                },
              }
            })
            //this.infoText.text.contents = this.resultMessageFor(res.text);
            //this.search(res.text);
          }
          else{
            // user clicked 'Cancel'
          }
      })
      .catch(err => {
        console.error(err);
      });
    });
  }
}

