import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { InfoWhatsappService } from 'src/app/servicesComponent/info-whatsapp.service';
import { Store } from '@ngrx/store';
import { WhatsappInfoService } from 'src/app/servicesComponent/whatsapp-info.service';
import { USER } from 'src/app/interfaces/user';
import { GaleriaService } from 'src/app/servicesComponent/galeria.service';
import * as _ from 'lodash';
import { MatChipInputEvent } from '@angular/material/chips';
import { FLOWS, INDICATOR } from 'src/app/interfaces/interfaces';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormFlowsComponent } from 'src/app/dialog/form-flows/form-flows.component';

@Component({
  selector: 'app-form-flows-hs',
  templateUrl: './form-flows-hs.component.html',
  styleUrls: ['./form-flows-hs.component.scss']
})
export class FormFlowsHsComponent implements OnInit {
  @Input() dataId:FLOWS = {};
  data:any = {

  };
  titulo:string="Crear"
  listLogic:any = [
    {
      indicador: "",
      urlMedios: "",
      listFollowing: [],
      listButton: [],
      respuesta: ``
    },
  ];
  listTypeAction:string[] = [
    "img",
    "video",
    "pdf",
    "audio",
    "txt",
    "button"
  ];
  disableBtn:boolean = false;
  id:string;
  dataUser:any = {};
  listGaleria:any = [];
  listWhatsappInfo:any = [];

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  dataConfig:any = {};
  views:string = "one";
  disabledFunctionApi:boolean = true;

