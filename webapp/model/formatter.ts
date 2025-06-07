import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";


export default {
    statusText : function (this : Controller, status : string) : string | undefined {
        const resourceModel = (this.getOwnerComponent() as Component)?.getModel("i18n") as ResourceModel;
        const resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;

        switch (status) {
            case 'A': return resourceBundle.getText("invoicesStatusA");
            case 'B': return resourceBundle.getText("invoicesStatusB");
            case 'C': return resourceBundle.getText("invoicesStatusC");
            default:  return status;
        }
    }
}