import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import View from "sap/ui/core/mvc/View";
import History from "sap/ui/core/routing/History";
import ProductRating, { ProductRating$ChangeEvent } from "../control/ProductRating";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageToast from "sap/m/MessageToast";

/**
 * 
 * @namespace com.logaligroup.invoices.controller
 */


export default class Detail extends Controller {


    public onInit () : void | undefined {

        const router = (this.getOwnerComponent() as Component).getRouter();
        router.getRoute("RouteDetail")?.attachPatternMatched(this.myHandler.bind(this));
        
    }

    private myHandler (event: Route$PatternMatchedEvent ) : void {
        const args = event.getParameter("arguments") as any;
        const path = args.path;
        const view = this.getView() as View;

        (this.byId("rating") as ProductRating).reset();

        view.bindElement({
            path: window.decodeURIComponent(path),
            model: 'northwind'
        });
    }


    public onNavToBack () : void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        if (previousHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = (this.getOwnerComponent() as Component).getRouter();
            router.navTo("RouteMain", {
                path: '1'
            });
        }
    }

    onRatingChange (event : ProductRating$ChangeEvent) : void {
        let resourceModel = this.getView()?.getModel("i18n") as ResourceModel;
        let resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;
        let value = event.getParameter("value");
        MessageToast.show(resourceBundle.getText("ratingConfirmation",[value]) || 'not text defined');
    }

}