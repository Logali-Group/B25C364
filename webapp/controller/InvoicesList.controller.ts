import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

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
}