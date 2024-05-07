import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponent/usuarios.service';

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

  constructor(
    private _store: Store<USER>,
    private _config: ConfigKeysService,
    private _userServices: UsuariosService,
    private _toolsService: ToolsService
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
    this.listUser = resul;
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
      delete data.rol;
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

  handleEventUser( item ){
    this.data = item;
  }

  handleClean(){
    this.data = {};
  }


}
