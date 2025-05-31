import Controller from "sap/ui/core/mvc/Controller";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageToast from "sap/m/MessageToast";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Component from "../Component";

/**
 * @namespace com.logaligroup.invoices.controller
 */

export default class HelloPanel extends Controller {


    public onInit () : void | undefined {

    }

    public onShowMessage () : void  {
        const model = this.getView()?.getModel("i18n") as ResourceModel;
        const resourceBundle = model.getResourceBundle() as ResourceBundle;
        MessageToast.show(resourceBundle.getText("hello") || 'no text defined');
    }


    public onOpenDialog () : void {
        (this.getOwnerComponent() as Component).openDialog();
    }

}
