import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ListVentaService {

  constructor(
    private _model: ServiciosService
  ) {
  }
  get(query: any){
    return this._model.querys('listVentas/querys', query, 'post');
  }
  saved (query: any){
    return this._model.querys('listVentas', query, 'post');
  }
  editar (query: any){
    return this._model.querys('listVentas/'+query.id, query, 'put');
  }
  delete (query: any){
    return this._model.querys('listVentas/'+query.id, query, 'delete');
  }
}
