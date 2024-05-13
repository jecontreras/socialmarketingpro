import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import * as _ from 'lodash';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { MSG, USERT, WHATSAPP } from 'src/app/interfaces/interfaces';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { DetailContactComponent } from '../detail-contact/detail-contact.component';
import { ContactService } from 'src/app/servicesComponent/contact.service';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-form-all-chat',
  templateUrl: './form-all-chat.component.html',
  styleUrls: ['./form-all-chat.component.scss']
})
export class FormAllChatComponent implements OnInit {
  dataConfig:any = {};
  id:any;
  btnDisabled:boolean = false;
  dataUser:USERT = {};
  listChat:WHATSAPP[] = [];
  querys:any = {};
  isLoadingResults = true;
  isRateLimitReached = false;
  resultsLength:number = 0;
  txtFilter:string;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private _config: ConfigKeysService,
    private _store: Store<STORAGES>,
    public dialogRef: MatDialogRef<FormAllChatComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public _tools: ToolsService,
    private _whatsappTxt: WhatsappTxtService,
    public dialog: MatDialog,
    private _contactServices: ContactService,
    private chatService: ChatService,
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  async ngOnInit() {
    this.chatService.recibirMensajes().subscribe(async (data: MSG) => {
      this.nexProcessNewWhatsapp( data );
    });
    this.chatService.receiveMessageInit().subscribe(async (data: MSG) => {
      this.nexProcessNewWhatsapp( data );
    });

    this.chatService.receiveChatAssigned().subscribe(async (data: MSG) => {
      this.nexProcessAssigned( data );
    });

    this.querys = { where: {  user: this.dataUser.cabeza, /*createdAt: { ">=": moment().format('YYYY-MM-DD'), "<=": moment().add("days", -1 ).format('YYYY-MM-DD') } */ }, companyId: this.dataUser.cabeza, userId: this.dataUser.id, limit: 20, page: 0 }

    let result:any = await this.getListChat( this.querys );
    this.listChat = result;
  }

  nexProcessNewWhatsapp( data ){
    //console.log("****", data, this.listChat)
    if( data.msx.assignedMe === true ) return false;
    try {
      let index = _.findIndex( this.listChat, ['to', data.msx.to ] );
      //console.log("****32", index)
      if( index >= 0 ){
        this.listChat[index].txt = data.msx.body;
      }else{
        //if( this.dataUser.cabeza === data.msx.)
        this.listChat.push(
          {
            from: data.msx.from,
            to: data.msx.to,
            id: data.msx.ids || data.msx.id,
            txt: data.msx.body,
            contactId: data.msx.contactId.id
          }
        )
      }
    } catch (error) { }
  }

  async nexProcessAssigned( data ){
    data = data.txt;
    if( data.assignedMe === 0 )this.listChat = this.listChat.filter( row => row.id !== data.whatsappId );
    else {
      let resData = await this.getListChat( { where: { id: data.whatsappId },companyId: this.dataUser.cabeza, userId: this.dataUser.id, limit: 1 } );
      this.listChat.push( resData );
    }
  }

  getListChat( querys ){
    return new Promise( resolve =>{
      this._whatsappTxt.get( querys ).subscribe( res =>{
        this.resultsLength = res.count;
        resolve( res.data );
      });
    })
  }

  async handleSelectChat( item ){
    let contact = await this.getContactId( item.contactId.id || item.contactId );
    item.contactId = contact;
    item.check = true;
    const dialogRef = this.dialog.open(DetailContactComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if( result ) this.closeDialog();
      else setTimeout(()=> item.check = false, 8000 );
    });
  }

  getContactId( id ){
    return new Promise( resolve =>{
      this._contactServices.get( { where:{
        id: id
      }, limit: 1} ).subscribe( res => resolve( res.data[0] ), error=> resolve( error ) );
    })
  }

  async pageEvent(ev: any) {
    this.querys.page = ev.pageIndex;
    this.querys.limit = ev.pageSize;
    this.isLoadingResults = true;
    this.isRateLimitReached = true;
    let result:any = await this.getListChat( this.querys );
    this.listChat.push( ...result );
    this.listChat =_.unionBy(this.listChat || [], result, 'id');
  }

  async getFilter(){
    this.listChat = [];
    //console.log(this.datoBusqueda);
    this.txtFilter = this.txtFilter.trim();
    this.querys.limit = 1000;
    this.querys.page = 0;
    if ( this.txtFilter != '' ) {
      this.querys.where.or = [
        {
          to: {
            contains: this.txtFilter|| ''
          }
        },
        {
          from: {
            contains: this.txtFilter|| ''
          }
        }
      ];
    }else delete this.querys.where.or;
    let result:any = await this.getListChat( this.querys );
    this.listChat = result;
  }

  async handleRangeDate(){
    this.querys.where.createdAt = {
      ">=": this.range.value.start,
      "<=": this.range.value.end
    };
    this.listChat = [];
    //console.log(this.datoBusqueda);
    this.querys.limit = 1000;
    this.querys.page = 0;
    let result:any = await this.getListChat( this.querys );
    this.listChat = result;
  }


  closeDialog(){
    this.dialogRef.close();
  }


}
