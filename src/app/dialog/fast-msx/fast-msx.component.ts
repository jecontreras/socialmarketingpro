import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { USERT } from 'src/app/interfaces/interfaces';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import * as moment from 'moment';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';
import { BottomSheetSheetFastAnswer } from 'src/app/tools/list-chat-detailed/list-chat-detailed.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-fast-msx',
  templateUrl: './fast-msx.component.html',
  styleUrls: ['./fast-msx.component.scss']
})
export class FastMsxComponent implements OnInit {
  dataConfig:any = {};
  chatForm: FormGroup; // Define el FormGroup
  btnDisabled: boolean;
  data:any = {};
  dataUser:USERT;
  messages: any[] = [];
  newMessage: string = '';
  @ViewChild('chatInput') chatInput!: ElementRef;
  emojiPickerVisible = false;


  constructor(
    private _config: ConfigKeysService,
    public _toolsService: ToolsService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private chatService: ChatService,
    private _whatsappDetails: WhatsappTxtService,
    private _bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FastMsxComponent>,
  ) { 
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]  // Define el control del formulario con validación requerida
    });
  }

  ngAfterViewInit() {
    // Escucha los cambios en el campo de texto y ajusta la altura
    this.chatForm.get('message').valueChanges.subscribe(() => {
      this.adjustTextareaHeight();
    });
    // Espera un poco para asegurarte de que el textarea está visible
    setTimeout(() => {
      this.chatInput.nativeElement.focus();
    }, 200);
  }

  adjustTextareaHeight( optN:string=""  ) {
    const textarea = document.querySelector('.chat-input-area') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; // Reinicia la altura para recalcular
      //console.log("*********135", optN, textarea.scrollHeight)
      textarea.style.height = optN || textarea.scrollHeight + 'px'; // Ajusta a la altura necesaria
    }
  }

  async sendMessage( opt:any = {} ) {
    // Lógica para enviar el mensaje
    if (this.chatForm.valid) {
      for( let item of this.datas ){
        const message = this.chatForm.get('message').value;
        console.log('Mensaje enviado:', message.length );
        if( !message ) continue;
        await this.ProcessTxtChatNew( opt, message,'', 'txt');

      }
      // Restablece el campo después de enviar
      this.chatForm.reset();
      setTimeout(()=> this.adjustTextareaHeight( '34' ), 300 )
    }
    this.closeDialog( [] );
  }

  closeDialog( list ){
    this.dialogRef.close( list );
  }

  ProcessTxtChatNew( opt, message, urlMedios = "", typeMsx ){
    return new Promise( resolve =>{
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
       let validateDate = this.verificarTiempoTranscurrido();
       //console.log("******577 R", validateDate)
       if( validateDate ) this.chatService.initChatopp( newMessage );
       else {
        this.chatService.enviarMensaje( newMessage );
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
        }
        this.newMessage = '';
        resolve( true );
    })
  }

  verificarTiempoTranscurrido() {
    // Fecha actual
    const fechaActual = moment();  // La fecha y hora actuales
    const fechaReferencia = moment(this.data.date, "DD-MM-YYYY HH:mm:ss");

    // Diferencia en horas entre la fecha guardada y la fecha actual
    if (!fechaReferencia.isValid()) {
      console.error('La fecha no es válida');
      return false;
    }
    const diferenciaHoras = fechaActual.diff(fechaReferencia, 'hours');
    //console.log("*******", diferenciaHoras, this.data.date, fechaReferencia)
    // Verifica si la fecha es válida
    // Si la diferencia es mayor a 24 horas
    if (diferenciaHoras >= 24) {
      console.log("**RR YA PASO LAS Horas" );
      this.nextUpdateWhatsappTxt( );
      return true;
    } else {
      console.log('Aún no han pasado 24 horas.');
      return false;
    }
  }

  nextUpdateWhatsappTxt( ){
    return new Promise( resolve =>{
      this._whatsappDetails.update( { id: this.data.id, date: moment( ).format('DD-MM-YYYY, h:mm:ss') } ).subscribe( res =>{
        this.data.date = res.date;
        resolve( res );
      }, ( error )=> resolve( error ) );
    });
  }




  handleEnter(event: KeyboardEvent): void {
    // Enviar el mensaje al presionar Enter
    console.log("*******488*******RRR", event)
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  toggleEmojiPicker() {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  addEmoji(event) {
    //this.newMessage += event.emoji.native;
    const currentMessage = this.chatForm.get('message').value || ''; // Obtener el valor actual, si es null usar ''
    this.chatForm.get('message').patchValue(currentMessage + event.emoji.native);
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

}
