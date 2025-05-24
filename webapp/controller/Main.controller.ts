import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace com.logaligroup.invoices.controller
 */

export default class Main extends Controller {

    public onShowMessage () : void  {
        const model = this.getView()?.getModel("i18n") as ResourceModel;
        const resourceBundle = model.getResourceBundle() as ResourceBundle;
        MessageToast.show(resourceBundle.getText("hello") || 'no text defined');
    }

}