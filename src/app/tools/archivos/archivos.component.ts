import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MovementItemComponent } from 'src/app/dialog/movement-item/movement-item.component';
import { OpenGalleriaComponent } from 'src/app/dialog/open-galleria/open-galleria.component';
import { GALERIA, USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ArchivosService } from 'src/app/servicesComponent/archivos.service';
import { GaleriaService } from 'src/app/servicesComponent/galeria.service';

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
  dataUser: USERT;
  listGalleria:GALERIA;

  constructor(
    public dialogRef: MatDialogRef<MovementItemComponent>,
    private _archivos: ArchivosService,
    private _tools: ToolsService,
    private _config: ConfigKeysService,
    private _galeria: GaleriaService,
    private _store: Store<USER>,
    public dialog: MatDialog
  ) {
    this.dataConfig = _config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
  }

  async ngOnInit() {
    this.listGalleria = await this.getListGalleria();
  }

  getListGalleria(){
    return new Promise( resolve =>{
      this._galeria.get( { where: { user: this.dataUser.id  }, limit: 10000 } ).subscribe( res => resolve( res.data ), error => resolve( [] ) );
    });
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
      this.listComplete.push( { href: res.files, type: row.type, check: true } );
      this._tools.presentToast("Subido exitoso!!");
      resolve( res.files );
    });
  }

  async processFile( file ){
    let base = await this._tools.getBase64( file );
    let res:any = await this._archivos.createFile( {
      fileBase64: base
    } )
    return { files: res.Location, }
  }

  handleOpenDialogV( item ){
    const dialogRef = this.dialog.open(OpenGalleriaComponent, {
      width: '50%',
      data: item || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleSelect( item ){
    this.dialogRef.close( item );
  }

}
