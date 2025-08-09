import { CSSSize } from "sap/ui/core/library";
import { CSSColor } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Signature" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SignatureSettings extends $ControlSettings {
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;
        height?: CSSSize | PropertyBindingInfo | `{${string}}`;
        backgroundColor?: CSSColor | PropertyBindingInfo | `{${string}}`;
    }

    export default interface Signature {

        // property: width
        getWidth(): CSSSize;
        setWidth(width: CSSSize): this;

        // property: height
        getHeight(): CSSSize;
        setHeight(height: CSSSize): this;

        // property: backgroundColor
        getBackgroundColor(): CSSColor;
        setBackgroundColor(backgroundColor: CSSColor): this;
    }
}
