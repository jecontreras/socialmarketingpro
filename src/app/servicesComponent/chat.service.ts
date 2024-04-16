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
  private url = environment.url; // Cambia esto por la URL de tu servidor Sails.js

  constructor() {
    this.socket = io(this.url, socketOptions);
    setTimeout(()=>{
      console.log("***PErra")
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
    }, 300)
  }

  enviarMensaje(txt: any) {
    this.socket.emit('enviarMensaje', { txt: txt });
  }

  recibirMensajes( ): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('nuevoMensaje', (data: any) => {
        console.log("***RRR", data)
        observer.next(data);
      });
    });
  }
}
