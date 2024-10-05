import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, Output, ViewChild,EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Store } from '@ngrx/store';
import { DetailContactComponent } from 'src/app/dialog/detail-contact/detail-contact.component';
import { FileDetailComponent } from 'src/app/dialog/file-detail/file-detail.component';
import { OpenGalleriaComponent } from 'src/app/dialog/open-galleria/open-galleria.component';
import { MSG, USERT, WHATSAPPDETAILS } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { AudioRecorderServiceService } from 'src/app/servicesComponent/audio-recorder-service.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { ContactService } from 'src/app/servicesComponent/contact.service';
import { WhatsappTxtUserService } from 'src/app/servicesComponent/whatsapp-txt-user.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { BottomSheetSheetFastAnswer, BottomSheetSheetFlows } from '../list-chat-detailed/list-chat-detailed.component';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-new-detailed',
  templateUrl: './chat-new-detailed.component.html',
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ transform: 'translateY(50%)', opacity: 0 }))
      ])
    ])
  ],
  styleUrls: ['./chat-new-detailed.component.scss']
})
export class ChatNewDetailedComponent implements OnInit{
  @ViewChild('chatContainer') chatContainer: ElementRef;
  @ViewChild('emojiPicker') emojiPickerRef!: ElementRef;
  @Output() childEmitter = new EventEmitter<object>();
  @Output() dataSent = new EventEmitter<object>();

  @Input() data:WHATSAPPDETAILS = {};

  chatUser = {
    name: 'Victor Landázuri',
    photo: 'https://via.placeholder.com/50'
  };
  newMessage: string = '';
  messages: any[] = [];

  emojiPickerVisible = false;
  chatForm: FormGroup; // Define el FormGroup
  valueSpinner:number = 0;
  id:string;
  dataConfig:any = {};
  dataUser:USERT;
  audioBlob;
  btnDisabled: boolean;

  isAtBottom = true;
  isAtTop = false;


  constructor(
    private fb: FormBuilder,
    private activate: ActivatedRoute,
    private _whatsappDetails: WhatsappTxtService,
    private _store: Store<USER>,
    private _config: ConfigKeysService,
    private _audioRecorderService: AudioRecorderServiceService,
    public _toolsService: ToolsService,
    public dialog: MatDialog,
    private chatService: ChatService,
    private _contactServices: ContactService,
    private Router: Router,
    private _whatsappTxtUser: WhatsappTxtUserService,
    private _bottomSheet: MatBottomSheet,
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    this.chatForm = this.fb.group({
      message: ['', Validators.required]  // Define el control del formulario con validación requerida
    });

    this.processId( true );
    this.childEmitter.emit( this.data );
    this.chatService.recibirMensajes().subscribe(async (data: MSG) => {
      //console.log("****31", data, this.messages)
      this.processMessage( data );
    });

    this.chatService.receiveMessageInit().subscribe(async (data: MSG) => {
      //console.log("****31", data, this.messages)
      try {
        this.processMessage( data );
      } catch (error) {

      }
    });

    this.chatService.receiveMessageUpdateId().subscribe(async (data: MSG) => {
      //console.log("****108", data, this.messages)
      try {
        setTimeout(()=> this.ProcessIdChat( data ), 200 );
      } catch (error) {

      }
    });

  }

  ngAfterViewInit() {
    // Escucha los cambios en el campo de texto y ajusta la altura
    this.chatForm.get('message').valueChanges.subscribe(() => {
      this.adjustTextareaHeight();
    });
  }

  adjustTextareaHeight( optN:string=""  ) {
    const textarea = document.querySelector('.chat-input-area') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; // Reinicia la altura para recalcular
      console.log("*********135", optN, textarea.scrollHeight)
      textarea.style.height = optN || textarea.scrollHeight + 'px'; // Ajusta a la altura necesaria
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const container = this.chatContainer.nativeElement;
    this.isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    this.isAtTop = container.scrollTop === 0;
  }

  ProcessIdChat( data ){
    let dataDbs:any = data.dataDbs;
    let dataChat:any = data.dataFront;
    let filterId = _.findIndex( this.messages, ['id', dataChat.msx.id ] );
    //console.log("******119", filterId )
    if( filterId >= 0 ){
      this.messages[filterId] = dataDbs;
      this.dataSent.emit( this.messages[filterId] ); //el que elimina de la lista cuando se ha respondido
    }
  }

