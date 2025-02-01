import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CONFIGTEXT, USERT } from 'src/app/interfaces/interfaces';
import { STORAGES } from 'src/app/interfaces/sotarage';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ConfigTestService } from 'src/app/servicesComponent/config-test.service';

@Component({
  selector: 'app-open-config-text',
  templateUrl: './open-config-text.component.html',
  styleUrls: ['./open-config-text.component.scss']
})
export class OpenConfigTextComponent implements OnInit {

  dataConfig:any = {};
  dataUser:USERT = {};

  form: FormGroup;
  btnDisabled = false;

  constructor(
    private _config: ConfigKeysService,
    private _store: Store<STORAGES>,
    private _tools: ToolsService,
    @Inject(MAT_DIALOG_DATA) public datas: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OpenConfigTextComponent>,
    private fb: FormBuilder,
    private _configTect: ConfigTestService
  ) { 
    this.dataConfig = this._config._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      if(!store) return false;
      this.dataUser = store.user || {};
    });
    this.form = this.fb.group({
      items: this.fb.array([]) // Inicializamos el FormArray
    });
  }

  async ngOnInit() {
    // Si hay datos previos, los cargamos, de lo contrario agregamos un elemento inicial
    let result:any = await this.handleGet();
    for( let item of result ){
      await this.addItem( item );
    }
    //this.addItem();
  }
  handleGet(){
    return new Promise( resolve =>{
      this._configTect.get( { user: this.dataUser.id, company: this.dataUser.empresa } ).subscribe( res =>{
        resolve( res.data );
      } );
    });  
  }


  // Método para obtener el FormArray
  get items() {
    return this.form.get('items') as FormArray;
  }

  // Agregar un nuevo item a la lista
  addItem(data: any = { title: '', description: '', typeOpt: '', id:"", company:"", user:"" }) {
    const itemForm = this.fb.group({
      title: [data.title, Validators.required],
      description: [data.description, Validators.required],
      typeOpt: [data.typeOpt, Validators.required],
      id: [ data.id ],
      company: [ data.company ],
      user: [ data.user ],
    });
    this.items.push(itemForm);
  }

  // Enviar el formulario
  async handleSubmit() {
    if (this.form.valid) {
      this.btnDisabled = true;
      console.log('Formulario enviado:', this.form.value);
      for( let item of this.form.value.items ){
        if( item.id ) await this.handleUpdate( item );
        else await this.handleCreate( item );
      }
      this.btnDisabled = false;
      //this.dialogRef.close(this.form.value); // Cerrar el diálogo y enviar los datos
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  handleUpdate( item: CONFIGTEXT ){
      return new Promise( resolve =>{
        item.user = this.dataUser.id;
        item.company = this.dataUser.empresa;
        this._configTect.update( item ).subscribe( res =>{
          if( !res ) this._tools.presentToast( this.dataConfig.txtError );
          this._tools.presentToast( this.dataConfig.txtUpdate );
          resolve( item );
        });
      });
    }
  
    handleCreate( item: CONFIGTEXT ){
      return new Promise( resolve =>{
        item.user = this.dataUser.id;
        item.company = this.dataUser.empresa;
        delete item.id;
        this._configTect.create( item ).subscribe( res =>{
          if( !res ) this._tools.presentToast( this.dataConfig.txtError );
          this._tools.presentToast( this.dataConfig.txtUpdate );
          item.id = res.id;
          resolve( item );
        });
      });
    }


}
