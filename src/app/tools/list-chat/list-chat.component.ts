import { Component, OnInit, ViewChild } from '@angular/core';
import { Msg, Whatsapp, WhatsappDetails } from 'src/app/interfaces/interfaces';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { ListChatDetailedComponent } from '../list-chat-detailed/list-chat-detailed.component';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import * as _ from 'lodash';

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
    private _whatsappTxt: WhatsappTxtService,
    private chatService: ChatService
  ) {
    this.dataConfig = _config._config.keys;
  }

  async ngOnInit() {
    this.chatService.recibirMensajes().subscribe(async (data: Msg) => {
      this.nexProcess( data );
    });
    this.chatService.receiveMessageInit().subscribe(async (data: Msg) => {
      this.nexProcess( data );
    });
    let result:any = await this.getListChat();
    this.listChat = result;
  }

  nexProcess( data ){
    let index = _.findIndex( this.listChat, ['to', data.msx.to ] );
    //console.log("****32", index)
    if( index >= 0 ){
      this.listChat[index].txt = data.msx.body;
    }else{
      this.listChat.push(
        {
          from: data.msx.from,
          to: data.msx.to,
          id: data.msx.id,
          txt: data.msx.body
        }
      )
    }
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
