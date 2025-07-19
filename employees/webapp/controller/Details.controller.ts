import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import Panel from "sap/m/Panel";
import Fragment from "sap/ui/core/Fragment";
import Button, { Button$PressEvent } from "sap/m/Button";
import Toolbar from "sap/m/Toolbar";
import Context from "sap/ui/model/odata/v2/Context";
import Utils from "../utils/Utils";
import Filter from "sap/ui/model/Filter";
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
            model: 'northwind',
            events: {
                change: () => {
                    this.read();
                }
            }
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
            name: "com.logaligroup.employees.fragment.NewIncidence",
            controller: this
        });

        this.panel.bindElement({
            path: 'form>/'+index,
            model: 'form'
        });

        this.panel.addStyleClass("sapUiSmallMarginBottom");
        const panel = this.byId("tableIncidence") as Panel;
        panel.addContent(this.panel);
    }

    public  async onSavePress (event: Button$PressEvent) : Promise<void> {
        const button = event.getSource() as Button;
        const toolbar = button.getParent() as Toolbar;
        const panel = toolbar.getParent() as Panel;
        const form = panel.getBindingContext("form");
        const context = this.getView()?.getBindingContext("northwind");
        const utils = new Utils(this);

        const object = {
            path: "/IncidentsSet",
            body: {
                SapId: utils.getEmail(),
                EmployeeId: (context.getProperty("EmployeeID")).toString(),
                CreationDate: form.getProperty("CreationDate"),
                Type: form.getProperty("Type"),
                Reason: form.getProperty("Reason")
            }
        };

        await utils.crud('create', new JSONModel(object));
    }


    private async read () : Promise<void> {
        const northwind = this.getView()?.getBindingContext("northwind") as Context;
        const utils = new Utils(this);
        const employeeId = (northwind.getProperty("EmployeeID")).toString();
        const sSAPID = utils.getEmail();

        const object = {
            path: '/IncidentsSet',
            filters:[
                new Filter("SapId","EQ", sSAPID),
                new Filter("EmployeeId","EQ", employeeId)
            ]
        };

        const resutls = await utils.read(new JSONModel(object));
        console.log(resutls);
    }

}