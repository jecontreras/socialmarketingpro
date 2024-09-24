import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DetailContactComponent } from 'src/app/dialog/detail-contact/detail-contact.component';
import { FileDetailComponent } from 'src/app/dialog/file-detail/file-detail.component';
import { OpenGalleriaComponent } from 'src/app/dialog/open-galleria/open-galleria.component';
import { FASTANSWER, INFOWHATSAPP, MSG, USERT, WHATSAPPDETAILS } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { AudioRecorderServiceService } from 'src/app/servicesComponent/audio-recorder-service.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { ContactService } from 'src/app/servicesComponent/contact.service';
import { FastAnswerService } from 'src/app/servicesComponent/fast-answer.service';
import { InfoWhatsappService } from 'src/app/servicesComponent/info-whatsapp.service';
import { WhatsappTxtUserService } from 'src/app/servicesComponent/whatsapp-txt-user.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';

@Component({
  selector: 'app-list-chat-detailed',
  templateUrl: './list-chat-detailed.component.html',
  styleUrls: ['./list-chat-detailed.component.scss']
})
export class ListChatDetailedComponent implements OnInit {
  @Input() data:WHATSAPPDETAILS = {};
  @Output() childEmitter = new EventEmitter<object>();
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  listDetails:WHATSAPPDETAILS[] = [];
  msg: MSG= { txt: "", quien: 1  };
  disabledEmoji:boolean = false;
  dataUser:USERT;
  valueSpinner:number = 0;
  recording = false;
  dataConfig:any = {};
  audioBlob;
  breakpoint: number;
  id:string;
  btnDisabled: boolean;

