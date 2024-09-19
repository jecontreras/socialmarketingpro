import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
import { ListChatOptionComponent } from '../list-chat-option/list-chat-option.component';
import { ChatNewDetailedComponent } from '../chat-new-detailed/chat-new-detailed.component';
@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {
  dataConfig:any = {};
  dataSelect:WHATSAPPDETAILS = {};
  dataUser: USERT;
  @ViewChild(ListChatOptionComponent) listChatOption: ListChatOptionComponent;  // Accedemos al hijo 2
  @ViewChild('sonChat') sonChat: ChatNewDetailedComponent;
  @ViewChild('dataSentDestroy1') dataSentDestroy1: ListChatOptionComponent;
  @ViewChild('dataSentDestroy2') dataSentDestroy2: ListChatOptionComponent;
  @ViewChild('dataSentDestroy3') dataSentDestroy3: ListChatOptionComponent;

  querys1:any = { where:{ } };
  querys2:any = { where:{ } };
  querys3:any = { where:{ } };
  constructor(
    private _config: ConfigKeysService,
    public dialog: MatDialog,
    private _store: Store<USER>,
    public _toolsService: ToolsService,
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Permission granted');
      })
      .catch((err) => {
        console.error('Permission denied:', err);
      });
      this.querys1 = {
        where:{
          userId: this.dataUser.id,
          assignedMe: 0,
          estado: 0,
          sendAnswered: 0
        },
        limit: 100,
        page: 0
      };
      this.querys2 = {
        where:{
          userId: this.dataUser.id,
          assignedMe: 0,
          estado: 0,
          sendAnswered: 1
        },
        limit: 100,
        page: 0
      };
      this.querys3 = {
        where:{
          userId: this.dataUser.id,
          assignedMe: 0,
          estado: 1,
          sendAnswered: 2
        },
        limit: 100,
        page: 0
      };
  }

  async ngOnInit() {

  }

  handleOpenAllChat(){
    const dialogRef = this.dialog.open(FormAllChatComponent, {
      data: { },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result );
    });
  }

  receiveChatDestroy( item ){
    //console.log("******item", item )
    this.dataSentDestroy1.handleDataSentDestroy( item );
    this.dataSentDestroy2.handleDataSentDestroy( item );
    this.dataSentDestroy3.handleDataSentDestroy( item );

  }


  receiveDataDestroyChat( item ){
    //console.log( "*****item", item )
  }


  receiveDataFrom(data: WHATSAPPDETAILS) {
    //console.log('Padre recibió los datos del Hijo 1:', data);
    // Aquí llamamos a la función del Hijo 2
    this.dataSelect = data;
    setTimeout(()=> this.sonChat.handleEventFater(), 100 );
  }

}
