import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import HelloDialog from "./controller/HelloDialog";
import View from "sap/ui/core/mvc/View";

/**
 * @namespace com.logaligroup.invoices
 */
export default class Component extends BaseComponent {

    private helloDialog? : HelloDialog;

	public static metadata = {
		manifest: "json",
        interfaces: [
            "sap.ui.core.IAsyncContentCreation"
        ]
	};

	public init() : void {
		// call the base component's init function
		super.init();

        // set the device model
        this.setModel(createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();

	}

    public exit () : void {
        this.helloDialog?.destroy();
        delete this.helloDialog;
        super.exit();
    }

    public async openDialog () : Promise<void> {

        if (!this.helloDialog) {
            try {
                const rootView = await this.rootControlLoaded() as View;
                if (rootView) {
                    this.helloDialog = new HelloDialog(this.getRootControl());
                } else {
                    return
                }
            } catch (err) {
                return;
            }
        }

        this.helloDialog?.open();
    }
}