import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('empresa/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('empresa',query, 'post');
  }
  update(query:any){
    return this._model.querys('empresa/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('empresa/'+query.id, query, 'delete');
  }
}
