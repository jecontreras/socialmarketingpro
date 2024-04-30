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
  loader:boolean = true;
  txtFilter:string;

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
    let result:any = await this.getListChat( {
      where:{
        userId: this.dataUser.id,
        assignedMe: 0
      },
      limit: 10,
      page: 0
    });
    this.listChat = result;
    this.chatService.receiveChatAssigned().subscribe(async (data: MSG) => {
      console.log("****45", data, this.listChat)
      this.nexProcessNewWhatsapp( data );
    });
  }

  nexProcessNewWhatsapp( data ){
    try {
      data = data.txt;
      if( this.dataUser.id !== data.userId.id ) return false;
      if( data.assignedMe === 0 ) this.listChat.push( { ...data, whatsappIdList: data.whatsappId, userIdList: data.userId, whatsappId: data.whatsappId.id, userId: data.userId.id } );
      else this.listChat = this.listChat.filter( item => item.id !== data.id );
    } catch (error) { }
  }

  handleEventSon() {
    this.sonChat.handleEventFater();
  }

  getListChat( querys:any ){
    return new Promise( resolve =>{
      this._whatsappTxtUserService.getChatUser( querys ).subscribe( res =>{
        resolve( res.data );
      });
    })
  }

  handleOpenAllChat(){
    const dialogRef = this.dialog.open(FormAllChatComponent, {
      data: { },
      width: '50%',
      height: "600px",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleSelectChat( item ){
    this.dataSelect = item;
    setTimeout(()=>this.handleEventSon(), 200)
  }

  async handleFilter(){
    this.loader = true;
    this.listChat = [];
    let query:any = {};
    //console.log(this.datoBusqueda);
    this.txtFilter = this.txtFilter.trim();
    query = {
      where:{
        cat_padre: null
      },
      limit: 100
    };
    if (this.txtFilter != '') {
      query.where.or = [
        {
          to: {
            contains: this.txtFilter|| ''
          }
        },
      ];
    }
    let result:any = await this.getListChat( query );
    this.listChat = result;
  }

}
