import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class FastAnswerService {


  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('fastanswer/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('fastanswer',query, 'post');
  }
  update(query:any){
    return this._model.querys('fastanswer/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('fastanswer/'+query.id, query, 'delete');
  }
}
