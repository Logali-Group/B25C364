import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";


/**
 * @namespace com.logaligroup.employees.utils
 */


export default class Utils {

    private controller : Controller;
    private model : ODataModel;
    private resourceModel : ResourceBundle;

    constructor (controller : Controller) {
        this.controller = controller;
        this.model = (this.controller.getOwnerComponent() as UIComponent).getModel("zincidence") as ODataModel;
        this.resourceModel = ((this.controller.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
    }

    public getEmail () : string {
        return "b25c364@logaligroup.com";
    }


    public async crud (action : string, object: JSONModel) : Promise<void | ODataListBinding> {
        const i18n = this.resourceModel;

        return new Promise((resolve,reject)=> {

            MessageBox.confirm(i18n.getText("question"), {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: async (sAction : string) => {
                    if (sAction === "OK") {
                        switch (action) {
                            case 'create': resolve(await this._create(object)); break;
                            case 'update': resolve(await this._update(object)); break;
                            case 'delete': resolve(await this._delete(object)); break;
                        }
                    }
                }
            });
        });

    }

    public async read (object? : JSONModel) : Promise< void | ODataListBinding> {
        const model = this.model;
        const path = object?.getProperty("/path");
        //const pathTemp = "/IncidentsSet";
        const filters = object?.getProperty("/filters");
        const resourceBundle = this.resourceModel;

        console.log("Estoy buscando la firma");

        return new Promise((resolve,reject) => {
            model.read(path, {
                filters: filters,
                success: (results : ODataListBinding) => {
                    resolve(results);
                },
                error: () => {
                    //MessageBox.error(resourceBundle.getText("error"));
                    reject();
                }
            });
        });
    }

    private async _create (object : JSONModel) : Promise<void | ODataListBinding> {
        const odataModel = this.model;
        const path = object.getProperty("/path");
        const body = object.getProperty("/body");
        const resourceBundle = this.resourceModel;

        return new Promise( async (resolve,reject) => {
            odataModel.create(path,body, {
                success: async () => {
                    MessageBox.success(resourceBundle.getText("success"));
                    resolve(await this.read(object));
                    //this.refresh();
                },
                error: () => {
                    MessageBox.error(resourceBundle.getText("error"));
                    resolve();
                }
            });
        });


    }

    private async _update (object? : JSONModel) : Promise<void | ODataListBinding> {
        const model = this.model;
        const path = object?.getProperty("/path");
        const body = object?.getProperty("/body");
        const resourceBundle = this.resourceModel;


        return new Promise((resolve, reject)=> {
            model.update(path, body, {
                success: async () => {
                    MessageBox.success(resourceBundle.getText("success"));
                    resolve(await this.read(object));
                },
                error : () => {
                    MessageBox.success(resourceBundle.getText("error"));
                    reject();
                }
            });  
        });


    }

    private async _delete (object : JSONModel) : Promise<void | ODataListBinding> {
        const model = this.model;
        const path = object?.getProperty("/path");
        const resourceBundle = this.resourceModel;

        return new Promise((resolve, reject)=> {
            model.remove(path, {
                success: async () => {
                    MessageBox.success(resourceBundle.getText("success"));
                    resolve(await this.read(object));
                },
                error : () => {
                    MessageBox.success(resourceBundle.getText("error"));
                    reject();
                }
            });
        });


    }
}