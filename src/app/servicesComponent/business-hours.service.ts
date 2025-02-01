import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessHoursService {

  constructor(
    private _model: ServiciosService
  ) { }

  setHours(query:any){
    return this._model.querys('businessHours/setHours',query, 'post');
  }
  getHours(query:any){
    return this._model.querys('businessHours/getHours',query, 'post');
  }
  checkBusinessStatus(query:any){
    return this._model.querys('businessHours/checkBusinessStatus',query, 'post');
  }
  delete(query:any){
    return this._model.querys('businessHours/'+query.id, query, 'delete');
  }
}
