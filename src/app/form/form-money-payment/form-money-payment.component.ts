import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FacturaDto as billDto } from 'src/app/interfaces/interfaces';
import { ToolsService } from 'src/app/services/tools.service';
import { FacturaService } from 'src/app/servicesComponent/factura.service';
import { MoneyPaymentService } from 'src/app/servicesComponent/money-payment.service';
import { ProvedorService } from 'src/app/servicesComponent/provedor.service';
import * as _ from 'lodash';
import * as moment from 'moment';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-form-money-payment',
  templateUrl: './form-money-payment.component.html',
  styleUrls: ['./form-money-payment.component.scss']
})
export class FormMoneyPaymentComponent implements OnInit {

  data:any = { date: moment().format("DD/MM/YYYY")};
  id:string;
  titleBTN:string = "Guardar";
  listProvedor:any = [];
  opcionCurrencys:any;
  listBill:billDto[] = [];
  displayedColumns: string[] = ["select","codigo","Fecha", "Monto","Abono Total","Cantidad Abono", "Restante"];
  displayedKeys: string[] = ["select","codigo","fecha", "monto","passMoney","amountPass", "remaining"];
  dataSource = new MatTableDataSource<billDto>(this.listBill);
  selection = new SelectionModel<billDto>(true, []);
  validateButton:boolean = false;
  querys: { where: { estado: number; asentado:boolean; entrada:number; provedor?: string; coinFinix:boolean; }, limit: number; } = { where: { estado:0, asentado:true, entrada: 0, coinFinix:false }, limit: 100000 }
  constructor(
    private activate: ActivatedRoute,
    private _tools: ToolsService,
    private _moneyPayment: MoneyPaymentService,
    private _provedor: ProvedorService,
    private _factura: FacturaService
  ) {
  }

  ngOnInit(): void {
    this.opcionCurrencys = this._tools.currency;
    this.getProvedor();
    this.id = ( this.activate.snapshot.paramMap.get('id'));
    if( this.id ) this.getData();
    else {
      //this.getFacturas();
    }
  }

  getData(){
    this.titleBTN = "Actualizar";
    this._moneyPayment.get( { where: { id: this.id } } ).subscribe(( res:any )=>{
      res = res.data[0];
      this.data = res || {};
      this.getMoneyPayment();
    });
  }

  getMoneyPayment(){
    this._moneyPayment.getBill( { where: { moneyPayments: this.id }, limit: 10000 } ).subscribe( ( data )=>{
      console.log( "****66",data)
      this.listBill = _.map( data.data, ( row )=> {
        const finixData = {
          codigo: row.bill.codigo,
          fecha: row.bill.fecha,
          monto: row.bill.monto,
          passMoney: ( row.bill.monto ) - ( row.bill.passMoney ),
          amountPass: row.coin,
          remaining: row.remaining,
          ...row
        };
        this.selection.toggle( finixData );
        return finixData;
      })
      this.dataSource = new MatTableDataSource<billDto>(this.listBill);
    });
  }

  getProvedor(){
    this._provedor.get( { where: { estado: 0 } } ).subscribe(( res:any )=>{
      this.listProvedor = res.data;
    });
  }

  handleSelectSupplier(){
    console.log( this.data );
    this.querys.where.provedor = this.data.name;
    this.getFacturas();
  }

  getFacturas(){
    this._factura.get( this.querys ).subscribe( ( data )=>{
      this.listBill = data.data;
      this.listBill = _.map( this.listBill, ( row )=>{
        return {
          ...row,
          passMoney: ( row.monto ) - ( row.passMoney ),
          passMoney2: ( row.monto ) - ( row.passMoney ),
        }
      })
      this.dataSource = new MatTableDataSource<billDto>(this.listBill);
    } );
  }

  submit(){
    if( this.id ) return false;
    else this.crearFun();
  }

  updateFun(){
    let data:any = this.data;
    this._moneyPayment.update( data ).subscribe(( res:any )=>{
      this._tools.basic("Actualizado exitoso");
    });
  }
  crearFun(){
    let data = {
      listMoney: this.selection.selected,
      ...this.data
    }
    this._moneyPayment.create( data ).subscribe(( res:any )=>{
      this._tools.basic("Creado exitoso")
      this.id = res.id;
      this.data.id = this.id;
      this.titleBTN= "Actualizar";
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
  checkboxLabel(row?: billDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codigo }`;
  }
  addition(){
    this.data.remaining = this.data.coin;
    let cointReaminig:number = 0;
    for( const item of this.selection.selected ){
      console.log("***158", item)
      item.remaining = Number( ( item.monto - ( item.passMoney || 0 ) ) );
      item.passMoney = ( item.passMoney2 || 0 );
        item.passMoney = ( item.passMoney + item.amountPass ) || 0;
        if( ( item.remaining - Number( item.amountPass ) ) <=- 0 ) item.remaining = 0;
        else item.remaining = ( item.remaining - Number( item.amountPass ) )
        cointReaminig+=item.amountPass;
    }
    this.data.remaining = ( Number( this.data.coin ) - Number( cointReaminig ) ) || 0;
  }
  validateValue( row: billDto ){
    const filter = this.selection.selected.find( ( item ) => item.id === row.id );
    if( !filter ) this.selection.toggle(row)
    if( row.monto >= row.amountPass ){
      this.addition();
    }else {
      row.amountPass = 0;
      row.remaining = row.monto;
      this._tools.tooast({title: "Error problemas! No puedes asignar mas grande que en la factura ", icon: "error"});
    }
  }
}
