import * as MRE from "@microsoft/mixed-reality-extension-sdk";
export default class SignupForm {
    private context;
    private assets;
    expectedResultDescription: string;
    private drawSurface;
    private eraseButton;
    private surfaceBehavior;
    private drawMesh;
    private hoverMaterial;
    private drawMaterial;
    private drawObjects;
    private worldBuildersListEnabled;
    private worldBuildersList;
    private infoText;
    cleanup(): void;
    constructor(context: MRE.Context);
    started(): Promise<void>;
    private eraseDrawObjects;
    private createFormSurface;
    private createSubmitButton;
    private createInstructionText;
    private createInterface;
}
//# sourceMappingURL=signupform.d.ts.map