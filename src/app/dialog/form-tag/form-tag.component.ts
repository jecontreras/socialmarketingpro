import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TAG, USERT } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { TagService } from 'src/app/servicesComponent/tag.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-form-tag',
  templateUrl: './form-tag.component.html',
  styleUrls: ['./form-tag.component.scss']
})
export class FormTagComponent implements OnInit {
  dataConfig:any = {};
  id:any;
  data:TAG = {};
  btnDisabled:boolean = false;
  dataUser:USERT = {};

  constructor(
    private _config: ConfigKeysService,
    private _store: Store<STORAGES>,
    public dialogRef: MatDialogRef<FormTagComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _tools: ToolsService,
    private _tagServices: TagService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
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
      data.user = this.dataUser.cabeza;
      let result:any = await this.handleCreate( data );
      if( !result.id ) this._tools.basic( this.dataConfig.txtError );
      else this._tools.basic( this.dataConfig.txtCreate );
    }
    this.btnDisabled = false;
    this.closeDialog();
  }

  handleUpdate( data:TAG ){
    return new Promise( resolve =>{
      data = _.omit(data, [ 'user' ])
      data = _.omitBy(data, _.isNull);
      this._tagServices.update( data ).subscribe( res =>{
        resolve( res );
      },( error)=> resolve( error ) );
    })
  }

  handleCreate( data:TAG ){
    data = _.omitBy(data, _.isNull);
    return new Promise( resolve =>{
      this._tagServices.create( data ).subscribe( res =>{
        resolve( res );
      },( error)=> resolve( error ) );
    })
  }


  closeDialog(){
    this.dialogRef.close();
  }


}
