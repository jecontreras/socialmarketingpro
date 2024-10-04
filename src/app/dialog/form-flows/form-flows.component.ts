import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FLOWS, USERT } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { InfoWhatsappService } from 'src/app/servicesComponent/info-whatsapp.service';

@Component({
  selector: 'app-form-flows',
  templateUrl: './form-flows.component.html',
  styleUrls: ['./form-flows.component.scss']
})
export class FormFlowsComponent implements OnInit {

  dataConfig:any = {};
  id:any;
  data:FLOWS;
  btnDisabled:boolean = false;
  dataUser:USERT = {};

  constructor(
    private _tools: ToolsService,
    private _config: ConfigKeysService,
    public dialogRef: MatDialogRef<FormFlowsComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _infoWhatsapp: InfoWhatsappService,
    private _store: Store<STORAGES>,
  ) { }

  ngOnInit(): void {
    this.data = this.datas || {};
    this.dataConfig = this._config._config.keys;
  }

}
