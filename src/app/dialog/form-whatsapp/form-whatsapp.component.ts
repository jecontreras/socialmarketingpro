
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { USERT, Fruit } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponent/archivos.service';
import { GaleriaService } from 'src/app/servicesComponent/galeria.service';
import * as _ from 'lodash';
import { ExcelService } from 'src/app/services/excel.service';
import { CompanyServiceService } from 'src/app/servicesComponent/company-service.service';
import { MessageService } from 'src/app/servicesComponent/message.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { FileDetailComponent } from '../file-detail/file-detail.component';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[][];
}

@Component({
  selector: 'app-form-whatsapp',
  templateUrl: './form-whatsapp.component.html',
  styleUrls: ['./form-whatsapp.component.scss']
})
export class FormWhatsappComponent implements OnInit {
  dataConfigs:any = {};
  id:any;
  btnDisabled:boolean = false;
  dataUser:USERT = {};
  titulo:string = "Detallado";
  data:any = {
    tipoEnvio: '2',
    listEmails: [],
    listRotador: [],
    pausar: true,
    cantidadTiempoMensaje: 25,
    tiempoMsxPausa: 60,
    cantidadMsxPausa: 10,
    rotadorMensajes: true
  };
  editorConfig: any;
  listPlataforma:any = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  intervalo:any;

  listNumerosGr = [];
  listCompletaNumeroGr = [];
  files:any = [];
  listDePlataforma:any = [];
  counstNumero:number = 0;
  notscrolly:boolean=true;
  notEmptyPost:boolean = true;
  coint:number;

  dataTable: DataTable;
  pagina = 10;
  loader:boolean = false;
  query:any = {
    where:{
      estado: 0
    },
    sort: "createdAt DESC",
    page: 0,
    limit: 100
  };
  Header:any = [ 'Acciones','Mensaje de','Para de','Mandado','Mensaje','Oferta','Estado', 'Creado' ];
  dataConfig:any = {
    vista: "whatsap"
  };

