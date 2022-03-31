"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whiteboard_1 = __importDefault(require("./modules/whiteboard"));
const signupform_1 = __importDefault(require("./modules/signupform"));
class Continuum {
    constructor(context, params) {
        this.context = context;
        this.params = params;
        this._whiteBoard = new whiteboard_1.default(context);
        this._signupForm = new signupform_1.default(context);
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
exports.default = Continuum;
//# sourceMappingURL=app.js.map