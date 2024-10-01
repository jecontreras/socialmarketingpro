import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { USER } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { ConfigKeysService } from 'src/app/services/config-keys.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    disabled?: boolean;
}
export let ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  dataUser:any = {};
  viewProfile:string = 'visitante';
  dataConfig:any = {};

  constructor(
    private router: Router,
    private _store: Store<USER>,
    private _config: ConfigKeysService
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

  ngOnInit() {
    ROUTES = [
      { path: '/dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-primary', class: '' ,disabled: ( this.viewProfile === 'visitante' ) || ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) },
      //{ path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
      //{ path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
      { path: '/audience', title: this.dataConfig.audience,  icon:'ni-pin-3 text-orange', class: '', disabled: ( this.viewProfile === 'usuario' ) || ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) },
      { path: '/bell', title: this.dataConfig.bell,  icon:'ni-pin-3 text-orange', class: '', disabled: ( this.viewProfile === 'visitante' ) || ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) },
      { path: '/broadcast', title: this.dataConfig.broadcast,  icon:'ni-pin-3 text-orange', class: '', disabled: ( this.viewProfile === 'visitante' ) || ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) },
      { path: '/liveChat/aaaaaaaaa', title: this.dataConfig.liveChat,  icon:'ni-pin-3 text-orange', class: '', disabled: ( this.viewProfile === 'usuario' ) || ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) || ( this.viewProfile === 'montador' ) },
      { path: '/flows', title: this.dataConfig.flows,  icon:'ni-pin-3 text-orange', class: '', disabled: ( this.viewProfile === 'visitante' ) || ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) },
      { path: '/config', title: this.dataConfig.config,  icon:'ni-pin-3 text-orange', class: '', disabled: ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) },
      { path: '/whatsapp', title: this.dataConfig.whatsapp,  icon:'ni-pin-3 text-orange', class: '', disabled: ( this.viewProfile === 'admin' ) },
      { path: '/user-profile', title: 'Perfil',  icon:'ni-single-02 text-yellow', class: '' , disabled: ( this.viewProfile === 'usuario' ) || ( this.viewProfile === 'admin' ) || ( this.viewProfile === 'subAdmin' ) },
      { path: '/perfil', title: 'Roles',  icon:'ni-vector text-pink', class: '' , disabled:  ( this.viewProfile === 'admin' ) },
  ];
    this.menuItems = ROUTES.filter(menuItem => menuItem.disabled === true );
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
