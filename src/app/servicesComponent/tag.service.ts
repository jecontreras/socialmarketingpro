import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('tag/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('tag',query, 'post');
  }
  update(query:any){
    return this._model.querys('tag/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('tag/'+query.id, query, 'delete');
  }
}
