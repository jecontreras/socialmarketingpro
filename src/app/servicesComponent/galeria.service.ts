import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {

  constructor(
    private _model: ServiciosService
  ) {
  }
  get(query: any){
    return this._model.querys('galeria/querys', query, 'post');
  }
  saved (query: any){
    return this._model.querys('galeria/create', query, 'post');
  }
  editar (query: any){
    return this._model.querys('galeria/'+query.id, query, 'put');
  }
  delete (query: any){
    return this._model.querys('galeria/'+query.id, query, 'delete');
  }
}

