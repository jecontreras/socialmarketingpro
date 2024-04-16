import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBellDialogComponent } from 'src/app/dialog/for-bell-dialog/form-bell-dialog.component';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { WhatsappInfoService } from 'src/app/servicesComponent/whatsapp-info.service';

@Component({
  selector: 'app-bell',
  templateUrl: './bell.component.html',
  styleUrls: ['./bell.component.scss']
})
export class BellComponent implements OnInit {
  dataConfig:any = {};
  _dataConfigTable:any = {
    titulo: "Lista de Perfil",
    returnHTML: "formbell/",
    dsAccion: true,
    model: "",
    querys:{
      where:{

      }
    },
    btn:{
      btnCrear: {
        titulo: "Crear Campaña",
        click: "handleCreateNew()"
      }
    },
    tablet:{
      headers:["Acciones","numero","titulo","estado","Actualizado", "Editar"],
      row:[],
      keys: ["Acciones","numero","titulo","estado","createdAt"]
    }
  };

  constructor(
    private _config: ConfigKeysService,
    private _whatsappInfo: WhatsappInfoService,
    public dialog: MatDialog
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
    this._dataConfigTable.model = this._whatsappInfo;
  }

  handleDownload(){

  }

  handleCreateNew(item){
    const dialogRef = this.dialog.open(FormBellDialogComponent, {
      width: '50%',
      height: "600px",
      data: item || {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
