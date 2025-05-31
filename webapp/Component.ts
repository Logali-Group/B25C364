import BaseComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";
import HelloDialog from "./controller/HelloDialog";

/**
 * @namespace com.logaligroup.invoices
 */
export default class Component extends BaseComponent {

    private helloDialog? : HelloDialog;

	public static metadata = {
		manifest: "json"
	};

	public init() : void {
		// call the base component's init function
		super.init();

        // set the device model
        this.setModel(createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();

        // Load helloDialog
        this.helloDialog = new HelloDialog(this.getRootControl());
	}

    public exit () : void {
        this.helloDialog?.destroy();
        delete this.helloDialog;
    }

    public openDialog () : void {
        this.helloDialog?.open();
    }
}