import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const socketOptions = {
  transports: ['websocket'], // Especifica los métodos de transporte compatibles
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: any;
  private url = "http://localhost:3000"; // Cambia esto por la URL de tu servidor Sails.js

  constructor() {
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
}
