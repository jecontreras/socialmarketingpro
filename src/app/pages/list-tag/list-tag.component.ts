import { Component, OnInit } from '@angular/core';
import { TagService } from 'src/app/servicesComponent/tag.service';

@Component({
  selector: 'app-list-tag',
  templateUrl: './list-tag.component.html',
  styleUrls: ['./list-tag.component.scss']
})
export class ListTagComponent implements OnInit {
  _dataConfigTable:any = {
    titulo: "Lista de Etiqueta",
    returnHTML: "formTag/",
    dsAccion: true,
    model: "",
    querys:{
      where:{
        state: 'activo'
      }
    },
    btn:{
      btnCrear: {
        titulo: "Crear Tag",
        click: ""
      }
    },
    tablet:{
      headers:["Acciones","tag","state","user","Actualizado"],
      row:[],
      keys: ["Acciones","tag","state","user","createdAt"]
    }
  };
  constructor(
    private _tagServices: TagService
  ) {

  }

  ngOnInit(): void {
    this._dataConfigTable.model = this._tagServices;
  }

}
