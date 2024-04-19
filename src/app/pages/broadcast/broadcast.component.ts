import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBroadcastComponent } from 'src/app/dialog/form-broadcast/form-broadcast.component';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { MessageService } from 'src/app/servicesComponent/message.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
  dataConfig:any = {};
  _dataConfigTable:any = {
    titulo: "Lista de Transmisión",
    returnHTML: "formBroadcast/",
    dsAccion: true,
    model: "",
    querys:{
      where:{

      }
    },
    btn:{
      btnCrear: {
        titulo: "Crear Perfil",
        click: "CrearPerfil()"
      }
    },
    tablet:{
      headers:["openDialogContact","subtitulo","cantidadEnviado","creadoEmail","Actualizado"],
      row:[],
      keys: ["openDialogContact","subtitulo","cantidadEnviado","creadoEmail","createdAt"]
    }
  };
  constructor(
    private _config: ConfigKeysService,
    public dialog: MatDialog,
    private _messageService: MessageService
  ) {
    this.dataConfig = _config._config.keys;
  }

  ngOnInit(): void {
    this._dataConfigTable.model = this._messageService;
  }

  handleOpenDialogCreate(){
    const dialogRef = this.dialog.open(FormBroadcastComponent, {
      width: '100%',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
