import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { USERT } from '../interfaces/interfaces';
import { USER } from '../interfaces/user';
import { Store } from '@ngrx/store';

const socketOptions = {
  transports: ['websocket'], // Especifica los métodos de transporte compatibles
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: any;
  private url = "http://localhost:3000"; // Cambia esto por la URL de tu servidor Sails.js
  //private url = "https://whatsappemulator-349d443b5acb.herokuapp.com"; // Cambia esto por la URL de tu servidor Sails.js
  dataUser:USERT;
  constructor(
    private _store: Store<USER>,
  ) {
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
      this.url = this.dataUser.urlSocket || this.url;
    });
    this.socket = io(this.url, socketOptions);
    this.socket.on('connect', () => {
      console.log('Conexión establecida con el servidor');
    });
    this.socket.on('nuevoMensaje', (data) => {
      console.log('Mensaje recibido del servidor:', data);
      // Aquí puedes llamar a tu función recibirMensajes con la data recibida

    });
    this.socket.on('error', (error) => {
      console.error('Error en la conexión con el servidor:', error);
    });
  }

  enviarMensaje(txt: any) {
    this.socket.emit('sendMessage', { txt: txt });
  }

  sendContactAssigned(txt: any) {
    this.socket.emit('contactAssigned', { txt: txt });
  }

  deleteChat(id: any) {
    this.socket.emit('deleteChat', { id: id });
  }

  recibirMensajes( ): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('sendMessage2', (data: any) => observer.next(data) );
    });
  }

  receiveMessageInit( ): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('sendMessage', (data: any) => observer.next(data) );
    });
  }
  receiveMessageUpdateId( ): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('sendMessageUpdate', (data: any) => observer.next(data) );
    });
  }
  receiveChatAssigned( ): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('contactAssigned', (data: any) => observer.next(data) );
    });
  }

  receivedeleteChat( ): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('deleteChat', (data: any) => observer.next(data) );
    });
  }

}
