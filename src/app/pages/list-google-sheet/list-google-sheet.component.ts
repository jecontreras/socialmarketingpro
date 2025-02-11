import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { GoogleSheetService } from 'src/app/servicesComponent/google-sheet.service';
import { ListVentaService } from 'src/app/servicesComponent/list-venta.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-list-google-sheet',
  templateUrl: './list-google-sheet.component.html',
  styleUrls: ['./list-google-sheet.component.scss']
})
export class ListGoogleSheetComponent implements OnInit {

  displayedColumns: string[] = ['SELECT', '#PEDIDO', 'TIPOENVIO', 'PRODUCT', 'CANTIDAD', 'NUMBERCEL', 'CLIENTE', 'DEPARTAMENT', 'CITY', 'TOTAL', 'FECHA' ];
  dataSource = new MatTableDataSource([]);
  
  selection: any[] = []; // Lista de filas seleccionadas
  dataUser:USERT;

  quers:any = {
    where: { },
    limit: 100,
    page: 0
  };
  counts:number = 0;

  dataConfig:any = {};
  opcionCurrencys: any = {};
  estadosVentas = [
    { nombre: 'Pendiente', valor: 0 },
    { nombre: 'Por imprimir', valor: 1 }
  ];
  cargando: boolean = false; // Estado del spinner
  cargando2: boolean = false;
  cargandoTabla: boolean = true;


