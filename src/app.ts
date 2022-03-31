import * as MRE from "@microsoft/mixed-reality-extension-sdk";

import WhiteBoard from './modules/whiteboard'
import SignupForm from "./modules/signupform";

export default class Continuum {
  private assets: MRE.AssetContainer;
  private _whiteBoard: WhiteBoard;
  private _signupForm: SignupForm;

  constructor(private context: MRE.Context, private params: MRE.ParameterSet) {
    this._whiteBoard = new WhiteBoard(context);
    this._signupForm = new SignupForm(context);

    this.context.onStarted(() => {
      switch (this.params.module) {
        case "whiteBoard":
          this._whiteBoard.started();
          break;
        case "signupForm":
          this._signupForm.started();
          break;  
        default:
          break;
      }
    });
  }
}
