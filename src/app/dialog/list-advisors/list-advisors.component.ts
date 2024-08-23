import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { UserAdiviserService } from 'src/app/servicesComponent/user-adiviser.service';
import { UsuariosService } from 'src/app/servicesComponent/usuarios.service';

@Component({
  selector: 'app-list-advisors',
  templateUrl: './list-advisors.component.html',
  styleUrls: ['./list-advisors.component.scss']
})
export class ListAdvisorsComponent implements OnInit {
  dataConfig:any = {};
  dataUser:USERT = {};
  id:any;
  btnDisabled:boolean = false;
  listAdvisors:USERT[]= [];

  constructor(
    private _config: ConfigKeysService,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ListAdvisorsComponent>,
    private _userServices: UsuariosService,
    private _userAdiviser: UserAdiviserService

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
    let resUser:any = await this.getUser();
    this.listAdvisors =  resUser;
  }

  getUser(){
    return new Promise( resolve =>{
      this._userServices.querysAdviser( { where: { cabeza: this.dataUser.cabeza, rol: 'usuario' }, limit: 1000, page:0 } ).subscribe( res => resolve( res.data ), error => resolve( error ) );
    })
  }

  handleSubmit(){
    for( let item of this.listAdvisors ){
      if( item.check === true ){
        let ds = {
          userHead: this.dataUser.id,
          user: item.id,
          percentage: item.percentage
        };
        this.handleProcessCreate( ds );
      }else{
        if( item.idUserAdviser ) {
          let ds = {
            id: item.idUserAdviser,
            state: "inactivo"
          };
          this.handleProcessUpdate( ds );
        }
      }
    }
  }

  handleProcessCreate( data ){
    return new Promise( resolve =>{
      this._userAdiviser.create( data ).subscribe( res => resolve( res ) , ( error )=> resolve( error ) );
    });
  }

  handleProcessUpdate( data ){
    return new Promise( resolve =>{
      this._userAdiviser.update( data ).subscribe( res => resolve( res ) , ( error )=> resolve( error ) );
    });
  }

}
