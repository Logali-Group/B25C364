import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SearchField$SearchEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import List from "sap/m/List";
import ListBinding from "sap/ui/model/ListBinding";
import Event from "sap/ui/base/Event";
import Component from "../Component";
import ObjectListItem from "sap/m/ObjectListItem";

/**
 * 
 * @namespace com.logaligroup.invoices.controller
 */


export default class InvoicesList extends Controller {


    public onInit () : void | undefined {
        this.currencyModel();
    }
    
    private currencyModel () : void {
        const data = {
            usd: 'USD',
            eur: 'EUR',
            ves: 'VES'
        }
        const model = new JSONModel(data);
        this.getView()?.setModel(model,'currency');
    }


    public onFilterPress (event : SearchField$SearchEvent) : void {
        let aFilters = [];
        const value = event.getParameter("query"); 

        if (value) {
            aFilters.push(new Filter({
                filters: [
                    new Filter("ProductName", FilterOperator.Contains, value),
                    new Filter("ShipperName", FilterOperator.Contains, value)
                ],
                and: false
            }));
        }

        const list = this.byId("list") as List;
        const binding = list.getBinding("items") as ListBinding;
            binding.filter(aFilters);
    }

    public onNavToDetail (event: Event) : void {
        const item = event.getSource() as ObjectListItem;
        const bindingContext = item.getBindingContext("northwind");
        const router = (this.getOwnerComponent() as Component).getRouter();
        const path = bindingContext?.getPath() as string;
        router.navTo("RouteDetail", {
            path: window.encodeURIComponent(path)
        });
    }
}