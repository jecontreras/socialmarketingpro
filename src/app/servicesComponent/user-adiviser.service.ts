import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class UserAdiviserService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('userAdviser/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('userAdviser',query, 'post');
  }
  update(query:any){
    return this._model.querys('userAdviser/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('userAdviser/'+query.id, query, 'delete');
  }
}