  constructor(
    private _whatsappDetails: WhatsappTxtService,
    public dialog: MatDialog,
    private chatService: ChatService,
    private _store: Store<USER>,
    private activate: ActivatedRoute,
    private _audioRecorderService: AudioRecorderServiceService,
    public _toolsService: ToolsService,
    private _config: ConfigKeysService,
    private _bottomSheet: MatBottomSheet,
    private _contactServices: ContactService,
    private _whatsappTxtUser: WhatsappTxtUserService,
    private Router: Router
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });

  }

  async ngOnInit() {
    this.processId( true );
    this.childEmitter.emit( this.data );
    this.chatService.recibirMensajes().subscribe(async (data: MSG) => {
      console.log("****31", data, this.listDetails)
      this.processMessage( data );
    });

    this.chatService.receiveMessageInit().subscribe(async (data: MSG) => {
      console.log("****31", data, this.listDetails)
      this.processMessage( data );
    });
    this.breakpoint = (window.innerWidth <= 1050) ? 1 : 6;
  }

  async processId( opt:boolean ){
    this.id = (this.activate.snapshot.paramMap.get('id'));
    if( this.id ) {
      await this.getWhatsappInit( this.id );
      if( opt === true ) this.handleEventFater();
    }
  }

  processIframeWeb( item ){
    item.viewFile = this._toolsService.seguridadIfrane( item.urlMedios || item.href );
    //this.invertMessagesOrder();
    this.scrollToBottom();
  }
  handleOpenFlows( item ){
    const dialogRef = this.dialog.open(OpenGalleriaComponent, {
      width: '50%',
      data: { id: item.urlMedios },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  processMessage( data ){
    try {
      let filter = this.listDetails.find( row => ( row.id === data.msx.id ) );
      if( !filter ) {
        filter =  this.listDetails.find( row => ( row.to === data.msx.to ) );
        if( filter ){
          this.listDetails.push( {
            to: data.msx.to,
            from: data.msx.from,
            id: data.msx.id,
            quien: data.msx.quien,
            urlMedios: data.msx.urlMedios,
            user: data.msx.user,
            txt: data.msx.body,
            typeTxt: data.msx.typeTxt,
            relationMessage: data.msx.relationMessage,
            dataRelationMessage: this.listDetails.find( item => item.idWhatsapp === data.msx.relationMessage )
          });
        }
      }
      //this.invertMessagesOrder();
      this.scrollToBottom();
    } catch (error) { }
    //console.log( this.listDetails )
  }

  getWhatsappInit( id:string ){
    return new Promise( resolve =>{
      this._whatsappDetails.getId( { where: { id: id } } ).subscribe( res =>{
        this.data = res.data[0] || {};
        resolve( true );
      }, error => resolve( false ) );
    })
  }

  async handleEventFater() {
    // Lógica que deseas ejecutar cuando se llama desde el padre
    console.log('Función ejecutada desde el hijo, entre', this.data );
    this.listDetails = [];
    this.processSpinnerValue('init');
    setTimeout(async()=>{
      if( this.data.id ) {
        this.processId( false );
        let result:any = await this.getWhatsappDetails();
        this.listDetails = result;
        this.invertMessagesOrder();
        this.scrollToBottom();
        this.processSpinnerValue('end');
      }else this.listDetails = [];
    }, 200)
  }

  processSpinnerValue( opt:string ){
    let interval = setInterval(()=>{
      this.valueSpinner++;
    }, 1000 );
    if( opt === 'end') clearInterval( interval );
  }

  scrollToBottom(): void {
    setTimeout(()=>{
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (error) {}
    }, 100 )
  }

  getWhatsappDetails(){
    return new Promise( resolve =>{
      this._whatsappDetails.getDetails( { where: { whatsappTxt: this.data.id }, limit: 1000000, sort: "updatedAt ASC" } ).subscribe( res =>{
        resolve( res.data );
      })
    })
  }

    // Método para agregar un nuevo mensaje al chat
    async handleAddMessage() {
      if( this.btnDisabled ) return false;
      if( this.audioBlob ) return this.handleSubmitRecording();
      if( !this.msg.txt ) return false;
      this.btnDisabled = true;
      let result:any = await this.handleProcessWhatsapp(this.msg.txt, 'txt');
      this.btnDisabled = false;
      if( result.data.whatsappTxt ){
        result = result.data;
        this.listDetails.push({
          id: result.Whatsapphistorial.id,
          txt: this.msg.txt,
          quien: 1,
          typeTxt: result.Whatsapphistorial.typeTxt,
          urlMedios: result.Whatsapphistorial.urlMedios,
          relationMessage: result.Whatsapphistorial.relationMessage,
        });
        this.scrollToBottom();
        this.msg.txt = "";
      }
    }

    handleProcessWhatsapp( txt:string, type: string ){
      return new Promise( resolve =>{
        let urlHalf = type === 'txt'? '' : txt;
        let Txt = type === 'txt'? txt : '';
        let data = {
            "msx": {
                "from": this.data.from,
                "to": this.data.to,
                "body": `*${ this.dataUser.name }*: \n ${ Txt }`,
                "urlMedios": urlHalf,
                "typeTxt": type,
                "quien": 1,
                "id": 1,
                "userCreate": this.dataUser.id
            },
            "user": { "id": this.dataUser.cabeza }
        };
        this._whatsappDetails.createNewTxtWhatsapp( data ).subscribe( res =>{
          try {
            resolve( res );
          } catch (error) {
            resolve( false );
          }
        },(error)=>resolve( error ) );
      })
    }

      // Método para invertir el orden de los mensajes
    invertMessagesOrder(): void {
      //this.listDetails.reverse();
      //console.log("**60", this.listDetails)
    }

    handleFile( txtFormat:string ){
      const dialogRef = this.dialog.open(FileDetailComponent, {
        width: '50%',
        height: "600px",
        data: {
          format: txtFormat,
          user: this.msg.user
        },
      });

      dialogRef.afterClosed().subscribe(async  ( result ) => {
        console.log('The dialog was closed', result );
        if( !result.id ) {
          for( let row of result ) {
            if( row.type === "application/pdf" ) await this.handleProcessWhatsapp( row.href, 'document');
            else if( row.type === "video/mp4" ) await this.handleProcessWhatsapp( row.href, 'video');
            else  await this.handleProcessWhatsapp( row.href, 'photo');
          }
        }
        if( result.id ){
          await this.handleProcessWhatsapp( result.id, 'flow');
        }

      });
    }

    addEmoji($event){
      console.log("ee", $event );
      try {
        this.msg.txt+= $event.emoji.native;
      } catch (error) { }
    }


    async handleOpenAudioRecorder(){
      this.recording = true;
      await this._audioRecorderService.startRecording();
    }

    async handleStartRecording() {
      this.recording = false;
      this.audioBlob = await this._audioRecorderService.stopRecording();
    }

    async handleSubmitRecording(){
      let result:any = await this._audioRecorderService.uploadAudio( this.audioBlob );
      if( !result.audioFileUrl ) return this._toolsService.basic( this.dataConfig.txtError );
      this.handleProcessWhatsapp( result.audioFileUrl, 'audio');
      this.audioBlob = null;
    }

    handleTrashRecording(){
      this.audioBlob = null;
    }

    openBottomSheetFastAnswer(): void {

      const bottomSheetRef = this._bottomSheet.open(BottomSheetSheetFastAnswer);

      // Escucha el evento después de que se cierre el bottom sheet
      bottomSheetRef.afterDismissed().subscribe((result) => {
        // Maneja el valor devuelto aquí
        console.log('Valor devuelto:', result);
        if( result ) this.msg.txt = result.description;
      });

    }

    openBottomSheetFlows(): void {

      const bottomSheetRef = this._bottomSheet.open(BottomSheetSheetFlows);

      // Escucha el evento después de que se cierre el bottom sheet
      bottomSheetRef.afterDismissed().subscribe((result) => {
        // Maneja el valor devuelto aquí
        console.log('Valor devuelto:', result);
        //this.msg.txt = result.description;
      });

    }

    async handleOpenContact(){
      let item:any = this.data;
      let contact = await this.getContactId( item.contactId.id || item.contactId );
      item.contactId = contact;
      item.check = true;
      const dialogRef = this.dialog.open(DetailContactComponent, {
        data: item,
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }

    async handleClose(){
      let confirm = await this._toolsService.confirm( {title: this.dataConfig.txtDetailsFinChat, text:"", confirmButtonText: this.dataConfig.closeChat } );
      if(!confirm.value) return false;
      if( this.btnDisabled ) return false;
      this.btnDisabled = true;
      let dataWhatsappUser:any = await this.getWhatsappUser( );
      if( dataWhatsappUser ){
        if( dataWhatsappUser.estado === 0 ) {
          let result:any = await this.nextUpdateWhatsappTxtUser( dataWhatsappUser );
          if( result ) this._toolsService.presentToast( this.dataConfig.closeChat );
          this.Router.navigate(['/liveChat', 'aaaaaaaaa' ] );
          this.data = {};
          this.listDetails = [];
          setTimeout(()=>location.reload(), 3000 );
        }
      }
      this.btnDisabled = false;
    }

    nextUpdateWhatsappTxtUser( dataWhatsappUser ){
      return new Promise( resolve =>{
        this._whatsappTxtUser.update( { id: dataWhatsappUser.id, estado: 1 } ).subscribe( res =>{
          resolve( res );
        }, ( error )=> resolve( error ) );
      });
    }

    getWhatsappUser(){
      return new Promise( resolve =>{
        this._whatsappTxtUser.get( {
          whatsappId: this.data.id,
          userId: this.dataUser.id
         } ).subscribe( res =>{
          resolve( res.data[0] );
        }, error => resolve( error ) );
      } );
    }

    getContactId( id ){
      return new Promise( resolve =>{
        this._contactServices.get( { where:{
          id: id
        }, limit: 1} ).subscribe( res => resolve( res.data[0] ), error=> resolve( error ) );
      })
    }

    handleUpdateNumber(){
      this._whatsappDetails.update( { id: this.data.id, numberGuide: this.data.numberGuide } ).subscribe( res => {
        this._toolsService.tooast("Actualizado");
      });
    }

}


@Component({
  selector: 'bottom-sheet-fas-answer',
  templateUrl: 'bottom-sheet-fast-answer.html',
})
export class BottomSheetSheetFastAnswer {
  listFastAnswer:FASTANSWER[];
  dataUser: USERT;
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetSheetFastAnswer>, private _fastAnswerService: FastAnswerService,private _store: Store<USER>,) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    (async ()=>{
      let list:any = await this.getListFastAnswer( { where:{ companyId: this.dataUser.empresa, check: true }, limit: 1000, page: 0 } );
      this.listFastAnswer = list;
    })();
  }

  getListFastAnswer( querys ){
    return new Promise( resolve =>{
      this._fastAnswerService.get( querys ).subscribe( res => resolve( res.data ) , error => resolve( error ) );
    });
  }
  openLink(event: any): void {
    this._bottomSheetRef.dismiss( event );
    //event.preventDefault();
  }
}


@Component({
  selector: 'bottom-sheet-flows',
  templateUrl: 'bottom-sheet-flows.html',
})
export class BottomSheetSheetFlows {
  listInfoWhatsapp:INFOWHATSAPP[];
  dataUser: USERT;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetSheetFlows>,
    private infoWhatsappService: InfoWhatsappService,
    private _store: Store<USER>
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    (async ()=>{
      let list:any = await this.getListInfoWhatsapp( { where:{ estado: 0, user: this.dataUser.cabeza }, limit: 1000, page: 0 } );
      this.listInfoWhatsapp = list;
    })();
  }

  getListInfoWhatsapp( querys ){
    return new Promise( resolve =>{
      this.infoWhatsappService.get( querys ).subscribe( res => resolve( res.data ) , error => resolve( error ) );
    });
  }
  openLink(event: any): void {
    this._bottomSheetRef.dismiss( event );
    //event.preventDefault();
  }
}

