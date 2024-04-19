import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Broadcast, Flows, UserT } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { MessageService } from 'src/app/servicesComponent/message.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';

@Component({
  selector: 'app-form-broadcast',
  templateUrl: './form-broadcast.component.html',
  styleUrls: ['./form-broadcast.component.scss']
})
export class FormBroadcastComponent implements OnInit {
  dataConfig:any = {};
  id:any;
  data:Broadcast = {};
  btnDisabled:boolean = false;
  dataUser:UserT = {};
  listFlow: Flows[] = [];
  listTime = [];

  constructor(
    private _tools: ToolsService,
    private _config: ConfigKeysService,
    public dialogRef: MatDialogRef<FormBroadcastComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _messageService: MessageService,
    private _store: Store<STORAGES>,
    private _whatsappTxtService: WhatsappTxtService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
    });
    this.dataConfig = _config._config.keys;
  }

  async ngOnInit(){
    if( this.datas.id ){
      this.data = this.datas || {};
      this.id = this.data.id;
    }
    this.listTime = [
      {
        name: this.dataConfig.veryShort,
        time: 5
      },
      {
        name: this.dataConfig.short,
        time: 10
      },
      {
        name: this.dataConfig.medium,
        time: 20
      },
      {
        name: this.dataConfig.long,
        time: 30
      },
      {
        name: this.dataConfig.veryLong,
        time: 40
      },
    ];
    let result:any = await this.getFlows();
    this.listFlow = result;
  }

  getFlows(){
   return new Promise( resolve =>{
    this._whatsappTxtService.getInfoWhatsapp({
      where:{
        estado: 0
      },
      limit: 1000
    }).subscribe( res =>{
      resolve( res.data );
    });
   });
  }

  async handleSubmit(){
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    let data = {
      "tipoEnvio": "2",
      "listEmails": [],
      "listRotador": [
          {
              "id": "71J37",
              "files": []
          }
      ],
      "pausar": this.data.checkSmartDelay === 'smartDelay' ? false : true,
      "cantidadTiempoMensaje": this.data.timeMessage,
      "tiempoMsxPausa": 60,
      "cantidadMsxPausa": 10,
      "rotadorMensajes": true,
      "creado": this.dataUser.id,
      "creadoEmail": this.dataUser.email,
      "subtitulo": this.data.titulo,
      "empresa": "00000d0005ebc28d5dba6950",
      "idLista": "1",
      "idPuesto": 1,
      "cantidadLista": 1,
      "idFlows":  this.data.idFlow
    };
    if( this.id ) {
      let result:any = await this.handleUpdate( data );
      if( !result.id ) this._tools.basic( this.dataConfig.txtError );
      else this._tools.basic( this.dataConfig.txtUpdate );
    }else {
      data.creado = this.dataUser.id;
      let result:any = await this.handleCreate( data );
      if( !result.data.id ) this._tools.basic( this.dataConfig.txtError );
      else this._tools.basic( this.dataConfig.txtCreate );
    }
    this.btnDisabled = false;
  }

  handleUpdate( data ){
    return new Promise( resolve =>{
      this._messageService.update( data ).subscribe( res =>{
        resolve( res );
      },( error)=> resolve( error ) );
    })
  }

  handleCreate( data ){
    return new Promise( resolve =>{
      this._messageService.create( data ).subscribe( res =>{
        resolve( res );
      },( error)=> resolve( error ) );
    })
  }

}
