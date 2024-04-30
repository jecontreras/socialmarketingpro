import { Component, OnInit } from '@angular/core';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent implements OnInit {
  dataConfig:any = {};
  id:string;
  listGallery:any = [];
  selectList = [];
  constructor(
    private _config: ConfigKeysService,
    public dialogRef: MatDialogRef<FileDetailComponent>,
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
  }

  handleChildAction( event ) {
    console.log('Se recibió una acción del hijo', event);
    this.listGallery = event;
    // Aquí puedes agregar la lógica que deseas ejecutar en respuesta a la acción del hijo
  }

  handleSelectImg( photo ){
    let filter = this.selectList.find( item => item === photo );
    if( filter ) return false;
    this.selectList.push( photo );
  }

  handleEndFile(){
    this.closeDialog( this.selectList );
  }

  closeDialog( list ){
    this.dialogRef.close( list );
  }


}
