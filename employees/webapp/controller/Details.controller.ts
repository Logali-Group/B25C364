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
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import { DatePicker$ChangeEvent } from "sap/m/DatePicker";
import { TextArea$LiveChangeEvent } from "sap/m/TextArea";
import { Select$ChangeEvent } from 'sap/m/Select';
import Event from "sap/ui/base/Event";
import ObjectListItem from "sap/m/ObjectListItem";
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
                },
                dataRequest: () => {
                    view.setBusy(true);
                },
                dataReceived : () => {
                    view.setBusy(false);
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

        if (typeof form.getProperty("IncidenceId") === "undefined") {
            const object = {
                path: "/IncidentsSet",
                body: {
                    SapId: utils.getEmail(),
                    EmployeeId: (context.getProperty("EmployeeID")).toString(),
                    CreationDate: form.getProperty("CreationDate"),
                    Type: form.getProperty("Type"),
                    Reason: form.getProperty("Reason")
                },
                filters: [
                    new Filter("SapId", "EQ", utils.getEmail()),
                    new Filter("EmployeeId","EQ", (context.getProperty("EmployeeID")).toString())
                ]
            };
    
            const results = await utils.crud('create', new JSONModel(object));
            this.showIncidents(results);
        } else {

            let i = form.getProperty("IncidenceId");
            let s = utils.getEmail();
            let e = (context.getProperty("EmployeeID")).toString();

            const sUrl = `/IncidentsSet(IncidenceId='${i}',SapId='${s}',EmployeeId='${e}')`
            const object = {
                path: sUrl,
                body: {
                    SapId: utils.getEmail(),
                    EmployeeId: (context.getProperty("EmployeeID")).toString(),
                    CreationDate: form.getProperty("CreationDate"),
                    CreationDateX: form.getProperty("CreationDateX"),
                    Type: form.getProperty("Type"),
                    TypeX: form.getProperty("TypeX"),
                    Reason: form.getProperty("Reason"),
                    ReasonX: form.getProperty("ReasonX")
                },
                filters: [
                    new Filter("SapId", "EQ", utils.getEmail()),
                    new Filter("EmployeeId","EQ", (context.getProperty("EmployeeID")).toString())
                ]
            };
    
            const results = await utils.crud('update', new JSONModel(object));
            this.showIncidents(results);
        }


    }


    public async onDeletePress (event: Button$PressEvent) : Promise<void> {
        const button = event.getSource() as Button;
        const toolbar = button.getParent() as Toolbar;
        const panel = toolbar.getParent() as Panel;
        const form = panel.getBindingContext("form");

        const context = this.getView()?.getBindingContext("northwind");
        const utils = new Utils(this);

        let i = form.getProperty("IncidenceId");
        let s = utils.getEmail();
        let e = (context.getProperty("EmployeeID")).toString();

        const sUrl = `/IncidentsSet(IncidenceId='${i}',SapId='${s}',EmployeeId='${e}')`;


        let object = {
            path: sUrl,
            filters: [
                new Filter("SapId", "EQ", utils.getEmail()),
                new Filter("EmployeeId","EQ", (context.getProperty("EmployeeID")).toString())
            ]
        };

        const results = await utils.crud('delete', new JSONModel(object));
        this.showIncidents(results);
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

        const results = await utils.read(new JSONModel(object));
        this.showIncidents(results);
    }


    private showIncidents (results : ODataListBinding | void) : void {
        const panel = this.byId("tableIncidence") as Panel;
        panel.removeAllContent();
        const object = results as any;

        const formModel = this.getModel("form") as JSONModel;
        formModel.setData(object.results);

        object.results.forEach( async (incidence : object, index : number) => {
            const newIncidence = await <Promise<Panel>> this.loadFragment({name: "com.logaligroup.employees.fragment.NewIncidence"});
            newIncidence.bindElement("form>/"+index);
            panel.addContent(newIncidence);
        });
    }

    public updateIncidenceCreationDate (event : DatePicker$ChangeEvent) : void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;
        object.CreationDateX = true;
    }

    public updateIncidenceReason (event : TextArea$LiveChangeEvent) : void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;
        object.ReasonX = true;
    }

    public updateIncidenceType (event : Select$ChangeEvent) : void {
        const context = event.getSource().getBindingContext("form") as Context;
        let object = context.getObject() as any;
        object.TypeX = true;
    }

    public onNavToOrderDetails (event : Event) : void {
        const item = event.getSource() as ObjectListItem;
        const bindingContext = item.getBindingContext("northwind") as Context;
        const employeeId = bindingContext.getProperty("EmployeeID");
        const orderID = bindingContext.getProperty("OrderID");
        const router = this.getRouter();

        const viewModel = this.getModel("view") as JSONModel;
        viewModel.setProperty("/layout","EndColumnFullScreen");

        router.navTo("RouteOrderDeails", {
            EmployeeID: employeeId,
            OrderID: orderID
        });
    }
}