import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.logaligroup.employees
 */

export default class Container extends BaseController {

    public onInit () : void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails").attachPatternMatched(this.onBindingContext.bind(this));
    }

    private onBindingContext (event: Route$PatternMatchedEvent) : void {
        let arg = event.getParameter("arguments") as any;
        let id = arg.id as string;
        let view = this.getView() as View;

        view.bindElement({
            path: `/Employees/${parseInt(id) - 1}`,
            model: 'employees'
        });
    }

    public onClosePress () : void {
        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout","OneColumn");
        const router = this.getRouter();
        router.navTo("RouteMaster");
    }

}