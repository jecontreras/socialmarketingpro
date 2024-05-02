import { Component, Inject, OnInit } from '@angular/core';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToolsService } from 'src/app/services/tools.service';

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
  acceptFile = [
    {
      format: "photo",
      accept: "image/jpeg,image/jpg,image/png,image/gif"
    },
    {
      format: "video",
      accept: "video/mp4,video/x-m4v,video/*"
    },
    {
      format: "document",
      accept: "application/pdf"
    },
  ];
  selectAcceptFile:string;
  constructor(
    private _config: ConfigKeysService,
    public dialogRef: MatDialogRef<FileDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public datas: { format:string; user:any},
    private _toolsService: ToolsService
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
    this.selectAcceptFile = ( this.acceptFile.find( item => item.format === this.datas.format ) ).accept ;
  }

  handleChildAction( event ) {
    console.log('Se recibió una acción del hijo', event);
    this.listGallery = event;
    for( let row of this.listGallery ){ this.handleSelectImg( row );
      if( row.type !== 'image/png' ) row.viewFile = this._toolsService.seguridadIfrane( row.href )
    }
  }

  handleSelectImg( key ){
    let filter = this.selectList.find( item => item.href === key.href );
    if( filter ) return false;
    this.selectList.push( key );
  }

  handleDeSelectImg( key ){
    key.check = false;
    this.selectList = this.selectList.filter( item => item.href !== key.href );
  }

  handleEndFile(){
    this.closeDialog( this.selectList );
  }

  closeDialog( list ){
    this.dialogRef.close( list );
  }


}
