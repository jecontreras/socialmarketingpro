import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { LOGICWHATSAPP } from '../interfaces/interfaces';
import { map } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappTxtService {

  constructor(
    private _model: ServiciosService,
    private chatService: ChatService
  ) { }

  get(query:any){
    return this._model.querys('WhatsappTxt/querys',query, 'post');
  }
  getId(query:any){
    return this._model.querys('WhatsappTxt/querysId',query, 'post');
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

  getIdNumber(query:any){
    return this._model.querys('WhatsappTxt/getNumberId',query, 'post');
  }

  updateView(query:any){
    return this._model.querys('WhatsappTxt/updateView',query, 'post');
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
    return this._model.querys('WhatsappHistorial/send',query, 'post')
    .pipe( map( ( data:any ) => {
      try {
        query.msx.id = data.data.Whatsapphistorial.id;
        this.chatService.enviarMensaje( query );
      } catch (error) { }
      return data;
    } ) ) ;
  }

  getInfoWhatsapp(query: any){
    return this._model.querys('InfoWhatsapp/querys', query, 'post');
  }
  savedInfoWhatsapp(query: any){
    return this._model.querys('InfoWhatsapp/create', query, 'post');
  }
  editarInfoWhatsapp(query: any){
    return this._model.querys('InfoWhatsapp/updates', query, 'post');
  }
  deleteInfoWhatsapp(query: any){
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
