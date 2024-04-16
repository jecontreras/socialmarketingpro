import { Component, OnInit } from '@angular/core';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { WhatsappInfoService } from 'src/app/servicesComponent/whatsapp-info.service';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss']
})
export class LiveChatComponent implements OnInit {
  dataConfig:any = {};


  constructor(
    private _config: ConfigKeysService,
    private _whatsappInfo: WhatsappInfoService,
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {

  }

  handleDownload(){

  }

  handleCreateNew(){

  }

}
