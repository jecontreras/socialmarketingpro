import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ContactService } from 'src/app/servicesComponent/contact.service';
import { InfoWhatsappService } from 'src/app/servicesComponent/info-whatsapp.service';
import { TagService } from 'src/app/servicesComponent/tag.service';
import { WhatsappInfoService } from 'src/app/servicesComponent/whatsapp-info.service';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss']
})
export class AudienceComponent implements OnInit {
  _dataConfigTable:any = {
    titulo: "Lista de Perfil",
    returnHTML: "formperfil/",
    dsAccion: true,
    model: "",
    querys:{
      where:{
        estado: 'abierto'
      }
    },
    btn:{
      btnCrear: {
        titulo: "Crear Perfil",
        click: "CrearPerfil()"
      }
    },
    tablet:{
      headers:["openDialogContact","foto","name","Whatsapp","Actualizado"],
      row:[],
      keys: ["openDialogContact","foto","name","whatsapp","createdAt"]
    }
  };
  dataConfig:any = {};
  panelOpenState = false;
  listTag:any = [];
  listSequences:any = [];
  listCampaigns:any = [];
  listSelectTag:any = [];
  counterFilter:number = 0;

  constructor(
    private _router: Router,
    private _contact: ContactService,
    private _config: ConfigKeysService,
    private _tag: TagService,
    private _infoWhatsappServices: InfoWhatsappService,
    private _whatsappInfoServices: WhatsappInfoService
  ) {
    this.dataConfig = _config._config.keys;

  }

  async ngOnInit() {
    this._dataConfigTable.model = this._contact;
    this.listTag = await this.getListTag();
    this.listSequences = await this.getListSequences();
    this.listCampaigns = await this.getListCampaigns();
  }

  getListTag(){
    return new Promise( resolve =>{
      this._tag.get( { where: { } } ).subscribe( res=>{
        resolve( res.data );
      });
    })
  }
  getListSequences(){
    return new Promise( resolve =>{
      this._infoWhatsappServices.get( { where: {  estado: 0 } } ).subscribe( res=>{
        resolve( res.data );
      });
    })
  }
  getListCampaigns(){
    return new Promise( resolve =>{
      this._whatsappInfoServices.get( { where: { } } ).subscribe( res=>{
        resolve( res.data );
      });
    })
  }

  handlePushSelectTag( item:any, keys:string ){
    this.listSelectTag.push( { title: item[keys], ...item} );
  }

  handleRemoveFilter( item:any ){
    this.listSelectTag = this.listSelectTag.filter( key => key.id !== item.id );
  }

  handleDropFilter(){
    this.listSelectTag = [];
  }

  handleFilterSearch(){

  }

  CrearPerfil(){
    this._router.navigate(['/formperfil']);
  }

}