  constructor(
    private _googleShet: GoogleSheetService,
    private _store: Store<USER>,
    private _listVe: ListVentaService,
    private _tools: ToolsService,
    private _config: ConfigKeysService,
  ) {
    this.dataConfig = this._config._config.keys;
    this.opcionCurrencys = this._tools.currency;
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user;
    });
  }

  async ngOnInit() {
    this.quers = {
      where: {
        user: this.dataUser.id,
        createT: [0,1,3],
        company: this.dataUser.empresa
      },
      limit: 100,
      page: 0
    };
    //let hojaR:any = await this.getHoja();

    //let list:any = await this.getList( hojaR );
    let list:any = await this.getListData( );
    this.dataSource.data = list;
  }

  getHoja(){
    return new Promise( resolve =>{
      this._googleShet.get({
        where: {
          user: this.dataUser.id,
          company: this.dataUser.empresa
        }
      }).subscribe( res =>{
        res = res.data[1];
        resolve( res );
      })
    });
  }

  getList( hojaR ){
    return new Promise( resolve =>{
      this._googleShet.getShet({
        where: {
          urlGoogle: hojaR.urlGoogle,
          sheetName: hojaR.sheetName,
          limitSheet: hojaR.limitSheet,
          user: this.dataUser.id,
          company: this.dataUser.empresa
        }
      }).subscribe( res =>{
        this.cargandoTabla = false;
        resolve( res.data );
      },()=>this.cargandoTabla = false );
    });
  }

  getListData(){
    return new Promise( resolve =>{
      this.cargandoTabla = true;
      this._listVe.get( this.quers ).subscribe( res =>{
        this.counts = res.count;
        this.cargandoTabla = false;
        resolve( res.data );
      },()=> this.cargandoTabla = false );
    });
  }

  async filtrarPorEstado() {
    this.quers.where.printInt = [this.quers.where.printInt]; // Asegura que sea un array
    let list:any = await this.getListData( );
    this.dataSource.data = list;
  }

  async handleDrop( row:any ){
    let valid:any = await this._tools.confirm( { title: "Eliminar Dato", text: "Opciones" } );
    console.log("**104", valid)
    if( !valid.value ) return true;
    if( row.id ) await this.handleUpdate( { id: row.id, createT: 2 } );
    this._tools.presentToast( this.dataConfig.txtUpdate );
    this.dataSource.data = this.dataSource.data.filter( item => item['# PEDIDO'] !== row['# PEDIDO'] );
  }

  async handleUpdate( row:any ){
    return new Promise( resolve =>{
      this._listVe.editar( row ).subscribe( res =>{
        resolve( res );
      });
    })
  }

  async onScroll( ev: any ){
    this.quers.page++;
    let list:any = await this.getListData( );
    this.dataSource.data = _.unionBy(this.dataSource.data || [], list, 'id');
  }

  // ✅ Alternar la selección de una fila
  toggleSelection(row: any) {
    const index = this.selection.findIndex(selectedRow => selectedRow.id === row.id);
    if (index > -1) {
      this.selection.splice(index, 1);
    } else {
      this.selection.push(row);
    }
  }

  // ✅ Verifica si todas las filas están seleccionadas
  isAllSelected() {
    return this.selection.length === this.dataSource.data.length;
  }

  // ✅ Verifica si hay una selección parcial (algunas filas marcadas)
  isPartiallySelected() {
    return this.selection.length > 0 && this.selection.length < this.dataSource.data.length;
  }

  // ✅ Seleccionar/deseleccionar todas las filas
  toggleSelectAll(event: any) {
    if (event.checked) {
      this.selection = [...this.dataSource.data];
    } else {
      this.selection = [];
    }
  }

  // ✅ Función para actualizar los datos de la venta cuando se edita un campo
  async actualizarVenta(row: any) {
    console.log(`Actualizando venta: `, row);
    //alert(`Venta ID ${row.pedido} actualizada correctamente.`);
    let dataR = {
      txtR: JSON.stringify( row ),
      id: row.id
    };
    await this.handleUpdate( dataR );
    this._tools.presentToast( this.dataConfig.txtUpdate );
    // Aquí puedes hacer una petición HTTP para actualizar en la base de datos
    // this.http.put(`api/ventas/${row.pedido}`, row).subscribe();
  }

  // ✅ Función para generar guías de las ventas seleccionadas
  generarGuias() {
    this.cargando = true; // Activar spinner
    console.log('Generando guías para:', this.selection);
    //alert(`Se generaron las guías para ${this.selection.length} ventas.`);
    this._googleShet.createGuide( { 
      where:{
        listBuy: this.selection.filter( row => row.createT !== 1 && !row.numberGuide ),
        user: this.dataUser.id,
        company: this.dataUser.empresa
      }
    } ).subscribe( async ( res ) =>{
      console.log("***174", res );
      if( res.data.length ){
        for( let item of res.data ){
          let index = this.dataSource.data.findIndex(row => row['# PEDIDO'] === item.id);

          if (index !== -1) {
            console.log(`Elemento encontrado en la posición: ${index}`);
            this.dataSource.data[index].createT = 1;
            this.dataSource.data[index].photoTicket= item.sticker;
            this.dataSource.data[index].numberGuide= item.shipping_guide;
            this.dataSource.data[index].transport= item.shipping_company;
            await this.handleUpdate( { 
              id: this.dataSource.data[index].id, 
              createT: 1, 
              photoTicket: item.sticker, 
              numberGuide: item.shipping_guide, 
              transport: item.shipping_company,
              printInt: 1
             } );
          } else {
            console.log("Elemento no encontrado");
          }
          //this.dataSource.data = this.dataSource.data.filter( row => row['# PEDIDO'] !== item.id );
        }
        console.log("**195", this.dataSource.data)
        this._tools.presentToast( this.dataConfig.txtUpdate ); 
      }
      // ❌ Marcar las filas con error en rojo
      if (res.error.length) {
        for (let item of res.error) {
          let row = this.dataSource.data.find(row => row['# PEDIDO'] === item.id);
          if (row) {
            row.createT = 3;
            await this.handleUpdate( { id: row.id, createT: 3 } );
          }
        }
        this._tools.presentToast( this.dataConfig.txtError );
      }
      this.cargando = false; // Desactivar spinner al completar
    }, ()=>this.cargando = false );
  }
  imprimirGuia() {
    console.log('Imprimiendo guía para:', this.selection);
    this.cargando2 = true; // Activar spinner
    const urlsPDF:any = this.selection.map(async (row) => {
      await this.handleUpdate( { id: row.id, printInt: 2 } );
      return row.photoTicket;
    }); // Lista de URLs de los PDFs
    console.log("**243", urlsPDF );
    this._tools.unirPDFs(urlsPDF).then(mergedPdfBlob => {
      const url = URL.createObjectURL(mergedPdfBlob);
      window.open(url, '_blank'); // Abre el PDF combinado en otra ventana para imprimir
      this.cargando2 = false;
    }).catch(error => {
      console.error('Error al unir los PDFs:', error);
      this.cargando2 = false;
    });
    //window.print(); // Esto abrirá la ventana de impresión
  }

    // Abrir SweetAlert2 para editar productos seleccionados
    async editarProductosSeleccionados() {
      const seleccionados = this.selection;
      
      if (seleccionados.length === 0) {
        this._tools.basic( 'No has seleccionado ningún producto' );
        return;
      }
      let result:any = await this._tools.alertInput( 
        {
          title: 'Editar Producto',
          input: 'text',
          inputLabel: 'Nuevo nombre para los productos seleccionados',
          inputPlaceholder: 'Escribe el nuevo título...',
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar'
        }
      );
      if (result.isConfirmed && result.value.trim() !== '') {
        seleccionados.forEach(async (row) => {
          row['TITULO PRODUCTO'] = result.value;
          await this.actualizarVenta( row );
         }
        );
      }
    }

}