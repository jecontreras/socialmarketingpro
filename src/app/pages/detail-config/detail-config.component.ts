import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { UserAction } from 'src/app/redux/app.actions';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { UsuariosService } from 'src/app/servicesComponent/usuarios.service';

@Component({
  selector: 'app-detail-config',
  templateUrl: './detail-config.component.html',
  styleUrls: ['./detail-config.component.scss']
})
export class DetailConfigComponent implements OnInit {
  data = {
    urlSocket: "http://localhost:3000",
    qrWhatsapp: "",
    urlGoogleExel: ""
  };
  dataUser:USERT;
  dataConfig:any = {};
  public qrCodeDownloadLink: SafeUrl = "";
  flagWhatsapp:boolean = false;

  constructor(
    private _store: Store<USER>,
    private _user: UsuariosService,
    private _toolsServices: ToolsService,
    private _config: ConfigKeysService,
    private chatService: ChatService,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      this.data.urlSocket = this.dataUser.urlSocket || this.data.urlSocket;
      this.qrCodeDownloadLink = this.dataUser.qrWhatsapp || '';
      this.data.urlGoogleExel = this.dataUser.urlGoogleExel;
    });
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
    this.chatService.qrWhatsapp().subscribe(async ( data ) => {
       //console.log("****31", data)
       this.qrCodeDownloadLink = data;
    });
    this.chatService.statusWhatsapp().subscribe(async ( data ) => {
      //console.log("****31", data)
      this.flagWhatsapp = data.data;
      if( this.flagWhatsapp ) this.qrCodeDownloadLink;
   });
  }

  handleNext(){
    this.dataUser.urlSocket = this.data.urlSocket || '';
    this.dataUser.qrWhatsapp = this.data.qrWhatsapp || '';
    let accion = new UserAction( this.dataUser, 'put');
    this._store.dispatch( accion );
    this.processUserUpdate();
    this.processUserUpdateTotal();
    this._toolsServices.presentToast( this.dataConfig.txtUpdate );
  }

  async processUserUpdate(){
    return new Promise( resolve =>{
      this._user.update( { 
        id: this.dataUser.id, 
        urlSocket: this.dataUser.urlSocket, 
        qrWhtsapp: this.dataUser.qrWhatsapp,
      } ).subscribe( res => resolve( res ), error => resolve( error ) );
    })
  }

  async processUserUpdateTotal(){
    return new Promise( resolve =>{
      this._user.updateUrlSocketTotal( { id: this.dataUser.id, urlSocket: this.dataUser.urlSocket } ).subscribe( res => resolve( res ), error => resolve( error ) );
    })
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

}
