import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import Fragment from "sap/ui/core/Fragment";
/**
 * @namespace com.logaligroup.employees
 */

export default class Container extends BaseController {


    panel : Panel;

    private removeAllContent () : void {
        const panel = this.byId("tableIncidence") as Panel;
        panel.removeAllContent();
    }

    public onInit () : void | undefined {
        const router = this.getRouter();
        router.getRoute("RouteDetails").attachPatternMatched(this.onBindingContext.bind(this));
    }

    private onBindingContext (event: Route$PatternMatchedEvent) : void {

        //reset - del panel de incidencia
        this.removeAllContent();
        //reset - del modelo form
        this.formModel();

        let arg = event.getParameter("arguments") as any;
        let id = arg.id as string;
        let view = this.getView() as View;

        view.bindElement({
            path: `/Employees(${parseInt(id)})`,
            model: 'northwind'
        });
    }

    private formModel () : void {
        const model = new JSONModel([]);
        this.setModel(model, "form");
    }

    public onClosePress () : void {
        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout","OneColumn");
        const router = this.getRouter();
        router.navTo("RouteMaster");
    }

    public async onCreatePress () : Promise<void> {

        const view = this.getView() as View;
        const formModel = this.getModel("form") as JSONModel;
        const data = formModel.getData() ; // Arreglo
        const index = data.length;
        data.push({Index: index + 1});
        formModel.refresh();

        this.panel = await <Promise<Panel>> Fragment.load({
            id: view.getId(),
            name: "com.logaligroup.employees.fragment.NewIncidence" 
        });

        this.panel.bindElement({
            path: 'form>/'+index,
            model: 'form'
        });

        this.panel.addStyleClass("sapUiSmallMarginBottom");
        const panel = this.byId("tableIncidence") as Panel;
        panel.addContent(this.panel);
    }

}