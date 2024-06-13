import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponent/archivos.service';
import { GaleriaMensajeService } from 'src/app/servicesComponent/galeria-mensaje.service';
import { GaleriaService } from 'src/app/servicesComponent/galeria.service';

@Component({
  selector: 'app-open-galleria',
  templateUrl: './open-galleria.component.html',
  styleUrls: ['./open-galleria.component.scss']
})
export class OpenGalleriaComponent implements OnInit {
  dataConfig:any = {};
  dataUser:USERT = {};
  id:any;
  titulo:string = "Detallado";
  data:any = {
    listRotador: [],
  };
  editorConfig: any;
  listPlataforma:any = [];
  btnDisabled:boolean = false;
  @Input() _dataConfig: any = {};

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  intervalo:any;

  listNumerosGr = [];
  listCompletaNumeroGr = [];
  files:any = [];
  listDePlataforma:any = [];
  counstNumero:number = 0;

  constructor(
    private _config: ConfigKeysService,
    private _store: Store<STORAGES>,
    public dialogRef: MatDialogRef<OpenGalleriaComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService,
    private activate: ActivatedRoute,
    public dialog: MatDialog,
    private _archivos: ArchivosService,
    private _galeria: GaleriaService,
    private _galeriaMensaje: GaleriaMensajeService,
    private Router: Router,
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    console.log( this.datas )
    try {
      this.id = this.datas.id;
      if( this.id ) this.getGaleria();
    } catch (error) {

    }
    this.agregarMasRotador();
  }

  ngOnDestroy(){
    clearInterval( this.intervalo );
  }

  getGaleria(){
    return new Promise( resolve =>{
      if( !this.id ) return resolve( false );
      this._galeria.get( { where: { id: this.id } } ).subscribe( ( res:any )=>{
        res = res.data[0];
        this.data = res || {};
        resolve( true );
      },()=> resolve( false ) );
    });
  }

  async submit(){
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    if( !this.id ) await this.crearGaleria();
    else this.actualizarGaleria();
    this.btnDisabled = false;
  }

  crearPadre(){
    return new Promise( resolve =>{
      let data:any = {
        titulo: this.data.titulo,
        user: this.dataUser.id
      };
      this._galeria.saved( data ).subscribe( ( res:any ) =>{
        this.id = res.id;
        resolve( res );
      },( )=> resolve( false ) );
    });
  }

  crearGaleria(){
    return new Promise( async( resolve ) =>{
      this.data.user = this.dataUser.id;
      this._galeria.saved( { data: this.data } ).subscribe( ( res:any ) =>{
        this._tools.presentToast("Agregado Galeria...");
        this.Router.navigate( ['/dashboard/galeriaform', res.id ] );
        resolve( true );
      },( ) => resolve( false ) );
    });

  }

  actualizarGaleria(){
    return new Promise( resolve =>{
      this._galeria.editar( this.data ).subscribe( ( res:any )=>{
        this._tools.presentToast("Actualizado Correcto...");
        resolve( true );
      },()=> { this._tools.presentToast("Problemas al Actualizado..."); resolve( false ); });
    });
  }

  agregarMasRotador(){
    if( !this.data.listRotador ) this.data.listRotador = [ { files: [] }];
    this.data.listRotador.push({
      //id: this._tools.codigo(),
      files: []
    });
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
        //let resultFile = await this.createFile( form );
        /*if( !resultFile ) continue;
        item.galeriaList.push( { id: this._tools.codigo(), foto: resultFile } );*/
      }
      item.files = [];
      if( this.id ) this.submit();
      resolve( true );
    });
  }

  createFile( form:any ){
    /*return new Promise( resolve =>{
      this._archivos.create( form ).subscribe((res: any) => {
        //console.log(res);
        this._tools.presentToast("Exitoso");
        resolve( res.files );
      }, (error) => { console.error(error); this._tools.presentToast("Error de servidor"); resolve( false ); });
    });*/
  }

  onRemoves( event:any, item:any ) {
    //console.log(event);
    item.files.splice( item.files.indexOf( event ), 1 );
  }

  eliminarFoto( item:any, id:any ){
    //console.log( item, id )
    item.galeriaList = item.galeriaList.filter( ( row:any ) => row.id != id );
    if( this.id ) this.submit();
  }

  eliminarMensajes( item:any ){
    this._galeriaMensaje.delete( item ).subscribe( ( res:any )=>{
      this._tools.presentToast("Mensaje eliminado...");
      this.data.listRotador = this.data.listRotador.filter( ( row:any ) => row.id != item.id );
    } ,( )=> this._tools.presentToast("Problemas para eliminar...") );
  }


  guardarMensajes(){
    if( !this.id ) return false;
    this.submit();
  }

  nexProceso(){
    let data:any = {
      id: this.data.id,
      listRotador: this.data.listRotador.filter(( item:any ) => item.mensaje )
    };
    if( !data.id ) { this.btnDisabled = false; return false; }
    for( let item of this.data.listRotador ) item.files = [];
    this._galeria.editar( data ).subscribe(( res:any )=>{
      this._tools.presentToast( 'Actualizado rotador mensajes...' );
      this.btnDisabled = false;
    },(error)=>{ this._tools.presentToast( 'Error al actualizar...' ); this.btnDisabled = false; });
  }


}


export class Contact {
  name: string = "";
  email: string = "";
  phone: string = "";
  address: string = "";
}