  constructor(
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    private _config: ConfigKeysService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private activate: ActivatedRoute,
    private _mensajes: MessageService,
    private _empresas: CompanyServiceService,
    public dialog: MatDialog,
    private excelSrv: ExcelService,
    private _archivos: ArchivosService,
    private _galeria: GaleriaService,
    public dialogRef: MatDialogRef<FormWhatsappComponent>
  ) {
    this.dataConfig = this._config._config.keys;
    this.id = this.datas.id || '';
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  async ngOnInit() {
    this.dataTable = {
      headerRow: this.Header,
      footerRow: this.Header,
      dataRows: []
    };
    this.getEmpresas();
    await this.cargarTodos();
    this.id = this.datas.id;
    if( this.id ) {
      await this.getMensaje();
      await this.getIdGaleria( );
      this.intervalo = setInterval(()=>{
        this.getFoto();
      }, 3000)
    }
    else {
      this.data.creado = this.dataUser.id;
      this.data.creadoEmail = this.dataUser.email;
      this.agregarMasRotador();
    }
  }
  ngOnDestroy(){
    clearInterval( this.intervalo );
  }

  async getIdGaleria(){
    return new Promise( resolve =>{
      this._galeria.get( { where: { }, limit: 1 } ).subscribe(
        (res: any) => {
          resolve( res );
      });
    });
  }

  getFoto(){
    this._mensajes.get( { where: { id: this.id }}).subscribe((res:any)=>{
      res = res.data[0];
      if( !res ) return false;
      this.data.imagenWhat = res.imagenWhat;
    });
  }

  async getMensaje(){
    return new Promise( resolve =>{
      this._mensajes.get( { where: { id: this.id }}).subscribe((res:any)=>{
        res = res.data[0];
        if( !res ) return resolve( false );
        this.data = res;
        if( this.data.empresa ) this.data.empresa = this.data.empresa.id;
        this.data.listEmails = [];
        this.onSelectPlt( );
        let selecciono = this.dataTable.dataRows.find( ( item:any ) => item.id == this.data.listRotador2 );
        this.dataConfig.id = this.data.listRotador2;
        this.seleccion( selecciono );
        try {
          this.data.listRotador = _.map( this.data.listRotador, ( item:any )=>{
            return {
              files: [],
              ...item
            }
          })
        } catch (error) { }
        this.ProsesoMensajes();
        console.log( this.data)
        resolve( true );
      });
    })
  }

  async onSelectPlt( ){
    if( this.listPlataforma.length === 0 ) await this.getEmpresas();;
    this.listDePlataforma=[];
    let filtro = _.find( this.listPlataforma, ( item:any )=> item.id == this.data.empresa );
    console.log("***", this.data, filtro )
    if( !filtro ) {return false};
    if( !filtro.cantidadLista ) return false;
    for(let i=0; i< filtro.cantidadLista; i++ ){
      this.listDePlataforma.push ( { titulo: "lista "+Number( i + 1 ), id: i+1 } );
    }
  }

  ProsesoMensajes(){
    this._mensajes.getMensajeNumero( { where:{ mensaje: this.data.id }, sort: "createdAt ASC" } ).subscribe(( res:any )=>{
      res = res.data;
      for( let row of res ){
        this.listCompletaNumeroGr.push( row );
        for( let key of row.numerosPendientes || []){
          this.counstNumero++;
          this.data.listEmails.push( { username: key.username || ' ', telefono: key.telefono || '000', id: row.id } );
          this.listNumerosGr.push( { username: key.username || ' ', telefono: key.telefono || '000', id: row.id} );
        }
        for( let key of row.numerosCompletados || [] ){
          this.counstNumero++;
          this.data.listEmails.push( { username: key.username || ' ', telefono: key.telefono || '000', id: row.id } );
          this.listNumerosGr.push( { username: key.username || ' ', telefono: key.telefono || '000', id: row.id } );
        }
      }
    });
  }

  getEmpresas(){
    return new Promise( resolve =>{
      this._empresas.get({ where: { estado: 0 }, limit: -1}).subscribe((res:any)=>{
        this.listPlataforma = res.data;
        if( this.dataUser.rol.nombre !== 'admin' ) this.listPlataforma = this.listPlataforma.filter( row => row.id === '6456728a45ce5d0014db2870');
        resolve( true );
      });
    })
  }

  async enviar(){
    this.btnDisabled=true;
    let data = _.omit( this.data, ['listEmails']);
    this._tools.ProcessTime({ title: 'cargando', tiempo: 9000 });
    this._mensajes.create( this.data ).subscribe((res:any)=>{
      this._tools.presentToast("Whatsapp Enviados");
      this.id = res.data.id;
      if( this.data.listEmails[0] ) this.procesoGuardarNumeros();
      else this._mensajes.getPlataformas( { url: res.data.empresa.urlRespuesta, id: this.id, cantidadLista: this.data.cantidadLista, plataforma: this.data.empresa, idLista: this.data.idLista } ).subscribe(( res:any )=>{ this.btnDisabled=false; }, error => this.btnDisabled=false );
      this.getMensaje();
      this.data = {};
      this.closeDialog([]);
    },(error)=> { this._tools.presentToast("Error al envio de Whatsapp"); this.btnDisabled=false;})
  }

  procesoGuardarNumeros(){
    let listaFinal:any = [];
    for( let row of this.data.listEmails ){
      let filtro = this.listNumerosGr.find( ( item:any )=> item.telefono == row.telefono );
      if( !filtro ) listaFinal.push( row );
    }
    let data:any = {
      mensaje: this.id,
      numerosPendientes: listaFinal
    };
    this._mensajes.savedMensajeNumero( data ).subscribe(( res:any )=>{});
  }

  actualizar(){
    this.btnDisabled=true;
    let data = _.omit( this.data, ['creado', 'createdAt', 'updatedAt', 'listEmails']);
    data = _.omitBy( data, _.isNull);
    this._mensajes.update( data ).subscribe((res:any)=>{
      this._tools.presentToast("Whatsapp Actualizado");
      this.procesoGuardarNumeros();
      this.btnDisabled=false;
      this.closeDialog([]);
    },(error)=> { this._tools.presentToast("Error en el Actualizado"); this.btnDisabled=false;})
  }

  renvio(){
    this.btnDisabled=true;
    this.data = _.omit(this.data, ['empresa', 'creado', 'createdAt', 'updatedAt', 'listEmails']);
    this.data.estadoActividad = false;
    this.data = _.omitBy( this.data, _.isNull);
    this._mensajes.renvio( this.data ).subscribe((res:any)=>{
      this._tools.presentToast("Whatsapp Renviado");
      this.btnDisabled=false;
    },(error)=> { this._tools.presentToast("Error al renvio de Whatsapp"); this.btnDisabled=false;})
  }

  transformar(){
    let obj:string = "";
    let formatiando:any = [];
    for( let row of this.data.listEmails ) formatiando.push( { telefono: row.usu_telefono, username: row.usu_nombre } );
    if( Object.keys(formatiando).length > 0 ) obj = formatiando.join();
    return obj;
  }

  eventoDescripcion(){}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      let validando = value.split(".");
      if( !validando[1] ) {}
      else{
        let username = validando[0];
        let telefono = validando[1];
        this.data.listEmails.push({ username: username, telefono: telefono.trim(), id: this.codigo() });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  async remove(fruit: Fruit) {
    const index = this.data.listEmails.indexOf(fruit);

    if (index >= 0) {
      console.log( this.data.listEmails[index] );
      if( this.data.listEmails[index].id ) await this.ProcesoEliminarNumero( index );
      this.data.listEmails.splice(index, 1);
    }
  }

  async ProcesoEliminarNumero( index ){
    return new Promise( resolve =>{
      let filtro:any = this.listCompletaNumeroGr.find(( item:any ) => item.id == this.data.listEmails[ index ].id );
      if( !filtro ) return false;
      if( filtro.numerosPendientes ) filtro.numerosPendientes = filtro.numerosPendientes.filter( ( item:any )=> item.telefono !== this.data.listEmails[ index ].telefono );
      if( filtro.numerosCompletados ) filtro.numerosCompletados = filtro.numerosCompletados.filter( ( item:any )=> item.telefono !== this.data.listEmails[ index ].telefono );
      let data:any = {
        id: filtro.id,
        numerosPendientes: filtro.numerosPendientes,
        numerosCompletados: filtro.numerosCompletados
      };
      this._mensajes.editarMensajeNumero( data ).subscribe(( res:any )=> { this._tools.tooast( { title: "Borrado"}); resolve( true ); }, ()=> { this._tools.tooast( { title: 'Error', icon: "error"}); resolve( false );});
    });
  }

  codigo(){
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }

  agregarMasRotador(){
    if( !this.data.listRotador ) this.data.listRotador = [ { files: [] }];
    this.data.listRotador.push({
      id: this.codigo(),
      files: []
    });
  }

  eliminarMensajes( item:any ){
    this.data.listRotador = this.data.listRotador.filter( ( row:any ) => row.id != item.id );
    this.nexProceso();
  }

  guardarMensajes(){
    if( !this.id ) return false;
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    this.nexProceso();
  }

  nexProceso(){
    let data:any = {
      id: this.data.id,
      listRotador: this.data.listRotador.filter(( item:any ) => item.mensajes )
    };
    if( !data.id ) { this.btnDisabled = false; return false; }
    for( let item of this.data.listRotador ) item.files = [];
    this._mensajes.update( data ).subscribe(( res:any )=>{
      this._tools.presentToast( 'Actualizado rotador mensajes...' );
      this.btnDisabled = false;
    },(error)=>{ this._tools.presentToast( 'Error al actualizar...' ); this.btnDisabled = false; });
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) return false;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;
      const data = <any[]>this.excelSrv.importFromFile(bstr);
      const importedData = data.slice(1, -1);
      console.log( "esto es",importedData );
      this.counstNumero = importedData.length
      let lista:any = [];
      for( let row of importedData ){
        if( !row[1] ) continue;
        lista.push( {
          username: row[0] || " ",
          telefono: row[1]
        });
      }
      this.trasnFormVer( lista );
    };
    reader.readAsBinaryString(target.files[0]);
  }
  trasnFormVer( lista:any ){
      for(let row of lista) {
        let filtro = this.data.listEmails.find( ( item:any ) => item.telefono == row.telefono );
        if( !filtro ) this.data.listEmails.push( { username: row.username, telefono: row.telefono } );
      }
  }

