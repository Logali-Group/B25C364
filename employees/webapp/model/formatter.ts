import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ValueState } from "sap/ui/core/library";
import DateFormat from "sap/ui/core/format/DateFormat";

export default {

    /**
     * @namespace com.logaligroup.employees.formatter
     */

    titleFormatter : function (this : Controller) {

        const resourceModel = (this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel;
        const resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;

        const binding = (this.byId("table") as Table).getBinding("items") as ListBinding;

        if (!binding) {
            return resourceBundle.getText("tableHeaderCount",[0]);
        }

        const sNewTitle = resourceBundle.getText("tableHeaderCount",[binding.getLength()]);

        binding.attachChange(()=>{
            let viewModel = this.getView()?.getModel("viewContainer") as JSONModel;
            viewModel.setProperty("/title", resourceBundle.getText("tableHeaderCount",[binding.getLength()]));
        });

        return sNewTitle;

    },

    statusText: function(this: Controller, sStatusKey: string): string {
        const oStatusModel = this.getView()?.getModel("status") as JSONModel;
         if (!sStatusKey || !oStatusModel) {
            return sStatusKey || "";
        }
        const aStatus = oStatusModel.getProperty("/Status");
        const oStatus = aStatus.find((status: any) => status.Key === sStatusKey);
        return oStatus ? oStatus.Text : sStatusKey;
    },


    statusState: function(sStatusKey: string): ValueState {
        switch (sStatusKey) {
            case "Active":
                return ValueState.Success;
            case "On Leave":
                return ValueState.Warning;
            case "Inactive":
                return ValueState.Error;
            default:
                return ValueState.None;
        }
    },

    formatDate: function(sDate: string): string {

        if (!sDate) {
            return "";
        }

        const oDate = new Date(sDate);
        const oDateFormat = DateFormat.getDateInstance({
            style: "medium"
        });
        
        return oDateFormat.format(oDate);
    },

    countryName: function (this: Controller, sCountryKey: string): string {

        const oCountriesModel = this.getView()?.getModel("countries") as JSONModel;

        if (!oCountriesModel) {
            return sCountryKey; 
        }

        const aCountries = oCountriesModel.getProperty("/Countries");
        if (!aCountries) {
            return sCountryKey;
        }

        const oCountry = aCountries.find((country: any) => country.key === sCountryKey);

        return oCountry ? oCountry.country : sCountryKey;
    }

};