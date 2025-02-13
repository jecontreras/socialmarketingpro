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
  getShet(query:any){
    return this._model.querys('googleSheet/getShet',query, 'post');
  }
  create(query:any){
    return this._model.querys('googleSheet',query, 'post');
  }
  createGuide(query:any){
    return this._model.querys('googleSheet/createMns',query, 'post');
  }
  update(query:any){
    return this._model.querys('googleSheet/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('googleSheet/'+query.id, query, 'delete');
  }
  obtenerDepartamentos(query:any){
    return this._model.querys('googleSheet/getDepartamento',query, 'post');
  }
  obtenerCiudades(query:any){
    return this._model.querys('googleSheet/getCity',query, 'post');
  }
  cancelGuide(query:any){
    return this._model.querys('googleSheet/cancelGuide',query, 'post');
  }
}
