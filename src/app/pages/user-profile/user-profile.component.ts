import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ToolsService } from 'src/app/services/tools.service';
import { UsuariosService } from 'src/app/servicesComponent/usuarios.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  dataUser:USERT = {};
  data:USERT = {};

  constructor(
    private _store: Store<USER>,
    private _user: UsuariosService,
    private _tools: ToolsService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    this.data = this.dataUser;
  }

  handleUpdateProfile(){
    this._user.update( { id: this.dataUser.id } ).subscribe( res => this._tools.tooast({ title: "actualizado" } ) );
  }

}
