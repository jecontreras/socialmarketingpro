import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BILL, USERT } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { WhatsappInfoService } from 'src/app/servicesComponent/whatsapp-info.service';

@Component({
  selector: 'app-for-bell-dialog',
  templateUrl: './form-bell-dialog.component.html',
  styleUrls: ['./form-bell-dialog.component.scss']
})
export class FormBellDialogComponent implements OnInit {
  dataConfig:any = {};
  id:any;
  data:BILL = {};
  btnDisabled:boolean = false;
  dataUser:USERT = {};

  constructor(
    private _tools: ToolsService,
    private _config: ConfigKeysService,
    public dialogRef: MatDialogRef<FormBellDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _whatsappInfo: WhatsappInfoService,
    private _store: Store<STORAGES>,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user || {};
    });
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
    if( this.datas.id ){
      this.data = this.datas || {};
      this.id = this.data.id;
    }
  }

  async handleSubmit(){
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    if( this.id ) {
      let data = this.data;
      let result:any = await this.handleUpdate( data );
      if( !result.id ) this._tools.basic( this.dataConfig.txtError );
      else this._tools.basic( this.dataConfig.txtUpdate );
    }else {
      let data = this.data;
      data.user = this.dataUser.id;
      let result:any = await this.handleCreate( data );
      if( !result.id ) this._tools.basic( this.dataConfig.txtError );
      else this._tools.basic( this.dataConfig.txtCreate );
    }
    this.btnDisabled = false;
  }

  handleUpdate( data:BILL ){
    return new Promise( resolve =>{
      this._whatsappInfo.update( data ).subscribe( res =>{
        resolve( res );
      },( error)=> resolve( error ) );
    })
  }

  handleCreate( data:BILL ){
    return new Promise( resolve =>{
      this._whatsappInfo.create( data ).subscribe( res =>{
        resolve( res );
      },( error)=> resolve( error ) );
    })
  }

}
