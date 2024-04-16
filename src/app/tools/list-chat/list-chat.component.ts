import { Component, OnInit, ViewChild } from '@angular/core';
import { Whatsapp, WhatsappDetails } from 'src/app/interfaces/interfaces';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { ListChatDetailedComponent } from '../list-chat-detailed/list-chat-detailed.component';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {
  dataConfig:any = {};
  dataSelect:WhatsappDetails = {};
  listChat:Whatsapp[];

  @ViewChild('sonChat') sonChat: ListChatDetailedComponent;

  constructor(
    private _config: ConfigKeysService,
    private _whatsappTxt: WhatsappTxtService
  ) {
    this.dataConfig = _config._config.keys;
  }

  async ngOnInit() {
    let result:any = await this.getListChat();
    this.listChat = result;
  }

  handleEventSon() {
    this.sonChat.handleEventFater();
  }

  getListChat(){
    return new Promise( resolve =>{
      this._whatsappTxt.get( {
        where:{ }
      }).subscribe( res =>{
        resolve( res.data );
      });
    })
  }



  handleSelectChat( item ){
    this.dataSelect = item;
    setTimeout(()=>this.handleEventSon(), 200)
  }

}
