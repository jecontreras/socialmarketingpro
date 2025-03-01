import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigTestService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('configText/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('configText',query, 'post');
  }
  update(query:any){
    return this._model.querys('configText/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('configText/'+query.id, query, 'delete');
  }
}
