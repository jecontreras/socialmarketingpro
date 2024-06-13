import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovementItemComponent } from '../movement-item/movement-item.component';
import { ToolsService } from 'src/app/services/tools.service';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ContactService } from 'src/app/servicesComponent/contact.service';
import { CONTACTDIALOG, CONTACT, WHATSAPPINFOUSER, USERT, TAGUSER, SEQUENCES, CAMPAIGNS, TAG } from 'src/app/interfaces/interfaces';
import { WhatsappTxtUserService } from 'src/app/servicesComponent/whatsapp-txt-user.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { Store } from '@ngrx/store';
import { USER } from 'src/app/interfaces/user';
import { Router } from '@angular/router';
import { TagUserService } from 'src/app/servicesComponent/tag-user.service';
import { SequencesService } from 'src/app/servicesComponent/sequences.service';
import { CampaignsService } from 'src/app/servicesComponent/campaigns.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TagService } from 'src/app/servicesComponent/tag.service';

declare interface BROADCAST{
  contact?:CONTACT;
  assigned?: WHATSAPPINFOUSER;
};

@Component({
  selector: 'app-detail-contact',
  templateUrl: './detail-contact.component.html',
  styleUrls: ['./detail-contact.component.scss']
})
export class DetailContactComponent implements OnInit {
  dataConfig:any = {};
  data:BROADCAST;
  btnDisabled:boolean = false;
  dataUser: USERT;
  listTag:TAGUSER[];
  listSequences:SEQUENCES[];
  listCampaigns:CAMPAIGNS[];
  rolName:string;

