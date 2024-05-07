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
      this._userServices.get( { where: { cabeza: this.dataUser.cabeza } } ).subscribe( res => resolve( res.data ), error => resolve( error ) );
    })
  }

  async handleSubmit(){
    let data = {};
    await this.handleCreateUser( data );
  }

  handleCreateUser( data ){
    return new Promise( resolve =>{
      this._userServices.create( data ).subscribe( res => resolve( res ), error => resolve( error ) );
    })
  }


}
