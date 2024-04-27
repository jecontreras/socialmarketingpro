import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ToolsService } from 'src/app/services/tools.service';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { XlsService } from 'src/app/servicesComponent/xls.service';
import { USER } from 'src/app/interfaces/user';
import { Store } from '@ngrx/store';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DetailContactComponent } from 'src/app/dialog/detail-contact/detail-contact.component';
import { OpenQrComponent } from 'src/app/dialog/open-qr/open-qr.component';
import { FormBellDialogComponent } from 'src/app/dialog/for-bell-dialog/form-bell-dialog.component';
import { FormFlowsComponent } from 'src/app/dialog/form-flows/form-flows.component';
import { FormTagComponent } from 'src/app/dialog/form-tag/form-tag.component';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}
@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TablaComponent implements OnInit {
  @Input() _dataConfig: any = {
    titulo: "",
    returnHTML: "",
    model: "",
    btn:{
      btnCrear: {
        titulo: "",
        click: ""
      }
    },
    tablet:{
      headers:[],
      keys:[],
      row:[]
    }
  };
  querys:any = {};
  _model:any;
  notscrolly: boolean = true;
  notEmptyPost: boolean = true;
  opcionCurrencys:any;

  expandedElement: PeriodicElement | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  listXls:any = [];
  txtSupplier:string;
  dataDummary = {
    sumPending: 0,
    paymentsTotal: 0
  };
  dataUser:any = {};
	hoveredDate: NgbDate | null = null;

	fromDate: NgbDate;
	toDate: NgbDate | null = null;
  viewDisabled:boolean = false;
  urlFront:string = window.location.origin;
  txtFilter:string;
  txtTipeFill:string = '1';

  constructor(
    private _router: Router,
    private _xls: XlsService,
    public _tools: ToolsService,
    private _store: Store<USER>,
    calendar: NgbCalendar,
    public dialog: MatDialog
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    /*this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);*/
  }

  ngOnInit(): void {
    this.opcionCurrencys = this._tools.currency;
    console.log("***", this._dataConfig )
    this.querys = this._dataConfig.querys || {};
    this._model = this._dataConfig.model;
    this.querys.page = 0;
    this.getList();
    if( ( this._dataConfig.returnHTML === 'formmoneypayment/' ) || this._dataConfig.returnHTML === 'formfactura/' ) this.getSupplier();
  }

  getSupplier(){
  }

  pageEvent(ev: any) {
    this.querys.page = ev.pageIndex;
    this.querys.limit = ev.pageSize;
    this.isLoadingResults = true;
    this.isRateLimitReached = true;
    this.getList();
  }

  onScroll() {
    if (this.notscrolly && this.notEmptyPost) {
      this.notscrolly = false;
      this.querys.page++;
      this.getList();
    }
  }

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  getDetail(){
    this._model.getDetail({ user: this.dataUser.id, provedor: this.txtSupplier } ).subscribe(( res:any )=>{
      res = res.data;
      console.log("*****102", res)
      this.dataDummary = {
        sumPending: res.sumPending || 0,
        paymentsTotal: res.paymentsTotal || 0
      }
    });
  }

  getList(){
    console.log("**", this.querys)
    this._model.get( this.querys ).subscribe( ( res:any  )=>{
      this.resultsLength = res.count;
      this._dataConfig.tablet.row.push(... res.data);
      this._dataConfig.tablet.row =_.unionBy(this._dataConfig.tablet.row || [], res.data, 'id');
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      try {
        for( const item of this._dataConfig.tablet.row ){
          if( item.asentado == false ) { item.warning = true; item.full = false;  item.danger = false;}
          if( item.fechaasentado ){
            if( item.tipoFactura == 1 && item.coinFinix == false ){
              let date_1:any = new Date( moment( item.fechaasentado ).format("YYYY-DD-MM") );
              let date_2:any = new Date( moment( ).format("YYYY-MM-DD") );
              let date_expire:any = new Date( item.expiration );
              let day_as_milliseconds = 86400000;

              let diff_in_millisenconds = date_2 - date_1;
              let day = diff_in_millisenconds / day_as_milliseconds;
              if( item.expiration ){
                let expire = item.expireDate = ( date_expire - date_2) / 86400000;;
                item.expireDate = expire;
              }
              if(  day >= 5 ) { item.warning = true; item.danger = false; item.full = false; }
              if(  day >= 14 ) { item.warning = false; item.full = false;  item.danger = true; }
            }
          }
          if( item.coinFinix ) { item.warning = false; item.full = true;  item.danger = false; }
          if( item.listColor ){
            for( const key of item.listColor ) {
              key.amount = ( _.sumBy(key.listTalla, 'cantidad') || 1 );
              let filter = key.listTalla.find( ( oll )=> oll.cantidad <= 5 );
              if( filter ) { item.warning = false; item.full = false;  item.danger = true;}
              filter = key.listTalla.find( ( oll )=> oll.cantidad <= 10 );
              if( filter ) { item.warning = true; item.full = false;  item.danger = false; }
              for(let kepi of key.listTalla ) if( kepi.cantidad <= 5 ) { item.warning = false; item.full = false;  item.danger = true;}
            }
          }
        }
      } catch (error) { console.error("****130", error)}
      this.listXls = this._dataConfig.tablet.row;
      console.log("****", this._dataConfig.tablet.row)
    });
  }


  filterTxt(){
    this.querys.page = 0;
    this._dataConfig.tablet.row = [];
    this.resultsLength = 0;
    this.isLoadingResults = true;
    this.isRateLimitReached = true;
    if( this.txtFilter ){
      if( ( this._dataConfig.returnHTML === 'formbell/' ) ) this.querys.where.numero = this.txtFilter;
    }
    this.getList();
    if( this._dataConfig.returnHTML === 'formfactura/' ) this.getDetail();
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
    this.querys.page = 0;
  }

  openVer( item ){
    window.open( `${ this.urlFront }/#/${ this._dataConfig.returnHTML }${ item.id }`, "Detalles", "width=2000, height=900");
    //this._router.navigate([ this._dataConfig.returnHTML, item.id]);
  }

  async deleteItem( item:any ){
    if( item.asentado == true ) return this._tools.basic("Problemas al Eliminar Item no se puede porque ya se encuentra asentado");
    let confirm = await this._tools.confirm( {title:"Eliminar", detalle:"Deseas Eliminar Dato", confir:"Si Eliminar"} );
    if(!confirm.value) return false;
    let data ={
      id: item.id,
      estado: 1,
      completo: true
    };
    this._model.update( data ).subscribe( (res:any )=>{
      this._dataConfig.tablet.row =  _.filter( this._dataConfig.tablet.row, ( row:any ) => row.id != data.id );
    },()=>this._tools.basic("Problemas al Eliminar Item") );
  }

  print(){
    //window.print();
    this._xls.exportAsExcelFile( this.listXls, "Articulos");
  }

  handleActivateMenu(){
    this.viewDisabled = !this.viewDisabled;
  }

  handleOpenDialogContact( item:any ){
    let data = { contactId: item || {} }
    const dialogRef = this.dialog.open(DetailContactComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleOpenDialogQr( item ){
    const dialogRef = this.dialog.open(OpenQrComponent, {
      width: '50%',
      height: "600px",
      data: { qr: item.qr },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleUpdateBell(item){
    const dialogRef = this.dialog.open(FormBellDialogComponent, {
      width: '50%',
      height: "600px",
      data: item || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleOpenDialogFlows(item){
    const dialogRef = this.dialog.open(FormFlowsComponent, {
      width: '100%',
      data: item || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleOpenDialogTag(item){
    const dialogRef = this.dialog.open(FormTagComponent, {
      width: '50%',
      data: item || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
