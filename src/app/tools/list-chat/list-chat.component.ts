import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CdkDragDrop,moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { WhatsappTxtUserService } from 'src/app/servicesComponent/whatsapp-txt-user.service';
import { SequencesService } from 'src/app/servicesComponent/sequences.service';
import * as moment from 'moment';
import { USER } from 'src/app/interfaces/user';
import { Store } from '@ngrx/store';
import { MSG, USERT } from 'src/app/interfaces/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { OpenChatComponent } from 'src/app/dialog/open-chat/open-chat.component';
import { FormControl, FormGroup } from '@angular/forms';
import { ToolsService } from 'src/app/services/tools.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {

  listChat = [];
  dataConfig:any = {};
  dataUser: USERT;
  rolName: string;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
 
  constructor(
    private _config: ConfigKeysService,
    private _userChat: WhatsappTxtUserService,
    private _sequences: SequencesService,
    private _store: Store<USER>,  
    public dialog: MatDialog,
    private _tools: ToolsService,
    private chatService: ChatService
  ) {
    this.dataConfig = this._config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      if( this.dataUser.id ) this.rolName = this.dataUser.rol.nombre;
    });
  };

  async ngOnInit() {
    const startDate = moment().startOf('day').toDate(); // Desde ayer a las 00:00
    const endDate = moment().endOf('day').toDate(); // Hasta hoy a las 23:59:59

    this.range = new FormGroup({
      start: new FormControl(moment().startOf('day').toDate()),  // Fecha de inicio
      end: new FormControl(moment().endOf('day').toDate())       // Fecha de final
    });

    this.getFilter( startDate, endDate );
    this.handleEvent();
  }

  handleEvent(){
    this.chatService.receiveChatAssigned().subscribe(async (data: MSG) => {
      console.log("****77", data, this.listChat)
       
    });
    this.chatService.recibirMensajes().subscribe(async (data: MSG) => {
      console.log("****81", data, this.listChat)
      this.handleProccessChat( data );

    });
    this.chatService.receiveMessageUpdateId().subscribe(async (data: MSG) => {
      console.log("*******85", data )

    });
  }

  handleProccessChat(dataChat) {
    let idTabs = this.listChat.find(item => item.id === dataChat.whatsappUserTxt.sequenceId);
  
    if (idTabs) {
      let indexIdChat = _.findIndex(idTabs.listChat, { id: dataChat.whatsappUserTxt.id });
  
      if (indexIdChat >= 0) {
        // Actualizar chat existente
        idTabs.listChat[ indexIdChat ].whatsappId['txt'] = dataChat.msx.body;
        idTabs.listChat[ indexIdChat ].updatedAt = dataChat.msx.createdAt;
        idTabs.listChat[ indexIdChat ].countChatV++;
      } else {
        // Agregar nuevo chat
        idTabs.listChat = [
          {
            ...dataChat.whatsappUserTxt,
            countChatV: 1,
            whatsappId: {
              id: dataChat.msx.whatsappId,
              Sinto: this._tools.formatNumer( dataChat.msx.to ),
              txt: dataChat.msx.body,
            },
            contactIdList: {
              Sinto: this._tools.formatNumer( dataChat.msx.to ),
              id: dataChat.msx.contactId.id,
              name: dataChat.msx.contactId.name,
            },
            updatedAt: dataChat.msx.createdAt,
          },
          ...idTabs.listChat, // Insertar al inicio
        ];
      }
  
      // Ordenar los chats después de agregar/actualizar
      this.sortChatsByDate(idTabs);
  
      // Asignar una nueva referencia al array principal
      this.listChat = [...this.listChat];
    }
  
    // Eliminar el chat de otras columnas
    this.listChat = this.listChat.map(item => {
      if (item.id !== dataChat.whatsappUserTxt.sequenceId) {
        return {
          ...item,
          listChat: item.listChat.filter(row => row.id !== dataChat.whatsappUserTxt.id),
        };
      }
      return item;
    });
  
    console.log("***105", this.listChat);
  }
  

  sortChatsByDate(column) {
    column.listChat.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA; // Orden descendente
    });
  }

  async getFilter( startDate, endDate ){
    let result:any = await this.getchat( startDate, endDate );
    this.listChat = result.data;
    for( let row of this.listChat ) this.sortChatsByDate( row );
  }

  getchat( startDate, endDate ){
    return new Promise( resolve => {
      this._sequences.getTabsLive( {
        "where":{
            "estado": 0,
            "updatedAt": {
                ">=": startDate,
                "<=": endDate
            },
            "companyId": this.dataUser.empresa
        },
        "updatedAt": "DESC",
        "populate": "whatsappId",
        "UserC": this.dataUser.id,
        "limit": 100
    } ).subscribe( res => {
        resolve( res );
      }, ( error )=> { resolve( error ) } ); 
    });
  }

  handleFilterDate(){
    const startDate = moment( this.range.value.start ).startOf('day').toDate(); // Desde ayer a las 00:00
    const endDate = moment(this.range.value.end).endOf('day').toDate(); // Hasta hoy a las 23:59:59
    console.log("*****226", startDate, endDate );
    this.getFilter( startDate, endDate );
  }

   // Generar lista conectada para arrastrar
   get connectedLists() {
    return this.listChat.map((_, index) => `cdk-drop-list-${index}`);
  }

  onDropColumn(event: CdkDragDrop<any[]>) {
    console.log("****,,", event)
    // Mueve las columnas en el array
    moveItemInArray(this.listChat, event.previousIndex, event.currentIndex);
  
    // Crear el nuevo orden para enviarlo al backend
    const updatedColumnOrder: any = this.listChat.map((column, index) => ({
      id: String( column.id ),  // ID de la columna
      order: Number( index )    // Nuevo orden
    }));
    for( let row of updatedColumnOrder ) this.handleUpdateColSequence( row );
    console.log("****108", updatedColumnOrder )
    this._tools.basic( this.dataConfig.txtUpdate )
  }

  handleUpdateColSequence( data:{ id: string; order: number} ){
    return new Promise( resolve =>{
      this._sequences.update( data ).subscribe( res => {
        resolve( true );
      });
    });
  }

  // Manejar arrastre
  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log("***150", event)
  }
  // Agregar nueva columna
  addColumn() {
    this.listChat.push({ sequences: 'Nueva columna', listChat: [] });
  }

  // Eliminar columna
  async deleteColumn(column: any) {
    //console.log("**115", column );
    let validConfirm = await this._tools.confirm( { title: "Eliminar", text: "Deseas eliminar este item" } );
    console.log("****119", validConfirm)
    if( !validConfirm.value ) return false;
    // Elimina la columna seleccionada
    const columnIndex = this.listChat.indexOf(column);
    if (columnIndex !== -1) {
      this.listChat.splice(columnIndex, 1);
      await this.handleDropDbsSequences( column.id )
    }
  }
  handleDropDbsSequences( id:string ){
    return new Promise( resolve =>{
      this._sequences.update( { id: id, state: 'eliminado' } ).subscribe( res => {
        resolve( true );
      });
    });
  }

  openChatDialog(item: any): void {
    console.log("ABRIENDO DIALOG", this.listChat)
    const dialogRef = this.dialog.open(OpenChatComponent, {
      data: item || {},
      width: '100%',
    });

  }
  addColumnAfter(column: any): void {
    // Encuentra el índice de la columna actual
    const columnIndex = this.listChat.indexOf(column);
  
    // Crea una nueva columna vacía
    const newColumn = {
      sequences: 'Nueva columna',
      listChat: [], // Lista vacía
      user: this.dataUser.cabeza,

    };
    this.handleCreteSequences( newColumn );
    // Inserta la nueva columna justo después de la columna actual
    this.listChat.splice(columnIndex + 1, 0, newColumn);
  }
  handleCreteSequences( data ){
    return new Promise( resolve => {
      this._sequences.create( data ).subscribe( res =>{
        resolve( res );
      });
    });
  }
  handleUpdateDbsSequences( id:string, sequences:string ){
    return new Promise( resolve =>{
      this._sequences.update( { id: id, sequences: sequences } ).subscribe( res => {
        this._tools.basic( this.dataConfig.txtUpdate )
        resolve( true );
      });
    });
  }
}