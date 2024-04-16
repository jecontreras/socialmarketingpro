import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovementItemComponent } from '../movement-item/movement-item.component';
import { ToolsService } from 'src/app/services/tools.service';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ContactService } from 'src/app/servicesComponent/contact.service';
import { Contact } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-detail-contact',
  templateUrl: './detail-contact.component.html',
  styleUrls: ['./detail-contact.component.scss']
})
export class DetailContactComponent implements OnInit {
  dataConfig:any = {};
  data:any = {};

  constructor(
    public dialogRef: MatDialogRef<MovementItemComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    private _tools: ToolsService,
    private _config: ConfigKeysService,
    private _contac: ContactService
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
    this.data = this.datas;
  }

  async handleChatClose(){
    let data = {
      id: this.data.id,
      estado: "cerrado"
    };
    let result:Contact = await this.nextProcessContact( data );
    if( result.id ) {
      this._tools.basic( this.dataConfig.txtUpdate );
      this.data.estado = result.estado;
    }else this._tools.basic( this.dataConfig.txtError );

  }

  async handleChatOpen(){
    let data = {
      id: this.data.id,
      estado: "abierto"
    };
    let result:Contact = await this.nextProcessContact( data );
    if( result.id ) {
      this._tools.basic( this.dataConfig.txtUpdate );
      this.data.estado = result.estado;
    }else this._tools.basic( this.dataConfig.txtError );
  }

  nextProcessContact( data ){
    return new Promise( resolve =>{
      this._contac.update( data ).subscribe( res=>{
        resolve( res );
      },(err)=>resolve(err))
    });
  }

}
