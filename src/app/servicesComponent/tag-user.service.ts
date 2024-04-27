import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class TagUserService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tagUser/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('tagUser',query, 'post');
  }
  update(query:any){
    return this._model.querys('tagUser/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tagUser/'+query.id, query, 'delete');
  }
}
