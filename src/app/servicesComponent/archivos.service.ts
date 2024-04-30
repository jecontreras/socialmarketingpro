import { Injectable } from '@angular/core';
import { ServiciosService } from '../services/servicios.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(
    private _model: ServiciosService,
    private http: HttpClient
  ) { }

  create(query:any){
    //this.FileFirebase( query );
    return this.http.post<void>(environment.urlFile+'/archivos/file', query).toPromise();
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
