import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappTxtUserService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('whatsappTxtUser/querys',query, 'post');
  }
  getChatUser(query:any){
    return this._model.querys('whatsappTxtUser/querysChatUser',query, 'post');
  }
  create(query:any){
    return this._model.querys('whatsappTxtUser',query, 'post');
  }
  update(query:any){
    return this._model.querys('whatsappTxtUser/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('whatsappTxtUser/'+query.id, query, 'delete');
  }
}
