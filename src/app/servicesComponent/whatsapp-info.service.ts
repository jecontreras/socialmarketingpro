import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappInfoService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('whatsappInfo/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('whatsappInfo',query, 'post');
  }
  update(query:any){
    return this._model.querys('whatsappInfo/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('whatsappInfo/'+query.id, query, 'delete');
  }
}
