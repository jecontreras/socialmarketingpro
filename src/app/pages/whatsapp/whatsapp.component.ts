import { Component, OnInit } from '@angular/core';
import { GALERIA, USERT } from 'src/app/interfaces/interfaces';
import { MessageService } from 'src/app/servicesComponent/message.service';
import * as _ from 'lodash';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { FormWhatsappComponent } from 'src/app/dialog/form-whatsapp/form-whatsapp.component';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {
  displayedColumns: string[] = ['Opcion','Titulo', 'Estado', 'Creado', 'UserC'];
  dataSource:GALERIA[] = [];
  querys:any = {
    where:{
      tipoEnvio: 2
    },
    page: 0,
    limit: 10
  };
  dataUser:USERT;
  resultsLength = 0;

  constructor(
    private _message: MessageService,
    private _store: Store<STORAGES>,
    public dialog: MatDialog,
    private _tools: ToolsService
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  ngOnInit(): void {
    this.getDataInit();
  }

  resetGet(){
    this.querys.page = 0;
    this.getDataInit();
  }

  async handleDropItem( item ){
    let alert = await this._tools.confirm( { title: "Eliminar Item " } );
    console.log("***", alert );
    if( alert.value === true  ){
      this._message.update( { id: item.id, estado: 1 } ).subscribe( res => {
        this._tools.presentToast("Eliminado");
        item.estado = res.estado;
      });
    }
  }

  async getDataInit(){
    if( this.dataUser.rol.nombre !== 'admin') this.querys.where.creado = this.dataUser.id;
    let list:any = await this.getList( this.querys );
    this.dataSource = _.unionBy(this.dataSource || [], list.data, 'id');
    this.resultsLength = list.count;
    console.log("**********32", this.dataSource, list )
  }

  getList( querys ){
    return new Promise( resolve =>{
      this._message.get( querys ).subscribe( res =>{
        resolve( res );
      } )
    });
  }

  pageEvent(ev: any) {
    this.querys.page = ev.pageIndex;
    this.querys.limit = ev.pageSize;
    this.getDataInit();
  }

  handleOpenDialog( obj ){
    const dialogRef = this.dialog.open(FormWhatsappComponent, {
      width: '100% !important',
      data: obj || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.querys.page = 0;
    });
  }

}
