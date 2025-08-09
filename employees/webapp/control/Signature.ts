import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import SignaturePad from "signature_pad";

/***
 * @namespace com.logaligroup.employees.control
 */

export default class Signature extends Control {

    constructor(idOrSettings?: string | $SignatureSettings);
    constructor(id?: string, settings?: $SignatureSettings);
    constructor(id?: string, settings?: $SignatureSettings) { super(id, settings); }


    private sigpad  : SignaturePad
    private flag : boolean = false;
    
    static readonly metadata: MetadataOptions = {
        properties: {
            width: {
                type : 'sap.ui.core.CSSSize',
                defaultValue: "400px"
            },
            height: {
                type: 'sap.ui.core.CSSSize',
                defaultValue: "100px"
            },
            backgroundColor: {
                type: 'sap.ui.core.CSSColor',
                defaultValue: "white"
            }
        }
    }

    init () : void {

    }

    renderer = {
        apiVersion: 4,
        render: (rm : RenderManager, control : Signature) => {
            rm.openStart("div", control);
            rm.class("signature");
            rm.openEnd();
                rm.openStart("canvas", control);
                rm.openEnd();
                rm.close("canvas");
            rm.close("div");
        }
    }

    onAfterRendering(): void | undefined {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;

        try {
            this.sigpad = new SignaturePad(canvas);
            
            canvas.addEventListener("pointerdown", () => {
                console.log("Se activo el evento: pointerdown");
                this.flag = true;
            });

        } catch (err) {
            console.log(err);
        }
    }

    public clear() : void {
        this.sigpad.clear();
        this.flag = false;
    }

    public isFill () : boolean {
        return this.flag;
    }

    public getSignature () : string {
        return this.sigpad.toDataURL();
    }

    public setSignature (sSignature : string) : void {
        this.sigpad.fromDataURL(sSignature, {width: 400 , height: 100});
    }
}