import { Component, OnInit } from '@angular/core';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { InfoWhatsappService } from 'src/app/servicesComponent/info-whatsapp.service';

@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.scss']
})
export class FlowsComponent implements OnInit {
  _dataConfigTable:any = {
    titulo: "Lista de Flujo de conversion",
    returnHTML: "formFlows/",
    dsAccion: true,
    model: "",
    querys:{
      where:{
        estado :  0,
        //user :  "6545ad04f9b6e13d24d91870"
      }
    },
    btn:{
      btnCrear: {
        titulo: "Crear Flows",
        click: ""
      }
    },
    tablet:{
      headers:["Acciones","Titulo","Actualizado"],
      row:[],
      keys: ["Acciones","titulo","createdAt"]
    }
  };
  dataConfig:any = {};

  constructor(
    private _config: ConfigKeysService,
    private _infoWhatsapp: InfoWhatsappService
  ) {
    this.dataConfig = _config._config.keys;
   }

  ngOnInit(): void {
    this._dataConfigTable.model = this._infoWhatsapp;
  }

}
