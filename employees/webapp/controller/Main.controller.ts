
import BaseController from "./BaseController";
import { FilterBar$ClearEvent, FilterBar$SearchEvent } from "sap/ui/comp/filterbar/FilterBar";
import Control from "sap/ui/core/Control";
import Input from "sap/m/Input";
import ComboBox from "sap/m/ComboBox";
import FilterOperator from "sap/ui/model/FilterOperator";
import Filter from "sap/ui/model/Filter";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import { read, writeFileXLSX } from "xlsx";

/**
 * @namespace com.logaligroup.employees.controller
 */
export default class Main extends BaseController {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }


    public onSearchPress (event : FilterBar$SearchEvent ) : void {
        const controls = event.getParameter("selectionSet") as Control[];
        const input = controls[0] as Input;
        const comboBox = controls[1] as ComboBox;

        let filters = [];
        let sInput = input.getValue() as string;
        let sCountry = comboBox.getSelectedKey() as string;

        if (sInput) {
            filters.push(new Filter({
                filters:[
                    new Filter("EmployeeID", FilterOperator.EQ, sInput),
                    new Filter("FirstName", FilterOperator.Contains, sInput),
                    new Filter("LastName", FilterOperator.Contains, sInput)
                ],
                and: false
            }));
        }


        if (sCountry) {
            filters.push(new Filter("Country", FilterOperator.EQ, sCountry));
        }

        this.applyFilters(filters);
    }

    private applyFilters (filters : Filter[]) : void {
        let table = this.byId("table") as Table;
        let binding = table.getBinding("items") as ListBinding;
        binding.filter(filters);
    } 

    public onClearPress (event: FilterBar$ClearEvent) : void {
        const controls = event.getParameter("selectionSet") as Control[];
        const input = controls[0] as Input;
        const comboBox = controls[1] as ComboBox;

        input.setValue("");
        comboBox.setSelectedKey("");

        this.applyFilters([]);
    }


    public onDownloadPress () : void {
        
    }
}