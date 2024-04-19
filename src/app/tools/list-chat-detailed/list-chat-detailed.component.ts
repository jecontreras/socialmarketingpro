import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormFlowsComponent } from 'src/app/dialog/form-flows/form-flows.component';
import { Msg, WhatsappDetails } from 'src/app/interfaces/interfaces';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { WhatsappTxtService } from 'src/app/servicesComponent/whatsappTxt.service';

@Component({
  selector: 'app-list-chat-detailed',
  templateUrl: './list-chat-detailed.component.html',
  styleUrls: ['./list-chat-detailed.component.scss']
})
export class ListChatDetailedComponent implements OnInit {
  @Input() data:WhatsappDetails = {};
  @Output() childEmitter = new EventEmitter<object>();
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  listDetails:WhatsappDetails[];
  msg: Msg= { txt: "", quien: 1  };
  disabledEmoji:boolean = false;

  constructor(
    private _whatsappDetails: WhatsappTxtService,
    public dialog: MatDialog,
    private chatService: ChatService
  ) { }

  async ngOnInit() {
    this.childEmitter.emit( this.data );
    this.chatService.recibirMensajes().subscribe((data: Msg) => {
      console.log("****31", data)
      //this.listDetails.push(data.txt);
    });
  }

  async handleEventFater() {
    // Lógica que deseas ejecutar cuando se llama desde el padre
    console.log('Función ejecutada desde el hijo, entre');
    setTimeout(async()=>{
      if( this.data.id ) {
        console.log("**310",this.data)
        let result:any = await this.getWhatsappDetails();
        this.listDetails = result;
        this.invertMessagesOrder();
        this.scrollToBottom();
      }else this.listDetails = [];
    }, 200)
  }

  scrollToBottom(): void {
    try {
      setTimeout(()=>{
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 100 )
    } catch(err) { }
  }

  getWhatsappDetails(){
    return new Promise( resolve =>{
      this._whatsappDetails.getDetails( { where: { whatsappTxt: this.data.id } } ).subscribe( res =>{
        resolve( res.data );
      })
    })
  }

    // Método para agregar un nuevo mensaje al chat
    async handleAddMessage() {
      if( !this.msg.txt ) return false;
      let result:any = await this.handleProcessWhatsapp();
      if( result.data.whatsappTxt ){
        result = result.data;
        this.listDetails.push({
          id: result.whatsappTxt.id,
          txt: this.msg.txt,
          quien: 1
        });
        this.scrollToBottom();
        this.msg.txt = "";
      }
    }

    handleProcessWhatsapp(){
      return new Promise( resolve =>{
        let data = {
            "msx": {
                "from": this.data.from,
                "to": this.data.to,
                "body": this.msg.txt,
                "urlMedios": "",
                "quien": 1
            },
            "user": { "id": "6545ad04f9b6e13d24d91870"}
        };
        /*this.chatService.enviarMensaje(data);*/
        this._whatsappDetails.createNewTxtWhatsapp( data ).subscribe( res =>{
          resolve( res );
        },(error)=>resolve( error ) );
      })
    }

      // Método para invertir el orden de los mensajes
    invertMessagesOrder(): void {
      //this.listDetails.reverse();
      console.log("**60", this.listDetails)
    }

    handleFile( txtFormat:string ){
      const dialogRef = this.dialog.open(FormFlowsComponent, {
        width: '50%',
        height: "600px",
        data: {
          format: txtFormat,
          user: this.msg.user
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

    addEmoji($event){
      console.log("ee", $event );
      try {
        this.msg.txt+= $event.emoji.native;
      } catch (error) { }
    }

}