  constructor(
    public dialogRef: MatDialogRef<MovementItemComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: CONTACTDIALOG,
    public _tools: ToolsService,
    private _config: ConfigKeysService,
    private _contac: ContactService,
    private _assignedWhatsappServices: WhatsappTxtUserService,
    private _whatsappTxtService: WhatsappTxtService,
    private _store: Store<USER>,
    private _router: Router,
    private _tagUser: TagUserService,
    private _sequencesService: SequencesService,
    private _campaignsService: CampaignsService,
    private _chatServices: ChatService,
    private _bottomSheet: MatBottomSheet,
    private _tagServices: TagService,
  ) {

    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      try {
        if( this.dataUser.id ) this.rolName = this.dataUser.rol.nombre;
      } catch (error) {  }
    });

    this.dataConfig = _config._config.keys;
    this.data = {
      contact: { },
      assigned: { }
    }
  }

  async ngOnInit(){
    this.data.contact = this.datas.contactId;
    if( this.data.contact.id ) {
      let result:any = await this.getAssignedUser( this.dataUser.id, this.datas.id );
      this.data.assigned = result || {};
    }
    this.listTag = await this.getListTag();
    this.listSequences = await this.getListSequences();
    this.listCampaigns = await this.getListCampaigns();
    console.log("****", this.datas, ">>>>>>>>>", this.data )
  }

  getListTag():any{
    return new Promise( resolve =>{
      this._tagUser.get( { where: { contact: this.data.contact.id, estado: 0 } } ).subscribe( res=>{
        resolve( res.data );
      });
    })
  }
  getListSequences():any{
    return new Promise( resolve =>{
      this._sequencesService.get( { where: { contact: this.data.contact.id } } ).subscribe( res=>{
        resolve( res.data );
      });
    })
  }
  getListCampaigns():any{
    return new Promise( resolve =>{
      this._campaignsService.get( { where: { contact: this.data.contact.id } } ).subscribe( res=>{
        resolve( res.data );
      });
    })
  }


  async handleChatClose(){
    let data = {
      id: this.data.contact.id,
      estado: "cerrado"
    };
    let result:CONTACT = await this.nextProcessContact( data );
    if( result.id ) {
      this._tools.basic( this.dataConfig.txtUpdate );
      this.data.contact.estado = result.estado;
    }else this._tools.basic( this.dataConfig.txtError );

  }

  async handleChatOpen(){
    let data = {
      id: this.data.contact.id,
      estado: "abierto"
    };
    let result:CONTACT = await this.nextProcessContact( data );
    if( result.id ) {
      this._tools.basic( this.dataConfig.txtUpdate );
      this.data.contact.estado = result.estado;
    }else this._tools.basic( this.dataConfig.txtError );
  }

  handleImageError() {
    this.data.contact.foto = './assets/img/theme/team-4-800x800.jpg';
  }

  nextProcessContact( data ){
    return new Promise( resolve =>{
      this._contac.update( data ).subscribe( res=>{
        resolve( res );
      },(err)=>resolve(err))
    });
  }

  getAssignedUser( userId, whatsappId ){
    return new Promise( resolve =>{
      this._assignedWhatsappServices.get( { where: { userId: userId, whatsappId: whatsappId } }).subscribe( res => resolve( res.data[0] ),error => resolve( error ) );
    })
  }
  async handleSubmitAssigned(){
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    let result:any;
    if( this.data.assigned.id ) {
     result= await this.processAssignedUpdate();
     this.data.assigned.assignedMe = result.assignedMe;
    }
    else {
      result = await  this.processAssignedCreate();
      if( result.id ){
        this.data.assigned = {
          ...result,
          whatsappId: result.whatsappId.id,
          userId: result.userId ? result.userId.id : result.userId,
          tagId: result.tagId ?result.tagId.id : result.tagId,
          sequenceId: result.sequenceId ? result.sequenceId.id : result.sequenceId
        };
      }
    }
    console.log("****1620", this.data)
    this._chatServices.sendContactAssigned( result );
    this._tools.basic(this.dataConfig.txtUpdate );
    this.btnDisabled = false;
    //this._router.navigate(['/liveChat', this.datas.id ] );
    this.closeDialog( result );
  }

  async  processAssignedCreate(){
    return new Promise( async( resolve ) =>{
      let msxId:string;
      if( !this.datas.id ) msxId = await this.ProcessMessageUserNew();
      else {
        msxId = this.datas.id;
        this.ProcessMessageUserUpdate();
      }
      let data:WHATSAPPINFOUSER = {
        userId: this.dataUser.id,
        companyId: this.dataUser.cabeza,
        estado: 0,
        whatsappId: msxId,
        assignedMe: 0
      };
      this._assignedWhatsappServices.create( data ).subscribe( res => resolve( res ), error => resolve( error ) );
    });
  }

  processAssignedUpdate(){
    return new Promise( resolve =>{
      let data:WHATSAPPINFOUSER = {
        id: this.data.assigned.id,
        estado: 0,
        assignedMe: this.data.assigned.assignedMe === 0 ? 1 : 0
      };
      this._assignedWhatsappServices.update( data ).subscribe( res => resolve( res ), error => resolve( error ) );
    });
  }

  ProcessMessageUserNew():any{
    return new Promise( resolve =>{
      this._whatsappTxtService.createNewTxtWhatsapp(
        {
          "msx": {
            "from": this.dataUser.celular,
            "to": this.data.contact.whatsapp,
            "body": "*Asesor Asignado* " + this.dataUser.name,
            "urlMedios": "",
            "quien": 1,
            "id": 1,
            "typeTxt": 'txt',
            "userCreate": this.dataUser.id
        },// TODO USUARIO CABEZA DE TODO
        "user": { "id": this.dataUser.cabeza }
        }
      ).subscribe( res => {
        resolve( res.data.whatsappTxt.id )}, error => resolve( error ) );
    })
  }

  ProcessMessageUserUpdate():any{
    return new Promise( resolve =>{
      this._whatsappTxtService.createNewTxtWhatsapp(
        {
          "msx": {
            "from": this.datas.from,
            "to": this.datas.to,
            "body": "*Asesor Asignado* " + this.dataUser.name,
            "urlMedios": "",
            "quien": 1,
            "id": 1,
            "typeTxt": 'txt',
            "userCreate": this.dataUser.id
        },
        "user": { "id": this.dataUser.cabeza }
        }
      ).subscribe( res => {
        resolve( res.data.whatsappTxt.id )
      }, error => resolve( error ) );
    })
  }

  handleOpenChat(){
    if( this.data.assigned.assignedMe === 0 ){
      this._router.navigate(['/liveChat', this.datas.id ] );
      this.closeDialog( 'chat' );
    }
  }

  openBottomSheetTag(): void {

    const bottomSheetRef = this._bottomSheet.open(BottomSheetSheetTag);

    // Escucha el evento después de que se cierre el bottom sheet
    bottomSheetRef.afterDismissed().subscribe(async (result) => {
      // Maneja el valor devuelto aquí
      console.log('Valor devuelto:', result);
      let resultTagUser:any = await this.handleNexTagCreate( result );
      if(resultTagUser.id) {
        console.log("****", resultTagUser, this.listTag )
        resultTagUser.listTag = resultTagUser.tag;
        resultTagUser.Tag = resultTagUser.tag.id;
        this.listTag.push( resultTagUser );
        this._tools.basic( this.dataConfig.txtUpdate );
      }
    });
  }

  handleNexTagCreate( data ){
    return new Promise( resolve =>{
      this._tagUser.create({
        tag: data.id,
        user: this.dataUser.cabeza,
        contact: this.data.contact.id
      }).subscribe( res => resolve( res ), error=> resolve( error ) );
    });
  }

  async handlePushSelectTag( item:any ){
    if( this.btnDisabled === true ) return false;
    let confirm = await this._tools.confirm( {title:this.dataConfig.btnDrop, text: this.dataConfig.txtDetailsDrop, confirmButtonText: this.dataConfig.yesDrop } );
    if(!confirm.value) return false;
    if( !item.id )  return false;
    this.btnDisabled = true;
    let result:any = await this.handleNextTagDelete( item.id );
    if( result.id ) {
      this._tools.basic( this.dataConfig.txtUpdate );
      this.listTag = this.listTag.filter( row => row.id !== item.id );
    }
    this.btnDisabled = false;
  }

  handleNextTagDelete( id ){
    return new Promise( resolve =>{
      this._tagUser.update( { id: id, estado: 1 } ).subscribe( res => resolve( res ), error=> resolve( error ) );
    });
  }


  closeDialog( opt:string ){
    this.dialogRef.close( opt );
  }

}

@Component({
  selector: 'bottom-sheet-tag',
  templateUrl: 'bottom-sheet-tag.html',
})
export class BottomSheetSheetTag {

  listTag:TAG[] = [];
  dataUser: USERT;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetSheetTag>,
    private _tagServices: TagService,
    private _store: Store<USER>
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    (async ()=>{
      let list:any = await this.getListInTag( { where:{  }, limit: 1000, page: 0 } );
      this.listTag = list || [];
    })();
  }

  getListInTag( querys ){
    return new Promise( resolve =>{
      this._tagServices.get( querys ).subscribe( res => resolve( res.data ) , error => resolve( error ) );
    });
  }
  openLink(event: any): void {
    this._bottomSheetRef.dismiss( event );
    //event.preventDefault();
  }
}
