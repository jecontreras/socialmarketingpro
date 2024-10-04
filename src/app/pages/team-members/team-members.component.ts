import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ROL, USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { PerfilService } from 'src/app/servicesComponent/perfil.service';
import { UsuariosService } from 'src/app/servicesComponent/usuarios.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ListAdvisorsComponent } from 'src/app/dialog/list-advisors/list-advisors.component';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {
  dataUser: USERT;
  data:USERT = {};
  dataConfig:any = {};
  listUser: USERT[] = [];
  listRole: ROL[]= [];

  constructor(
    private _store: Store<USER>,
    private _config: ConfigKeysService,
    private _userServices: UsuariosService,
    private _toolsService: ToolsService,
    private _rol: PerfilService,
    public dialog: MatDialog
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    this.dataConfig = _config._config.keys;
  }

  async ngOnInit() {
    let resul:any = await this.getUser( );
    resul = _.map( resul, ( item )=> {
      item.rol = item.rol.id;
      return item;
    })
    this.listUser = resul;
    let rolList:any = await this.getRol();
    if( this.dataUser.rol.nombre !== 'admin' ) this.listRole = rolList.filter( row => row.nombre !== 'admin' )
    this.listRole = rolList;
  }

  getRol(){
    return new Promise( resolve =>{
      this._rol.get( { where: { estado: 'activo' }, limit: 1000, page:0 } ).subscribe( res => resolve( res.data ), error => resolve( error ) );
    })
  }

  getUser(){
    return new Promise( resolve =>{
      this._userServices.get( { where: { cabeza: this.dataUser.cabeza }, limit: 1000, page:0 } ).subscribe( res => resolve( res.data ), error => resolve( error ) );
    })
  }

  async handleSubmit(){
    let data = {... this.data };
    if( !data.id ) {
      await this.handleCreateUser( data );
      let resul:any = await this.getUser( );
      this.listUser = resul;
    }
    else {
      if( this.data.password ) this.handleUpdatePassword( data );
      //delete data.rol;
      if( data.rol.id ) data.rol = data.rol.id;
      this.handleUpdateUser( data );
    }
    this._toolsService.presentToast(this.dataConfig.txtUpdate );
  }

  handleUpdatePassword( data ){
    return new Promise( resolve =>{
      this._userServices.keyChange( { id: data.id, password: data.password } ).subscribe( res => resolve( res ), error => resolve( error ) );
    })
  }

  handleCreateUser( data ){
    return new Promise( resolve =>{
      data.cabeza = this.dataUser.cabeza;
      data.rol = "usuario";
      data.empresa = this.dataUser.empresa;
      this._userServices.create( data ).subscribe( res => resolve( res ), error => resolve( error ) );
    })
  }

  handleUpdateUser( data ){
    return new Promise( resolve =>{
      this._userServices.update( data ).subscribe( res => resolve( res ), error => resolve( error ) );
    })
  }

  handleOpenListAdvisors( ){
    const dialogRef = this.dialog.open(ListAdvisorsComponent, {
      width: '100% !important',
      data: this.data || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleEventUser( item ){
    this.data = item;
  }

  handleClean(){
    this.data = {};
  }


}
