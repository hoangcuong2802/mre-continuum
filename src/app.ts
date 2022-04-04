import * as MRE from "@microsoft/mixed-reality-extension-sdk";

import SignupForm from "./modules/signupform";

export default class Continuum {
  private assets: MRE.AssetContainer;
  private _signupForm: SignupForm;

  constructor(private context: MRE.Context, private params: MRE.ParameterSet) {
    this._signupForm = new SignupForm(context);

    this.context.onStarted(() => {
      switch (this.params.module) {
        case "signupForm":
          this._signupForm.started();
          break;  
        default:
          break;
      }
    });
  }
}
