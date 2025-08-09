import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Signature from "../control/Signature";
import Context from "sap/ui/model/odata/v2/Context";
import MessageBox from "sap/m/MessageBox";
import Utils from "../utils/Utils";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";


/**
 * @namespace com.logaligroup.employees.controller
 */
export default class OrderDetails extends BaseController {


    public onInit(): void {
        const router = this.getRouter();
        router.getRoute("RouteOrderDeails").attachPatternMatched(this.onBindingContext.bind(this));
    }

    private onBindingContext (event: Route$PatternMatchedEvent) : void {
        const args = event.getParameter("arguments") as any;
        const employeeId = args.EmployeeID;
        const orderId = args.OrderID;
        const view = this.getView() as View;


        view.bindElement({
            path: `/Orders(${orderId})`,
            model: 'northwind',
            events: {
                change: () =>{
                    this.read();
                } ,
                dataRequest: () => {
                    view.setBusy(true);
                },
                dataReceived : () => {
                    view.setBusy(false);
                }
            }
        });

    }

    public onClearSignature () : void {
        const signature = this.byId("signature") as Signature;
        signature.clear();
    }


    public async onSaveSignature () : Promise<void> {
        const signature = this.byId("signature") as Signature;
        const bindingContext = this.getView()?.getBindingContext("northwind") as Context;
        const resourceBundle = this.getResourceBundle();
        const utils = new Utils(this);
        

        if (signature.isFill()) {
            const sMediaContent = signature.getSignature();

            const object = {
                path: '/SignatureSet',
                body: {
                    OrderId: bindingContext.getProperty("OrderID").toString(),
                    SapId: utils.getEmail(),
                    EmployeeId: bindingContext.getProperty("EmployeeID").toString(),
                    MediaContent: sMediaContent.replace("data:image/png;base64,",""),
                    MimeType: 'image/png'
                }
            };

            await utils.crud('create', new JSONModel(object))

        } else {
            MessageBox.error(resourceBundle.getText("fillSignature"));
        }
    }


    private async read () : Promise<void | ODataListBinding> {
        const bindingContext = this.getView()?.getBindingContext("northwind") as Context;
        const utils = new Utils(this);
        const sOrderID = bindingContext.getProperty("OrderID").toString();
        const sSapId = utils.getEmail();
        const sEmployeeID = bindingContext.getProperty("EmployeeID").toString();

        const object= {
            path: `/SignatureSet(OrderId='${sOrderID}',SapId='${sSapId}',EmployeeId='${sEmployeeID}')`
        };

        console.log(object);

        const results = await utils.read(new JSONModel(object));
        console.log(results);
        this.showSigngature(results);
    }

    private showSigngature (data : void | ODataListBinding) : void {
        let results = data as any;
        const signature = this.byId("signature") as Signature;
        const mediaContent = results.MediaContent;
        console.log(mediaContent);
        signature.setSignature("data:image/png;base64,"+mediaContent);
    }


    public onRefreshPress () : void {
        this.read();
    }

}