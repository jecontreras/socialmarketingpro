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

  constructor(
    private _config: ConfigKeysService,
    private _store: Store<STORAGES>,
    public dialogRef: MatDialogRef<FormAllChatComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _tools: ToolsService,
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

    let result:any = await this.getListChat( { where: {  user: this.dataUser.cabeza }, companyId: this.dataUser.cabeza, userId: this.dataUser.id, limit: 10, page: 0 } );
    this.listChat = result;
  }

  nexProcessNewWhatsapp( data ){
    console.log("****", data, this.listChat)
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
        resolve( res.data );
      });
    })
  }

  async handleSelectChat( item ){
    let contact = await this.getContactId( item.contactId.id || item.contactId );
    item.contactId = contact;
    const dialogRef = this.dialog.open(DetailContactComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if( result ) this.closeDialog();
    });
  }

  getContactId( id ){
    return new Promise( resolve =>{
      this._contactServices.get( { where:{
        id: id
      }, limit: 1} ).subscribe( res => resolve( res.data[0] ), error=> resolve( error ) );
    })
  }


  closeDialog(){
    this.dialogRef.close();
  }


}
