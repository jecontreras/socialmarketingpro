import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { FASTANSWER, USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { FastAnswerService } from 'src/app/servicesComponent/fast-answer.service';


const ELEMENT_DATA: FASTANSWER[] = [];

@Component({
  selector: 'app-fast-answer',
  templateUrl: './fast-answer.component.html',
  styleUrls: ['./fast-answer.component.scss']
})
export class FastAnswerComponent implements OnInit {

  displayedColumns: string[] = ["check", "title", 'description'];
  dataSource = new MatTableDataSource<FASTANSWER>(ELEMENT_DATA);
  selection = new SelectionModel<FASTANSWER>(true, []);
  dataConfig:any = {};
  @ViewChild(MatTable) table: MatTable<FASTANSWER>;
  dataUser: USERT;

  constructor(
    private _fastAnswerService: FastAnswerService,
    private _config: ConfigKeysService,
    private _store: Store<USER>,
    private _toolsService: ToolsService
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });

  }

  async ngOnInit() {
    this.dataSource.data = [];
    let list:any = await this.getList( { where:{ companyId: this.dataUser.empresa, check: true }, limit: 1000 } );
    this.dataSource.data.push( ...list );
    this.table.renderRows();
  }

  getList( querys ){
    return new Promise( resolve =>{
      this._fastAnswerService.get( querys ).subscribe( res => resolve( res.data ) , error => resolve( error ) );
    });
  }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }

      this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: FASTANSWER): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id }`;
    }

    handleCreateNewResponse(){
      this.dataSource.data.unshift( {  } );
      this.table.renderRows();
    }

    async handleSubmit(){
      let list = this.dataSource.data;
      for( let row of this.dataSource.data.filter( item => !item.id ) ){
        let result:any = await this.proccessSubmitSavedFastAnswer( {
          check: true,
          title: row.title,
          description: row.description,
          companyId: this.dataUser.empresa,
          userCreationId: this.dataUser.id
        } );
        row.id = result.id;
      }
      let filter = this.selection.selected;
      for( let row of filter ){
        if( !row.id ) continue;
        if( !row.check ) continue;
        await this.proccessSubmitUpdateFastAnswer( {
          check: true,
          id: row.id,
          title: row.title,
          description: row.description
        } );
      }
      this.dataSource.data = list;
      this.selection.clear();
      this.table.renderRows();
    }

    proccessSubmitSavedFastAnswer( data ){
      return new Promise( resolve =>{
        this._fastAnswerService.create( data ).subscribe( res => resolve( res ), error => resolve( error ) );
      })
    }

    async handleDrop(){
      let list = this.selection.selected;
      for( let row of list.filter( item => ( item.check === true ) && ( item.id ) ) ){
        await this.proccessSubmitUpdateFastAnswer( {
          check: false,
          id: row.id
        } );
        this.dataSource.data = this.dataSource.data.filter( item => item.id === row.id );
        this.selection.clear();
      }
      this._toolsService.presentToast( this.dataConfig.txtUpdate );
      this.table.renderRows();
    }

    proccessSubmitUpdateFastAnswer( data ){
      return new Promise( resolve =>{
        this._fastAnswerService.update( data ).subscribe( res => resolve( res ), error => resolve( error ) );
      })
    }

}
