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
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from 'src/app/services/tools.service';
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
  querys:any = {};

  constructor(
    private _config: ConfigKeysService,
    private _whatsappTxtUserService: WhatsappTxtUserService,
    private chatService: ChatService,
    public dialog: MatDialog,
    private _store: Store<USER>,
    private _router: Router,
    public _toolsService: ToolsService,
    private activate: ActivatedRoute,
    private _whatsappTxtService : WhatsappTxtService
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
  }

  async ngOnInit() {
    this.querys = {
      where:{
        userId: this.dataUser.id,
        assignedMe: 0,
        estado: 0
      },
      limit: 100,
      page: 0
    };
    let result:any = await this.getListChat( this.querys );
    this.listChat = result;
    this.chatService.receiveChatAssigned().subscribe(async (data: MSG) => {
      //console.log("****45", data, this.listChat)
      this.nexProcessNewWhatsapp( data );
    });
    this.processColorItem();
  }

  processColorItem(){
    let urlPath = (this.activate.snapshot.paramMap.get('id'));
    for( let row of this.listChat ) {
      if( row.whatsappIdList.id === urlPath ) row.check = true;
      else row.check = false;
    }
  }

  nexProcessNewWhatsapp( data ){
    try {
      data = data.txt;
      data.check = true;
      if( this.dataUser.id !== data.userId.id ) return false;
      if( data.assignedMe === 0 ) this.listChat.push( { ...data, whatsappIdList: data.whatsappId, userIdList: data.userId, whatsappId: data.whatsappId.id, userId: data.userId.id , contactIdList:{ foto: "./assets/brand/favicon.png" }} );
      else this.listChat = this.listChat.filter( item => item.id !== data.id );
    } catch (error) { }
  }

  handleEventSon() {
    this.processColorItem();
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
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result );
      if( result ) this.handleSelectChat( result.whatsappId )
    });
  }

  handleSelectChat( item ){
    console.log("***", item)
    item.check = true;
    this.dataSelect = item;
    this._router.navigate(['/liveChat', this.dataSelect.id ] );
    if( this.dataSelect.seen === 0 ) { item.seen=1; this.handleUpdateState();}
    setTimeout(()=>this.handleEventSon(), 200)
  }

  handleUpdateState(){
    return new Promise( resolve=>{
      this._whatsappTxtService.update( { id: this.dataSelect.id, seen: 1}).subscribe( res => resolve( res ),error => resolve( error ) );
    });
  }

  async handleFilter(){
    this.loader = true;
    this.listChat = [];
    //console.log(this.datoBusqueda);
    this.txtFilter = this.txtFilter.trim();
    this.querys.limit = 1000;
    this.querys.page = 0;
    let result:any = await this.getListChat( this.querys );
    if(this.txtFilter != '') this.listChat = this._toolsService.searchKeyword( result, this.txtFilter );
    else this.listChat = result;
  }

  async handleEventState(){
    this.loader = true;
    this.listChat = [];
    this.querys.limit = 1000;
    this.querys.page = 0;
    let result:any = await this.getListChat( this.querys );
    this.listChat = result;
  }

}