  pushImg( item:any ){
    if( !item.galeriaList ) item.galeriaList = [];
    item.galeriaList.push( { id: this._tools.codigo() } )
  }

  eliminarFoto( item:any, id:any ){
    //console.log( item, id )
    item.galeriaList = item.galeriaList.filter( ( row:any ) => row.id != id );
    this.nexProceso();
  }

  updateImgList( item:any ){
    this.nexProceso();
  }

  onSelects(event: any, item:any ): void {
    //console.log( event );
    item.files= event.addedFiles;
  }

  async subirFile( item:any ) {
    return new Promise( async ( resolve ) =>{
      for( let row of item.files ){
        let form: any = new FormData();
        form.append('file', row );
        //this._tools.ProcessTime({});
        //console.log( form, this.files )
        if( !item.galeriaList ) item.galeriaList = [];
        let resultFile = await this.createFile( form );
        if( !resultFile ) continue;
        item.galeriaList.push( { id: this._tools.codigo(), foto: resultFile } );
        this.nexProceso();
      }
      item.files = [];
      resolve( true );
    });
  }

  createFile( form:any ){
    return new Promise( async ( resolve ) =>{
      let res:any = await  this._archivos.create( form );
      if( !res ){
        console.error("error"); this._tools.presentToast("Error de servidor"); resolve( false );
      }
      this._tools.presentToast("Exitoso");
      resolve( res.files );
    });
  }

