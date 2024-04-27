import { Component, OnInit, ViewChild } from '@angular/core';
import { MSG, USERT, WHATSAPP, WHATSAPPDETAILS } from 'src/app/interfaces/interfaces';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { ListChatDetailedComponent } from '../list-chat-detailed/list-chat-detailed.component';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import * as _ from 'lodash';
import { FormAllChatComponent } from 'src/app/dialog/form-all-chat/form-all-chat.component';
import { MatDialog } from '@angular/material/dialog';
import { WhatsappTxtUserService } from 'src/app/servicesComponent/whatsapp-txt-user.service';
import { USER } from 'src/app/interfaces/user';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {
  dataConfig:any = {};
  dataSelect:WHATSAPPDETAILS = {};
  listChat:WHATSAPP[] = [];
  dataUser: USERT;

  @ViewChild('sonChat') sonChat: ListChatDetailedComponent;

  constructor(
    private _config: ConfigKeysService,
    private _whatsappTxtUserService: WhatsappTxtUserService,
    private chatService: ChatService,
    public dialog: MatDialog,
    private _store: Store<USER>,
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
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
      this._whatsappTxtUserService.getChatUser( {
        where:{
          userId: this.dataUser.id
        }
      }).subscribe( res =>{
        resolve( res.data );
      });
    })
  }

  handleOpenAllChat(){
    const dialogRef = this.dialog.open(FormAllChatComponent, {
      data: { },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleSelectChat( item ){
    this.dataSelect = item;
    setTimeout(()=>this.handleEventSon(), 200)
  }

}
