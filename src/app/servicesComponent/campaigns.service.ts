import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {

  constructor(
    private _model: ServiciosService
  ) { }

  get(query:any){
    return this._model.querys('campaigns/querys',query, 'post');
  }
  create(query:any){
    return this._model.querys('campaigns',query, 'post');
  }
  update(query:any){
    return this._model.querys('campaigns/'+query.id, query, 'put');
  }
  delete(query:any){
    return this._model.querys('campaigns/'+query.id, query, 'delete');
  }
}
