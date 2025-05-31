import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Component from "../Component";

/**
 * @namespace com.logaligroup.invoices.controller
 */

export default class Main extends Controller {

    public onInit() : void | undefined {
        this.viewModel();
    }

    private viewModel () : void {
        const data = {
            recipient: {
                name: "World",
                // details:[
                //     {
                //         name:"Jorge"
                //     }
                // ]
            }
        }
        const model = new JSONModel(data) ;
        this.getView()?.setModel(model, "view");
    }


    public onOpenDialog () : void {
        (this.getOwnerComponent() as Component).openDialog();
    }

}