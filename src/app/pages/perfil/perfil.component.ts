import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/servicesComponent/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  _dataConfig:any = {
    titulo: "Lista de Perfil",
    returnHTML: "formperfil/",
    dsAccion: true,
    model: "",
    querys:{
      where:{
        estado: 'activo'
      }
    },
    btn:{
      btnCrear: {
        titulo: "Crear Perfil",
        click: "CrearPerfil()"
      }
    },
    tablet:{
      headers:["Perfil","Creado","Actualizado"],
      row:[],
      keys: ["nombre","createdAt","updatedAt"]
    }
  };
  constructor(
    private _router: Router,
    private _perfil: PerfilService
  ) { }

  ngOnInit(): void {
    this._dataConfig.model = this._perfil;
  }

  CrearPerfil(){
    this._router.navigate(['/formperfil']);
  }

}
