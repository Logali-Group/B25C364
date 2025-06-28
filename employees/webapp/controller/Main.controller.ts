
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
import * as XLSX from 'xlsx';

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
			// --- PASO A: OBTENER LOS DATOS DE LA TABLA ---
			// Es una mejor práctica obtener los datos directamente del binding de la tabla.
			// De esta forma, si el usuario ha filtrado los resultados, solo exportaremos los datos visibles.
			const oTable = this.byId("table") as Table;
			const oRowBinding = oTable.getBinding("items") as ListBinding;
			let aDataToExport: any[] = [];
			
			// --- PASO B: PREPARAR LOS DATOS PARA LA EXPORTACIÓN ---
			// La librería necesita un array de objetos "planos".
			// Vamos a recorrer los datos de la tabla y a crear un nuevo array con el formato deseado.
			
			oRowBinding.getContexts().forEach(oContext => {
				const oEmployee = oContext.getObject() as any; // Obtenemos el objeto de cada fila
				
				// Creamos un nuevo objeto con las propiedades que queremos exportar
				// y con cabeceras amigables para el usuario.
				aDataToExport.push({
					"ID": oEmployee.EmployeeID,
					"Nombre Completo": `${oEmployee.FirstName} ${oEmployee.LastName}`,
					"País": oEmployee.Country,
					"Ciudad": oEmployee.City,
					"Código Postal": oEmployee.PostalCode
				});
			});
			
			// Si no hay datos, no hacemos nada.
			if (aDataToExport.length === 0) {
				return;
			}
			
			// --- PASO C: UTILIZAR SHEETJS PARA CREAR Y DESCARGAR EL EXCEL ---
			// Tal como se indica en la documentación de npm: https://www.npmjs.com/package/xlsx
			
			// 1. Crear una nueva hoja de cálculo a partir de nuestro array de datos (JSON).
			// La función `json_to_sheet` convierte un array de objetos en una hoja.
			const oWorkSheet = XLSX.utils.json_to_sheet(aDataToExport);
			
			// 2. Crear un nuevo libro de trabajo.
			const oWorkBook = XLSX.utils.book_new();
			
			// 3. Añadir la hoja de cálculo al libro. Le damos un nombre a la pestaña, "Empleados".
			XLSX.utils.book_append_sheet(oWorkBook, oWorkSheet, "Empleados");
			
			// 4. Descargar el archivo.
			// `writeFile` genera el fichero .xlsx y activa la descarga en el navegador.
			XLSX.writeFile(oWorkBook, "Listado de Empleados.xlsx");
    }
}