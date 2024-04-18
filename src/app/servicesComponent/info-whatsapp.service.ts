import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class InfoWhatsappService {

  constructor(
    private _model: ServiciosService
  ) { }
  get(query:any){
    return this._model.querys('InfoWhatsapp/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('InfoWhatsapp',query, 'post');
  }
  update (query: any){
    return this._model.querys('InfoWhatsapp/updates', query, 'post');
  }
  delete (query: any){
    return this._model.querys('InfoWhatsapp/'+query.id, query, 'delete');
  }
  getDetail(query: any){
    return this._model.querys('InfoWhatsappDetallado/querys', query, 'post');
  }
  savedDetail (query: any){
    return this._model.querys('InfoWhatsappDetallado/create', query, 'post');
  }
  editarDetail (query: any){
    return this._model.querys('InfoWhatsappDetallado/'+query.id, query, 'put');
  }
  updateWhatsappDetalle (query: any){
    return this._model.querys('InfoWhatsapp/updateWhatsappDetalle', query, 'post');
  }
  deleteDetail (query: any){
    return this._model.querys('InfoWhatsappDetallado/'+query.id, query, 'delete');
  }
}
