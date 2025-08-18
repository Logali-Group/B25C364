import View from "sap/ui/core/mvc/View";
import BaseController from "./BaseController";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Signature from "../control/Signature";
import Context from "sap/ui/model/odata/v2/Context";
import MessageBox from "sap/m/MessageBox";
import Utils from "../utils/Utils";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import UploadSet, { UploadSet$AfterItemRemovedEvent, UploadSet$BeforeUploadStartsEvent, UploadSet$UploadCompletedEvent } from "sap/m/upload/UploadSet";
import UploadSetItem, { UploadSetItem$OpenPressedEvent } from "sap/m/upload/UploadSetItem";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Item from "sap/ui/core/Item";
import Filter from "sap/ui/model/Filter";


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
        const signature = this.byId("signature") as Signature;


        view.bindElement({
            path: `/Orders(${orderId})`,
            model: 'northwind',
            events: {
                change: () =>{
                    signature.clear();
                    this.read();
                    this.searchFiles();
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


    public onBeforeUploadStarts (event : UploadSet$BeforeUploadStartsEvent) : void {
        let item = event.getParameter("item") as UploadSetItem,
            bindingContext = this.getView()?.getBindingContext("northwind") as Context,
            model = this.getOwnerComponent().getModel("zincidence") as ODataModel,
            utils = new Utils(this),
            sOrderId = bindingContext.getProperty("OrderID"),
            sSapId = utils.getEmail(),
            sEmployeeId = bindingContext.getProperty("EmployeeID"),
            fileName = item?.getFileName(),
            token = model.getSecurityToken(),
            slug = `${sOrderId};${sSapId};${sEmployeeId};${fileName}`;

            let customHeaderToken = new Item({
                key: 'x-csrf-token',
                text: token
            });

            let customHeaderSlug = new Item({
                key: 'slug',
                text: slug
            });

            item.addHeaderField(customHeaderToken);
            item.addHeaderField(customHeaderSlug);
    }


    public onUploadCompleted (event: UploadSet$UploadCompletedEvent) : void {
        let uploadSet = event.getSource(); //this.byId("attachments")
        uploadSet.getBinding("items")?.refresh();
    }

    private searchFiles () : void {
        let bindingContext = this.getView()?.getBindingContext("northwind") as Context,            
            utils = new Utils(this),
            sOrderId = bindingContext.getProperty("OrderID"),
            sSapId = utils.getEmail(),
            sEmployeeId = bindingContext.getProperty("EmployeeID");

        let uploadSet = this.byId("attachments") as UploadSet;

            uploadSet.bindAggregation("items", {
                path: 'zincidence>/FilesSet',
                filters:[
                    new Filter("OrderId","EQ", sOrderId),
                    new Filter("SapId","EQ",sSapId),
                    new Filter("EmployeeId","EQ", sEmployeeId)
                ],
                template: new UploadSetItem({
                    fileName: "{zincidence>FileName}",
                    mediaType: "{zincidence>MimeType}",
                    visibleEdit: false,
                    url: "/",
                    openPressed: this.onOpenPressed.bind(this)
                })
            });
    }

    public async onAfterItemRemoved (event: UploadSet$AfterItemRemovedEvent) : Promise<void> {
        let item = event.getParameter("item") as UploadSetItem,
            bindingContext = item.getBindingContext("zincidence") as Context, 
            path = bindingContext.getPath(),
            body = {
                path: path
            };
        let utils = new Utils(this);
        await utils.crud('delete', new JSONModel(body));
        item.getBinding("items").refresh();
    }

    private onOpenPressed (event: UploadSetItem$OpenPressedEvent) : void {
        let item = event.getSource() as UploadSetItem,
            bindingContext = item.getBindingContext("zincidence") as Context,
            path = bindingContext.getPath(),
            url = "/comlogaligroupemployees/sap/opu/odata/sap/YSAPUI5_SRV_01"+path+"/$value";
            console.log(url);
            item.setUrl(url);
    }

    public onNavToBack () : void {
        let bindingContext = this.getView().getBindingContext("northwind") as Context,
            sEmployeeId = bindingContext.getProperty("EmployeeID");
        let view = this.getView().getModel("view")as JSONModel;
        let router = this.getRouter();

        view.setProperty("/layout","TwoColumnsMidExpanded");

        router.navTo("RouteDetails", {
            id: sEmployeeId
        });

    };

}