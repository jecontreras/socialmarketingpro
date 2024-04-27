import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormFlowsComponent } from 'src/app/dialog/form-flows/form-flows.component';
import { MSG, USERT, WHATSAPPDETAILS } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ChatService } from 'src/app/servicesComponent/chat.service';
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

  constructor(
    private _whatsappDetails: WhatsappTxtService,
    public dialog: MatDialog,
    private chatService: ChatService,
    private _store: Store<USER>,
    private activate: ActivatedRoute,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });

  }

  async ngOnInit() {
    let id = (this.activate.snapshot.paramMap.get('id'));
    if( id ) {
      await this.getWhatsappInit( id );
      this.handleEventFater();
    }

    this.childEmitter.emit( this.data );
    this.chatService.recibirMensajes().subscribe(async (data: MSG) => {
      //console.log("****31", data)
      try {
        let filter = await this.listDetails.find( row => row.id === data.msx.id );
        if( !filter ) this.listDetails.push( {
          to: data.msx.to,
          from: data.msx.from,
          id: data.msx.id,
          quien: data.msx.quien,
          urlMedios: data.msx.urlMedios,
          user: data.msx.user,
          txt: data.msx.body
        });
        this.invertMessagesOrder();
        this.scrollToBottom();
      } catch (error) { }
      //this.listDetails.push(data.txt);
    });
  }

  getWhatsappInit( id:string ){
    return new Promise( resolve =>{
      this._whatsappDetails.get( { where: { id: id } } ).subscribe( res =>{
        this.data = res.data[0] || {};
        resolve( true );
      }, error => resolve( false ) );
    })
  }

  async handleEventFater() {
    // Lógica que deseas ejecutar cuando se llama desde el padre
    console.log('Función ejecutada desde el hijo, entre', this.data );
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
    setTimeout(()=>{
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (error) {}
    }, 100 )
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
                "quien": 1,
                "id": 1
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
