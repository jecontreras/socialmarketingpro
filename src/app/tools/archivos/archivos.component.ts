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
  @Input() acceptFile: string;

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
      console.log("***55", row)
      //this._archivos.create( this.files[0] );
      let res:any;
      if( row.type === "image/gif" ) res = await this._archivos.createGif(form);
      else if( row.type === "application/pdf" ) res = await this.processFile(row);
      else if( ( row.type === "video/mp4" ) || ( row.type === "video/x-m4v" ) || ( row.type === "video/*" ) ) res = await this._archivos.createMedia(form);
      else res = await this._archivos.create(form);
      this.listComplete.push( { href: res.files, type: row.type } );
      this._tools.presentToast("Subido exitoso!!");
      resolve( res.files );
    });
  }

  async processFile( file ){
    let base = await this._tools.getBase64( file );
    let res:any = await this._archivos.createFile( {
      fileBase64: base
    } )
    return { files: res.url, }
  }

}
