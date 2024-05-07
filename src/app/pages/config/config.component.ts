import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  dataConfig:any = {};
  dataUser:any = {};
  viewProfile:string = 'visitante';

  constructor(
    private _config: ConfigKeysService,
    private _store: Store<USER>,
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      try {
        this.viewProfile = this.dataUser.rol.nombre;
      } catch (error) {

      }
    });
  }

  ngOnInit(): void {
  }

}
