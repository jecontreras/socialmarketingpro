import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormAllChatComponent } from 'src/app/dialog/form-all-chat/form-all-chat.component';
import { MSG, USERT, WHATSAPP, WHATSAPPDETAILS } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { WhatsappTxtUserService } from 'src/app/servicesComponent/whatsapp-txt-user.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { ChatNewDetailedComponent } from '../chat-new-detailed/chat-new-detailed.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-list-chat-option',
  templateUrl: './list-chat-option.component.html',
  styleUrls: ['./list-chat-option.component.scss']
})
export class ListChatOptionComponent implements OnInit {
  dataConfig:any = {};
  dataSelect:WHATSAPPDETAILS = {};
  listChat:WHATSAPP[] = [];
  dataChatClone:WHATSAPP[] = [];
  dataUser: USERT;
  loader:boolean = true;
  txtFilter:string;

  @ViewChild('sonChat') sonChat: ChatNewDetailedComponent;
  @Output() dataSent = new EventEmitter<string>();

  @Input() querys:any = {};

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
    this.chatService.receiveChatAssigned().subscribe(async (data: MSG) => {
      console.log("****77", data, this.listChat)
       this.nexProcessNewWhatsapp( data );
    });
    this.chatService.recibirMensajes().subscribe(async (data: MSG) => {
      console.log("****81", data, this.listChat)
      this.processMessageUpdate( { ...data.msx, whatsappTxt: data.msx.ids, } );
    });
    this.chatService.receiveMessageUpdateId().subscribe(async (data: MSG) => {
      console.log("*******85", data )
      this.processMessageUpdate( data.dataDbs );
    });
    //this.reloadCharge();
  }

  async handleDataSentDestroy( item ){
    console.log( "*****item", item , this.listChat, this.querys)
    if( this.querys.where.sendAnswered === 0 ){
      this.listChat = this.listChat.filter( row => row.To !== item.to );
    }
    if( this.querys.where.sendAnswered === 1 ){
      let filterR = this.listChat.find( row => row.To === item.to );
      if( !filterR ){
        let dataChat = await this.getIdChat( item.whatsappTxt, item.userCreate )
        console.log("*******87", dataChat )
        this.listChat.push( dataChat );
      }
    }
  }

  getIdChat( id:string, user:string ){
    return new Promise( resolve =>{
      this._whatsappTxtUserService.getChatUser( { where: { userId: user, whatsappId: id, estado:0 }, limit: 1 } ).subscribe( res =>{
        res = res.data[0];
        resolve( res );
      },()=> resolve( false ) );
    });
  }

  async reloadCharge(){
    let result:any = await this.getListChat( this.querys );
    this.listChat = result;
    this.dataChatClone = _.clone( result );
    this.handleOrderChat();
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
      if( data.assignedMe === 0 ) {
        this.listChat.push(
          { ...data,
            whatsappIdList: data.whatsappId,
            userIdList: data.userId,
            whatsappId: data.whatsappId.id,
            userId: data.userId.id ,
            contactIdList:{ foto: "./assets/brand/favicon.png" }
          } );
      }
      else this.listChat = this.listChat.filter( item => item.id !== data.id );
    } catch (error) { }
  }

  processMessageUpdate( data ){
    let filterNumber = _.findIndex(this.listChat, ['whatsappId', data.whatsappTxt]);
    console.log("*******120", filterNumber )
    if( filterNumber >= 0 ){
      if( data.quien === 0 ) this.listChat[ filterNumber ].seen = 0;
      this.listChat[ filterNumber ].date = (moment( new Date(), 'DD-MM-YYYY, H:mm:ss' )).unix();
      if( data.typeTxt === "txt" ) this.listChat[ filterNumber ].whatsappIdList.txt = data.txt || data.body;
      else this.listChat[ filterNumber ].whatsappIdList.txt = 'documento';
      this.handleOrderChat();
      console.log("*********", this.listChat)
    }
  }

  handleOrderChat(){
    this.listChat = _.map( this.listChat, ( item )=> {
      return {
        ...item,
        date1: moment.unix( item.date ).format("YYYY-MM-DD HH:mm")
      }
    });
    this.listChat = _.orderBy(this.listChat, ['date'], ['desc']);
    console.log("********105", this.listChat );
  }

  async handleEventFater( item ) {
    console.log("******item", item )
  }

  handleEventSon( item ) {
    this.processColorItem();
    this.dataSent.emit( item );  // Emitimos los datos al padre
    //this.sonChat.handleEventFater();
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
    setTimeout(()=>this.handleEventSon( item ), 200)
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
    //let result:any = await this.getListChat( this.querys );
    let result = this.dataChatClone;
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
