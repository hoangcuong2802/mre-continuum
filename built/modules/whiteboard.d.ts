import * as MRE from "@microsoft/mixed-reality-extension-sdk";
export default class WhiteBoard {
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
    cleanup(): void;
    constructor(context: MRE.Context);
    started(): Promise<boolean>;
    private spawnTargetObjects;
    private eraseDrawObjects;
    private createDrawSurface;
    private createEraseButton;
}
//# sourceMappingURL=whiteboard.d.ts.map