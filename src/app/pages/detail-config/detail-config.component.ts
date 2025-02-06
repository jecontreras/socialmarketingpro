import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { UserAction } from 'src/app/redux/app.actions';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ChatService } from 'src/app/servicesComponent/chat.service';
import { UsuariosService } from 'src/app/servicesComponent/usuarios.service';

@Component({
  selector: 'app-detail-config',
  templateUrl: './detail-config.component.html',
  styleUrls: ['./detail-config.component.scss']
})
export class DetailConfigComponent implements OnInit {
  configForm!: FormGroup;
  flagWhatsapp = false;
  qrCodeDownloadLink = '';
  dataUser: USERT = {};
  dataConfig: any = {};

  constructor(
    private fb: FormBuilder,
    private _store: Store<USER>,
    private _user: UsuariosService,
    private _toolsServices: ToolsService,
    private _config: ConfigKeysService,
    private chatService: ChatService
  ) {
    
    // Suscribirse a la tienda para cargar datos del usuario
    this._store.subscribe((store: any) => {
      if (!store) return;
      store = store.name;
      this.dataUser = store.user || {};
      this.qrCodeDownloadLink = this.dataUser.qrWhatsapp || '';
      this.configForm.patchValue(this.dataUser);
      console.log("***51", this.dataUser, this.configForm.value )
    });

  }

  ngOnInit(): void {
    // Crear el formulario reactivo
    this.configForm = this.fb.group({
      urlSocket: [''],
      urlBackend: [''],
      urlBackendFile: [''],
      userDropi: [''],
      claveDropi: [''],
      rolDropi: ['']
    });
    // Obtener QR y estado de WhatsApp
    this.chatService.qrWhatsapp().subscribe(data => {
      this.qrCodeDownloadLink = data;
    });

    this.chatService.statusWhatsapp().subscribe(data => {
      if (this.dataUser.empresa === data.company) {
        this.flagWhatsapp = data.status;
      }
    });
  }

  handleSubmit(): void {
    if (this.configForm.valid) {
      this.dataUser = { ...this.dataUser, ...this.configForm.value };

      // Actualizar usuario en el store
      const accion = new UserAction(this.dataUser, 'put');
      this._store.dispatch(accion);

      // Actualizar en el backend
      this.updateUser();
      this.updateUserSocket();

      this._toolsServices.presentToast(this.dataConfig.txtUpdate);

      // Cerrar el diálogo y recargar la página después de actualizar
      setTimeout(() => location.reload(), 2000);
    }
  }

  async updateUser(): Promise<void> {
    await this._user.update({
      id: this.dataUser.id,
      ...this.configForm.value
    }).toPromise();
  }

  async updateUserSocket(): Promise<void> {
    await this._user.updateUrlSocketTotal({
      id: this.dataUser.id,
      urlSocket: this.dataUser.urlSocket
    }).toPromise();
  }
}