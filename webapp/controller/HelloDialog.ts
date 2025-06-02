import ManagedObject from "sap/ui/base/ManagedObject";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import Control from "sap/ui/core/Control";


export default class HelloDialog extends ManagedObject {

    //onInit --> init
    //onBeforeRendering --> beforeRendering
    //onAfterRedenring --> afterRendering
    //onExit --> exit

    private dialog : Dialog;
    private view? : View | Control;

    constructor (view: View | Control) {
        super()
        if (!view) {
            throw new Error("Se requiere una instancia de Vista o Control para HelloDialog.");
        }
        this.view = view;
    }

    public exit (): void{
        delete this.view;
    }

    public onCancelPress(): void {
        this.dialog?.close();
    }

    public async open () : Promise<void> {

        const view = this.view as View;

        this.dialog??= await Fragment.load({
            id: view?.getId(),
            name: "com.logaligroup.invoices.fragment.HelloDialog",
            controller: this
        }) as Dialog;

        view?.addDependent(this.dialog);
        this.dialog.open();
    }

}