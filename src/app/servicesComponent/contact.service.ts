import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('contact/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('contact',query, 'post');
  }
  update(query:any){
    return this._model.querys('contact/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('contact/'+query.id, query, 'delete');
  }
}
