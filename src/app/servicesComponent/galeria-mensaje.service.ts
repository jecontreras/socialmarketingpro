import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class GaleriaMensajeService {

  constructor(
    private _model: ServiciosService
  ) {
  }
  get(query: any){
    return this._model.querys('galeriaMensaje/querys', query, 'post');
  }
  saved (query: any){
    return this._model.querys('galeriaMensaje/create', query, 'post');
  }
  editar (query: any){
    return this._model.querys('galeriaMensaje/'+query.id, query, 'put');
  }
  delete (query: any){
    return this._model.querys('galeriaMensaje/'+query.id, query, 'delete');
  }
}