  processMessage( data ){
    try {
      let filter = this.messages.find( row => ( row.id === data.msx.id ) );
      if( !filter ) {
        filter =  this.messages.find( row => ( row.to === data.msx.to ) );
        if( filter ){
          this.messages.push( {
            to: data.msx.to,
            from: data.msx.from,
            id: data.msx.id,
            quien: data.msx.quien,
            urlMedios: data.msx.urlMedios,
            user: data.msx.user,
            createdAt: data.msx.createdAt,
            txt: data.msx.body,
            typeTxt: data.msx.typeTxt,
            sendWhatsapp: data.msx.sendWhatsapp,
            relationMessage: data.msx.relationMessage,
            idWhatsapp: data.msx.idWhatsapp,
            dataRelationMessage: data.msx.relationMessage ? this.messages.find( item => item.idWhatsapp === data.msx.relationMessage ) : null
          });
        }
      }
      //this.invertMessagesOrder();
      if( data.msx.ids === this.data.id ) setTimeout(()=> this.scrollToBottom(), 200 );
    } catch (error) { }
    this.processIdUni();
    //console.log( this.messages )
  }

  processIdUni( ){
    this.messages =_.unionBy(this.messages || [], this.messages, 'id');
  }

  async processId( opt:boolean ){
    this.id = (this.activate.snapshot.paramMap.get('id'));
    if( this.id ) {
      await this.getWhatsappInit( this.id );
      try {
        if( opt === true ) this.handleEventFater();
      } catch (error) { }
    }
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
    //console.log('Función ejecutada desde el hijo, entre', this.data );
    this.messages = [];
    //this.processSpinnerValue('init');
    setTimeout(async()=>{
      if( this.data.id ) {
        this.processId( false );
        let result:any = await this.getWhatsappDetails();
        this.messages = result;
        //this.invertMessagesOrder();
        setTimeout(()=> this.scrollToBottom(), 200 );
        //this.processSpinnerValue('end');
      }else this.messages = [];
    }, 200)
  }

  getWhatsappDetails(){
    return new Promise( resolve =>{
      try {
        this._whatsappDetails.getDetails( { where: { whatsappTxt: this.data.id }, limit: 1000000, sort: "updatedAt ASC" } ).subscribe( res =>{
          res = res.data;
          resolve( res || [] );
        });
      } catch (error) {
        resolve([])
      }
    })
  }

  invertMessagesOrder(): void {
    //this.listDetails.reverse();
    //console.log("**60", this.listDetails)
  }

  processSpinnerValue( opt:string ){
    let interval = setInterval(()=>{
      this.valueSpinner++;
    }, 1000 );
    if( opt === 'end') clearInterval( interval );
  }

