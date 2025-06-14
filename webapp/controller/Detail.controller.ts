import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import View from "sap/ui/core/mvc/View";

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

        view.bindElement({
            path: window.decodeURIComponent(path),
            model: 'northwind'
        });
    }

}