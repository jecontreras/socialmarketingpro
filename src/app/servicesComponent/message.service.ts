import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query: any){
    return this._model.querys('mensajes/querys', query, 'post');
  }
  getDetallado(query: any){
    return this._model.querys('chatdetallado/querys', query, 'post');
  }
  create (query: any){
    return this._model.querys('mensajes/create', query, 'post');
  }
  renvio (query: any){
    return this._model.querys('mensajes/renvio', query, 'post');
  }
  update (query: any){
    return this._model.querys('mensajes/'+query.id, query, 'put');
  }
  delete (query: any){
    return this._model.querys('mensajes/'+query.id, query, 'delete');
  }
  getPlataformas (query: any){
    return this._model.querys('mensajes/getPlataformas', query, 'post');
  }
  getMensajeNumero (query: any){
    return this._model.querys('mensajesnumeros/querys', query, 'post');
  }
  savedMensajeNumero (query: any){
    return this._model.querys('mensajesnumeros', query, 'post');
  }
  editarMensajeNumero (query: any){
    return this._model.querys('mensajesnumeros/'+query.id, query, 'put');
  }
}
