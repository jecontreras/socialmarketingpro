import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-movement-item',
  templateUrl: './movement-item.component.html',
  styleUrls: ['./movement-item.component.scss']
})
export class MovementItemComponent implements OnInit {
  dataSource = {};
  listcolor:any= [];
  data:any = {};
  tablet:any = {
    headers:["Movimiento","Cantidad anterior","Cantidad","Cantidad Total","Fecha MV","Descipcion"],
    row:[],
    keys: ["tipoEntrada","valorAnterior","valor","valorTotal","createdAt", "descripcion"]
  }

  constructor(
    public dialogRef: MatDialogRef<MovementItemComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _tools: ToolsService,
  ) {
    console.log("***20", this.datas)
    this.listcolor = [this.datas];
    this.getDetails();
  }

  async getDetails(){
    for( let row of this.listcolor){
      for( let item of row.listTalla ){
        item.listLogEntrada = await this.getLogs( item.id, 0 );
        //item.listLogSalida = await this.getLogs( item.id, 1 );
      }
    }
  }

  async getLogs( ids:any, tipo:any ){
    return new Promise( resolve =>{

    });
  }

  ngOnInit(): void {
    this.dataSource = this.datas.datos || {};
  }

  printArticulo(){
    setTimeout(()=>{
      this._tools.print();
    }, 2000 );

   }

  close(){
    this.dialogRef.close( this.dataSource );
  }

}
