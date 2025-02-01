import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { OpenConfigTextComponent } from 'src/app/dialog/open-config-text/open-config-text.component';
import { googleSheet, USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { GoogleSheetService } from 'src/app/servicesComponent/google-sheet.service';

const ELEMENT_DATA: googleSheet[] = [];

@Component({
  selector: 'app-google-sheet',
  templateUrl: './google-sheet.component.html',
  styleUrls: ['./google-sheet.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GoogleSheetComponent implements OnInit {

  dataKey:any = {};
  data:googleSheet = {};
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay: string[] = ['accion', 'title', 'description', 'urlGoogle'];
  dataUser: USERT;
  expandedElement: googleSheet | null;
  btnDisabled:boolean = false;

  constructor(
    public configKey: ConfigKeysService,
    private googleSheetServices: GoogleSheetService,
    private _store: Store<USER>,
    private _tools: ToolsService,
    public dialog: MatDialog
  ) { 
    this.dataKey = this.configKey._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  async ngOnInit() {
    let list:any = await this.getFilter( );
    this.dataSource.data = list;
  }

  getFilter(){
    return new Promise( resolve =>{
      this.googleSheetServices.get( { state: 0, company: this.dataUser.empresa } ).subscribe( res => {
        resolve( res.data );
      });
    });
  }

  handleOpen( item:googleSheet ){
    this.data = item;
  }

  async handleProcessSubmit( item:googleSheet ){
    this.btnDisabled = true;
    if( item.id ) await this.handleUpdate( item );
    else await this.handleCreate( item );
    this.btnDisabled = false;
  }

  handleUpdate( item: googleSheet ){
    return new Promise( resolve =>{
      item.user = this.dataUser.id;
      item.company = this.dataUser.empresa;
      this.googleSheetServices.update( item ).subscribe( res =>{
        if( !res ) this._tools.presentToast( this.dataKey.txtError );
        this._tools.presentToast( this.dataKey.txtUpdate );
        resolve( item );
      });
    });
  }

  handleCreate( item: googleSheet ){
    return new Promise( resolve =>{
      item.user = this.dataUser.id;
      item.company = this.dataUser.empresa;
      this.googleSheetServices.create( item ).subscribe( res =>{
        if( !res ) this._tools.presentToast( this.dataKey.txtError );
        this._tools.presentToast( this.dataKey.txtUpdate );
        item.id = res.id;
        resolve( item );
      });
    });
  }

  handleConfig(){
    const dialogRef = this.dialog.open(OpenConfigTextComponent, {
      data: {},
      width: '100%',
    });
  }


  handleNew(){
    this.dataSource.data = [{ state: 0, title: "vacio", description: "vacio",  urlGoogle: "vacio" }, ...this.dataSource.data];
  }

}
