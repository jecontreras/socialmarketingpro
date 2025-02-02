import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('googleSheet/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('googleSheet',query, 'post');
  }
  update(query:any){
    return this._model.querys('googleSheet/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('googleSheet/'+query.id, query, 'delete');
  }
}