  constructor(
    private _logicWhatsapp: InfoWhatsappService,
    private _Tools: ToolsService,
    private _store: Store<USER>,
    private _galeria: GaleriaService,
    private _whatsappInfo: WhatsappInfoService,
    private _config: ConfigKeysService,
    public dialogRef: MatDialogRef<FormFlowsComponent>,
    public dialog: MatDialog
  ) {
    this.dataConfig = this._config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user;
    });
  }

  async ngOnInit() {
    /*this.id = (this.activate.snapshot.paramMap.get('id'));
    if( this.id ) this.getId();*/
    if( this.dataId.id && !this.dataId.views ) {
      this.data = await this.getFlowId( this.dataId.id ); this.dataId;
      this.id = this.data.id;
      this.listLogic = this.data.listLogic;
      try {
        this.data.numero = this.data.numero.id;
      } catch (error) {

      }
    }else{
      this.views = this.dataId.views || 'one';
      if( this.views === 'button' ){
        this.disabledFunctionApi = false;
        try {
          if( this.dataId.listLogic.listLogic.length ){
            this.listLogic = this.dataId.listLogic.listLogic.filter( row => row.indicadorButton === this.dataId.id );
            this.id = this.dataId.listLogic.id;
          }else{
            this.listLogic= [
              {
                indicador: this.dataId.indicador,
                indicadorButton: this.dataId.id,
                urlMedios: "",
                listFollowing: [],
                listButton: [],
                respuesta: ""
              }
            ]
          }
        } catch (error) {
          this.listLogic= [
            {
              indicador: this.dataId.indicador,
              indicadorButton: this.dataId.id,
              urlMedios: "",
              listFollowing: [],
              listButton: [],
              respuesta: ""
            }
          ]
        }
      }
      console.log("ELSE", this.dataId)
    }
    console.log("***", this.data)
    this.getGaleria();
    this.getWhatsappInfo();
  }

  getFlowId( id ){
    return new Promise( resolve =>{
      this._logicWhatsapp.get( { where: { id: id }, limit: 1 } ).subscribe( res =>{
        res = res.data[0];
        resolve( res );
      }, ( )=> resolve( {} ) );
    });
  }

  getId(){
    this.titulo = "actualizar"
    this._logicWhatsapp.get( { where: { id: this.id } } ).subscribe( res => {
      res = res.data[0];
      this.data = res;
      this.listLogic = res.listLogic;
      try {
        this.data.numero = res.numero.id;
      } catch (error) {

      }
    })
  }

  getGaleria(){
    this._galeria.get( { where: { user: this.dataUser.id, estado: 0 }, limit: 100000 } ).subscribe( res => {
      this.listGaleria = res.data;
    });
  }

  getWhatsappInfo(){
    this._whatsappInfo.get( { where: { user: this.dataUser.id }, limit: 100000 } ).subscribe( res => {
      this.listWhatsappInfo = res.data;
    });
  }

  handleDropList(){
    this.listLogic = [{
      listButton:[],
      listFollowing: []
    }];
  }


  handlePushList(){
    this.listLogic.push( { } );
  }

  handleDrop(item, idx){
    console.log("***221", item, idx)
    if ( item.id ) {
      this.handleUpdateDetails( item );
      this.listLogic.splice(idx, 1);
    }
    else this.listLogic.splice(idx, 1);
  }

  async handleSubmit(){
    if( this.disabledFunctionApi === false ) {
      this.closeDialog( { detalle: this.data, listDetails: this.listLogic } );
      return false;
    }
    if( this.disableBtn ) return false;
    this.disableBtn = true;
    if( this.id ) await this.handleUpdate();
    else await this.handleCreate();
    this.closeDialog({});
    this.disableBtn = false;
  }

  handleCreate(){
    return new Promise( resolve => {
      this.data.user = this.dataUser.id;
      this._logicWhatsapp.create( {
        detalle: this.data,
        listDetails: this.listLogic
      }).subscribe( res =>{
        this._Tools.tooast( { title: "Creado logica Whatsapp"} );
        resolve( true );
      },()=> resolve( false ) );
    })
  }

  handleUpdate(){
    return new Promise( resolve =>{
      let data = this.data;
      data = _.omit(data, [ 'listLogic','user' ])
      data = _.omitBy(data, _.isNull);
      this._logicWhatsapp.update( {
        detalle: data,
        id: this.data.id,
        listDetails: this.listLogic
      }).subscribe( res =>{
        this._Tools.tooast( { title: "Autualizado logica Whatsapp"} );
        this.listLogic = res || [];
        resolve( true );
      }, ()=> resolve( false ) );
    });
  }

  handleUpdateDetails( item:any ){
    return new Promise( resolve =>{
      if( !item.id ) return resolve( true );
      //if( this.disabledFunctionApi === false ) return resolve( true );
      this._logicWhatsapp.updateWhatsappDetalle( {
        detalle: {
          estado: 1
        },
        id: item.id
      }).subscribe( res =>{
        this._Tools.tooast( { title: "Eliminado Item"} );
        resolve( true );
      }, ()=> resolve( false ) );
    });
  }

  add(event: MatChipInputEvent, item ): void {
    const input = event.input;
    const value = event.value;
    console.log( value )
    if( !item.deepIndicator ) item.deepIndicator = []
    // Add our fruit
    if ((value || '').trim()) {
      item.deepIndicator.push(
        {
          txt: value
        });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  addListButtonShift(event: MatChipInputEvent, item ): void {
    const input = event.input;
    const value = event.value;
    console.log( value )
    if( !item.listButton ) item.listButton = []
    // Add our fruit
    if ((value || '').trim()) {
      item.listButton.push(
        {
          text: value,
          id: this._Tools.codigo()
        });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  addNextSequence(event: MatChipInputEvent, item ): void {
    const input = event.input;
    const value = event.value;
    console.log( value )
    if( !item.listFollowing ) item.listFollowing = []
    // Add our fruit
    if ((value || '').trim()) {
      item.listFollowing.push(
        {
          idFollowing: value
        });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  async remove(fruit: INDICATOR, item) {
    const index = item.deepIndicator.indexOf(fruit);

    if (index >= 0) {
      console.log( item.deepIndicator[index] );
      item.deepIndicator.splice(index, 1);
    }
  }

  async removelistButton(txtButtonShift: string, item) {
    const index = item.listButton.indexOf(txtButtonShift);

    if (index >= 0) {
      console.log( item.listButton[index] );
      item.listButton.splice(index, 1);
    }
  }

  async removeNextSequence(txtButtonShift: string, item) {
    const index = item.listFollowing.indexOf(txtButtonShift);

    if (index >= 0) {
      console.log( item.listFollowing[index] );
      item.listFollowing.splice(index, 1);
    }
  }

  handleDouble( item:any ){
      let data = _.clone( item );
      data.indicador = "clone " + data.indicador;
      this.listLogic.push( { ...data } );
  }

  closeDialog( obj:any ){

    this.dialogRef.close( obj || null );
  }

  handleOpenFlow( button, row ){
    button.idInfoWhatsapp = this.data.id;
    button.views = 'button';
    button.indicador = row.indicador;
    button = {
      ...button,
      listLogic: row
    }
    const dialogRef = this.dialog.open(FormFlowsComponent, {
      width: '100%',
      data: button || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if( !result ) return false;
      if( this.views === 'one'){
        if( !row.listButtonLogic ) row.listButtonLogic = [];
        for( let itemD of result.listDetails ){
          itemD.indicadorButton = button.id;
          row.listButtonLogic.push( itemD );
        }
      }
      if( this.views === 'button'){
        if( !row.listButtonLogic ) row.listButtonLogic = [];
        for( let itemD of result.listDetails ){
          itemD.indicadorButton = button.id;
          row.listButtonLogic.push( itemD );
        }
      }
      console.log("******344", this.listLogic, this.data )
    });
  }

}
