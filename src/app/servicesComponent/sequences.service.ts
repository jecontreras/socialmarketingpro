import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class SequencesService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('sequences/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('sequences',query, 'post');
  }
  update(query:any){
    return this._model.querys('sequences/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('sequences/'+query.id, query, 'delete');
  }

  getUser(query:any){
    return this._model.querys('sequencesUser/querys',query, 'post');
  }
  getUserSequenceChat(query:any){
    return this._model.querys('sequencesUser/getSecuenseUser',query, 'post');
  }
  createUser(query:any){
    return this._model.querys('sequencesUser',query, 'post');
  }
  updateUser(query:any){
    return this._model.querys('sequencesUser/'+query.id, query, 'put');
  }

  getTabsLive(query:any){
    return this._model.querys('sequences/gettabslive',query, 'post');
  }

}