  toggleEmojiPicker() {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  addEmoji(event) {
    //this.newMessage += event.emoji.native;
    const currentMessage = this.chatForm.get('message').value || ''; // Obtener el valor actual, si es null usar ''
    this.chatForm.get('message').patchValue(currentMessage + event.emoji.native);
  }


  ngAfterViewChecked() {
    //this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  // Función para hacer scroll hasta arriba
  scrollToTop(): void {
    try {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = 0;
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }

  handleFileInput(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let fileType = file.type.split('/')[0];
        let newFileMessage = {
          sender: 'me',
          text: '',
          file: e.target.result,
          fileType: fileType,
          fileName: file.name,
          createdAt: new Date(),
          replyTo: null
        };
        this.messages.push(newFileMessage);
      };
      reader.readAsDataURL(file);
    }
  }

  /*handleFile( txtFormat:string ){
    const dialogRef = this.dialog.open(FileDetailComponent, {
      width: '50%',
      height: "600px",
      data: {
        format: txtFormat,
        user: this.dataUser
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
  }*/

  handleFile( txtFormat:string ){
    const dialogRef = this.dialog.open(FileDetailComponent, {
      width: '50%',
      height: "600px",
      data: {
        format: txtFormat,
        user: this.dataUser
      },
    });

    dialogRef.afterClosed().subscribe(async  ( result ) => {
      console.log('The dialog was closed', result );
      if( !result.id ) {
        for( let row of result ) {
          let typeMsx = "txt";
          if( row.type === "application/pdf" ) typeMsx = 'document';
          else if( row.type === "video/mp4" ) typeMsx = 'video';
          else  typeMsx="photo";
          this.ProcessTxtChatNew( {}, "", row.href, typeMsx);
        }
      }
      if( result.id ){
        this.ProcessTxtChatNew( {}, '', result.id, 'flow');
      }

    });
  }

  /*sendMessage() {
    // Lógica para enviar el mensaje
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message').value;
      console.log('Mensaje enviado:', message);
      let newMessage = {
        sender: 'me',
        text: message,
        createdAt: new Date(),
        replyTo: null
      };

      this.messages.push(newMessage);
      this.newMessage = '';

      this.checkVisibilityAndNotify(newMessage);
      // Restablece el campo después de enviar
      this.chatForm.reset();
    }

  }*/
  handleProcessWhatsapp( txt:string, type: string, optR:any = {} ){
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
              "seen": 1,
              "userCreate": this.dataUser.id,
              "relationMessage": optR.relationMessage,

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
  async handleSubmitRecording(){
    let result:any = await this._audioRecorderService.uploadAudio( this.audioBlob );
    if( !result.audioFileUrl ) return this._toolsService.basic( this.dataConfig.txtError );
    this.handleProcessWhatsapp( result.audioFileUrl, 'audio');
    this.audioBlob = null;
  }
  /*
  async sendMessage( opt = {} ) {
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    // Lógica para enviar el mensaje
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message').value;
      console.log('Mensaje enviado:', message);
      if( this.audioBlob ) { this.btnDisabled = false; return this.handleSubmitRecording();}
      if( !message ) { this.btnDisabled = false; return false;}
      let result:any = await this.handleProcessWhatsapp(message, 'txt', opt );
      this.btnDisabled = false;
      if( result.data.whatsappTxt ){
        result = result.data;
        let newMessage = {
          id: result.Whatsapphistorial.id,
          txt: message,
          quien: 1,
          typeTxt: result.Whatsapphistorial.typeTxt,
          urlMedios: result.Whatsapphistorial.urlMedios,
          relationMessage: result.Whatsapphistorial.relationMessage,
        };
        this.messages.push( newMessage );
        this.dataSent.emit( result );
        this.newMessage = '';

        this.checkVisibilityAndNotify(newMessage);
        // Restablece el campo después de enviar
        this.chatForm.reset();
        setTimeout(()=> this.scrollToBottom(), 100 );
      }
    }

  }*/

  async sendMessage( opt:any = {} ) {
    if( this.btnDisabled ) return false;
    this.btnDisabled = true;
    // Lógica para enviar el mensaje
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message').value;
      console.log('Mensaje enviado:', message);
      if( !message ) { this.btnDisabled = false; return false;}

      this.btnDisabled = false;
      this.ProcessTxtChatNew( opt, message,'', 'txt');
      // Restablece el campo después de enviar
      this.chatForm.reset();
      this.btnDisabled = false;
      setTimeout(()=> this.scrollToBottom(), 100 );
    }
  }

  ProcessTxtChatNew( opt, message, urlMedios = "", typeMsx ){
    let newMessage = {
      "msx": {
        "from": this.data.from,
        "to": this.data.to,
        "body": `*${ this.dataUser.name }*: \n ${ message }`,
        "urlMedios": urlMedios || "",
        "typeTxt": typeMsx || "txt",
        "quien": 2,
        "id": this._toolsService.codigo(),
        "userCreate": this.dataUser.id,
        "relationMessage": opt.relationMessage || '',
        "sendWhatsapp": 0,
        "seen": 1
      },
      "user": { "id": this.dataUser.cabeza }
    };
    this.messages.push(
      {
        id: newMessage.msx.id,
        txt: message,
        quien: 1,
        typeTxt: newMessage.msx.typeTxt,
        urlMedios: newMessage.msx.urlMedios,
        relationMessage: newMessage.msx.relationMessage,
        sendWhatsapp: 0,
        createdAt: moment().format( "DD-MM-YYYY, H:mm:ss" ),
        seen: newMessage.msx.seen
      }
     );
     this.chatService.enviarMensaje( newMessage );
    this.newMessage = '';
    setTimeout(()=> this.adjustTextareaHeight( '34' ), 300 )
    this.checkVisibilityAndNotify(newMessage);
  }

  handleEnter(event: KeyboardEvent): void {
    // Enviar el mensaje al presionar Enter
    console.log("*******488*******RRR", event)
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  forwardMessage(message) {
    let textToAdd = prompt('Agrega un comentario al reenviar este mensaje:');

    if (textToAdd !== null) {
      let forwardedMessage = {
        sender: 'me',
        text: `${textToAdd} (Reenviado: ${message.txt})`,
        createdAt: new Date(),
        dataRelationMessage: message,
        relationMessage: message.id

      };
      this.chatForm.patchValue({
        message: forwardedMessage.text
      });
      this.sendMessage( forwardedMessage )
      //this.messages.push(forwardedMessage);
    }
  }

  checkVisibilityAndNotify(message) {
    if (document.hidden) {
      if (Notification.permission === 'granted') {
        new Notification('Nuevo mensaje', {
          body: message.text,
          icon: 'https://via.placeholder.com/50'
        });
      }
    }
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

  getContactId( id ){
    return new Promise( resolve =>{
      this._contactServices.get( { where:{
        id: id
      }, limit: 1} ).subscribe( res => resolve( res.data[0] ), error=> resolve( error ) );
    })
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
        this.messages = [];
        //setTimeout(()=>location.reload(), 3000 );
      }
    }
    this.btnDisabled = false;
  }

  getWhatsappUser(){
    return new Promise( resolve =>{
      this._whatsappTxtUser.get( {
        where:{
          whatsappId: this.data.id,
          userId: this.dataUser.id
        }
       } ).subscribe( res =>{
        resolve( res.data[0] );
      }, error => resolve( error ) );
    } );
  }

  nextUpdateWhatsappTxtUser( dataWhatsappUser ){
    return new Promise( resolve =>{
      this._whatsappTxtUser.update( { id: dataWhatsappUser.id, estado: 1, sendAnswered: 2 } ).subscribe( res =>{
        resolve( res );
      }, ( error )=> resolve( error ) );
    });
  }

  handleUpdateNumber(){
    this._whatsappDetails.update( { id: this.data.id, numberGuide: this.data.numberGuide } ).subscribe( res => {
      this._toolsService.tooast("Actualizado");
    });
  }

  handleOpenFlows( item ){
    let dataR = item.urlMedios;
    if( !item.urlMedios ) dataR = '6674836073fab5001539ab25';
    const dialogRef = this.dialog.open(OpenGalleriaComponent, {
      width: '50%',
      data: { id: dataR },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openBottomSheetFastAnswer(): void {

    const bottomSheetRef = this._bottomSheet.open(BottomSheetSheetFastAnswer);

    // Escucha el evento después de que se cierre el bottom sheet
    bottomSheetRef.afterDismissed().subscribe((result) => {
      // Maneja el valor devuelto aquí
      console.log('Valor devuelto:', result);
      if( result ) {
        this.chatForm.patchValue({
          message: result.description
        });
      }
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

  scrollToMessage(messageId: string) {
    const element = document.getElementById(messageId);
    if (element) {
      // Hacer scroll hacia el mensaje
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Añadir la clase de resaltado temporalmente
      element.classList.add('highlight');

      // Quitar la clase de resaltado después de 2 segundos
      setTimeout(() => {
        element.classList.remove('highlight');
      }, 2000);
    }
  }

  handleDropChatMsx(){

  }

  async handleCheckChat(){
    let utr = await this.handleUpdateState( { id:  this.id, checkOrder: 1 } );
    this._toolsService.tooast( { title: this.dataConfig.txtUpdate } )

  }

  async handleUpdateState( data ){
    return new Promise( resolve=>{
      this._whatsappDetails.update( data ).subscribe( res => resolve( res ),error => resolve( error ) );
    });
  }

}