  onRemoves( event:any, item:any ) {
    //console.log(event);
    item.files.splice( item.files.indexOf( event ), 1 );
  }

  onScroll(){
    console.log("*************Men")
    if (this.notscrolly && this.notEmptyPost) {
       this.notscrolly = false;
       this.query.page++;
       this.cargarTodos();
     }
   }

   cargarTodos() {
    return new Promise( resolve =>{
      if( this.dataUser.rol.nombre !== 'admin') this.query.where.user = this.dataUser.id;
      this._galeria.get(this.query)
      .subscribe(
        (response: any) => {
          this.coint= response.count;
          this.dataTable.headerRow = this.dataTable.headerRow;
          this.dataTable.footerRow = this.dataTable.footerRow;
          this.dataTable.dataRows.push(... response.data);
          this.dataTable.dataRows =_.unionBy(this.dataTable.dataRows || [], response.data, 'id');
          this.loader = false;

            if (response.data.length === 0 ) {
              this.notEmptyPost =  false;
            }
            this.notscrolly = true;
            resolve( true );
        },
        error => {
          console.log('Error', error);
          this.loader = false;
          resolve( false );
        });
    });
   }

   seleccion( item:any ){
    console.log("**", item )
    if( !item ) return;
    for(let row of this.dataTable.dataRows ) row['check'] = false;
    item.check = !item.check;
    this.data.listRotador2 = item.id;
   }

   handleOpenG(){
    const dialogRef = this.dialog.open(FileDetailComponent, {
      width: '50%',
      height: "600px",
      data: {
        format: 'photo',
        user: this.dataUser
      },
    });
    dialogRef.afterClosed().subscribe(async  ( result ) => {
      console.log('The dialog was closed', result );
    });
   }

   closeDialog( list ){
    this.dialogRef.close( list );
  }

}
