import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponent/archivos.service';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.scss']
})
export class ArchivosComponent implements OnInit {

  @Input() _dataConfig: any = {
    files: [],
  };
  files: File[] = [];
  listComplete:any = [];
  @Output() actionEvent = new EventEmitter<void>();
  dataConfig:any = {};

  constructor(
    private _archivos: ArchivosService,
    private _tools: ToolsService,
    private _config: ConfigKeysService
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  async handleProcessFile(){
    for( let row of this.files ){
      await this.fileSubmit( row )
    }
    this.actionEvent.emit( this.listComplete );
  }

  async fileSubmit( row ) {
    return new Promise( async (resolve )=> {
      let form: any = new FormData();
      form.append('file', row);
      this._tools.ProcessTime({});
      //this._archivos.create( this.files[0] );
      let res:any = await this._archivos.create(form);
      this.listComplete.push( res.files );
      this._tools.presentToast("Subido exitoso!!");
      resolve( res.files );
    });
  }

}
