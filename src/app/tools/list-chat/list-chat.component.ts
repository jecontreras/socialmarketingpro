import { Component, OnInit, ViewChild } from '@angular/core';
import { USERT, WHATSAPPDETAILS } from 'src/app/interfaces/interfaces';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import * as _ from 'lodash';
import { FormAllChatComponent } from 'src/app/dialog/form-all-chat/form-all-chat.component';
import { MatDialog } from '@angular/material/dialog';
import { USER } from 'src/app/interfaces/user';
import { Store } from '@ngrx/store';
import { ToolsService } from 'src/app/services/tools.service';
import { ListChatOptionComponent } from '../list-chat-option/list-chat-option.component';
import { ChatNewDetailedComponent } from '../chat-new-detailed/chat-new-detailed.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as moment from 'moment';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {
  dataConfig:any = {};
  dataSelect:WHATSAPPDETAILS = {};
  dataUser: USERT;
  @ViewChild(ListChatOptionComponent) listChatOption: ListChatOptionComponent;  // Accedemos al hijo 2
  @ViewChild('sonChat') sonChat: ChatNewDetailedComponent;
  @ViewChild('dataSentDestroy1') dataSentDestroy1: ListChatOptionComponent;
  @ViewChild('dataSentDestroy2') dataSentDestroy2: ListChatOptionComponent;
  @ViewChild('dataSentDestroy3') dataSentDestroy3: ListChatOptionComponent;

  querys1:any = { where:{ } };
  querys2:any = { where:{ } };
  querys3:any = { where:{ } };
  selectedTabIndex: number = 0;
  rolName: string;

  constructor(
    private _config: ConfigKeysService,
    public dialog: MatDialog,
    private _store: Store<USER>,
    public _toolsService: ToolsService,
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      if( this.dataUser.id ) this.rolName = this.dataUser.rol.nombre;
    });
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Permission granted');
      })
      .catch((err) => {
        console.error('Permission denied:', err);
      });
      const startDate = moment().startOf('day').toDate(); // Desde ayer a las 00:00
      const endDate = moment().endOf('day').toDate(); // Hasta hoy a las 23:59:59

      this.querys1 = {
        where:{
          userId: this.dataUser.id,
          assignedMe: 0,
          estado: 0,
          sendAnswered: [0,1],
          whatsappId: { '!=': null },
          updatedAt: {
            '>=': startDate,
            '<=': endDate
          }
        },
        sort: 'updatedAt DESC',
        limit: 1000000,
        page: 0
      };
      this.querys2 = {
        where:{
          userId: this.dataUser.id,
          assignedMe: 0,
          estado: 0,
          sendAnswered: 1,
          whatsappId: { '!=': null },
          updatedAt: {
            '>=': startDate,
            '<=': endDate
          }
        },
        sort: 'updatedAt DESC',
        limit: 1000000,
        page: 0
      };
      this.querys3 = {
        where:{
          assignedMe: 0,
          estado: 1,
          whatsappId: { '!=': null },
          updatedAt: {
            '>=': startDate,
            '<=': endDate
          }
        },
        sort: 'updatedAt DESC',
        limit: 1000000,
        page: 0
      };
      if( this.rolName !== 'montador' ) this.querys3.where.userId = this.dataUser.id;
  };

  btnDataDs = {
    tab1: true,
    tab2: true,
    tab3: true
  };

  async ngOnInit() {
    setTimeout( ()=> this.handleProcessTab( 0 ), 200 )
  }

  handleOpenAllChat(){
    const dialogRef = this.dialog.open(FormAllChatComponent, {
      data: { },
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result );
    });
  }

  goToTab(index: number) {
    this.selectedTabIndex = index;
  }

  onTabClick( event: MatTabChangeEvent ){
    let numberTab = event.index;
    this.handleProcessTab( numberTab );
  }

  handleProcessTab( tabIndex: number ){
    if( tabIndex === 0  && ( this.btnDataDs.tab1 === true ) ) { this.btnDataDs.tab1= false; this.dataSentDestroy1.reloadCharge( ); }
    if( tabIndex === 1  && ( this.btnDataDs.tab2 === true ) ) { this.btnDataDs.tab2= false; this.dataSentDestroy2.reloadCharge( ); }
    if( tabIndex === 2  && ( this.btnDataDs.tab3 === true ) ) { this.btnDataDs.tab3= false; this.dataSentDestroy3.reloadCharge( ); }
  }

  receiveChatDestroy( item ){
    //console.log("******item", item )
    //if( this.selectedTabIndex === 0 ) this.goToTab( 1 );
    this.dataSentDestroy1.handleDataSentDestroy( item );
    this.dataSentDestroy2.handleDataSentDestroy( item );
    this.dataSentDestroy3.handleDataSentDestroy( item );

  }


  receiveDataDestroyChat( item ){
    //console.log( "*****item", item )
  }


  receiveDataFrom(data: WHATSAPPDETAILS) {
    //console.log('Padre recibió los datos del Hijo 1:', data);
    // Aquí llamamos a la función del Hijo 2
    this.dataSelect = data;
    setTimeout(()=> this.sonChat.handleEventFater(), 100 );
  }

}
