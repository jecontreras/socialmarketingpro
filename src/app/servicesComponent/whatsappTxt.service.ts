import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappTxtService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('WhatsappTxt/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('WhatsappTxt',query, 'post');
  }
  update(query:any){
    return this._model.querys('WhatsappTxt/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('WhatsappTxt/'+query.id, query, 'delete');
  }

  getDetails(query:any){
    return this._model.querys('WhatsappHistorial/querys',query, 'post');
  }
  createDetails(query:any){
    return this._model.querys('WhatsappHistorial',query, 'post');
  }
  updateDetails(query:any){
    return this._model.querys('WhatsappHistorial/'+query.id, query, 'put');
  }
  deleteDetails(query:any){
    return this._model.querys('WhatsappHistorial/'+query.id, query, 'delete');
  }

  createNewTxtWhatsapp(query:any){
    return this._model.querys('WhatsappHistorial/send',query, 'post');
  }
}
