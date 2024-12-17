import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { USERT } from 'src/app/interfaces/interfaces';
import { USER } from 'src/app/interfaces/user';
import { ConfigKeysService } from 'src/app/services/config-keys.service';
import { ToolsService } from 'src/app/services/tools.service';
import { CompanyServiceService } from 'src/app/servicesComponent/company-service.service';

@Component({
  selector: 'app-default-flows',
  templateUrl: './default-flows.component.html',
  styleUrls: ['./default-flows.component.scss']
})
export class DefaultFlowsComponent implements OnInit {

  businessForm: FormGroup;
  dataConfig:any = {};
  dataUser:USERT;

  constructor(
    private snackBar: MatSnackBar, // Inyecta MatSnackBar aquí
    private fb: FormBuilder, 
    private http: HttpClient,
    private _companyServices: CompanyServiceService,
    private _configKey: ConfigKeysService,
    private _store: Store<USER>,
    private _toolsService: ToolsService
  ) {
    this.dataConfig = this._configKey._config.keys;
    this._store.subscribe((store: any) => {
      store = store.name;
      this.dataUser = store.user;
    });
    this.businessForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      location: ['', Validators.required],
      products: ['', Validators.required],
      promotions: [''],
      website: [''],
      id: ['']
    });
  } 

  async ngOnInit() {
    let data:any = await this.handleGetCompany();
    console.log("***48", data )
    this.businessForm.patchValue({
      titulo: data.titulo,
      descripcion: data.descripcion,
      location: data.location,
      products: data.products,
      promotions: data.promotions,
      website: data.website,
      id: data.id
    });
  }

  handleGetCompany(){
    return new Promise( resolve=>{
      this._companyServices.get( { where: { id: this.dataUser.empresa } } ).subscribe( res =>{
        res = res.data[0];
        resolve( res );
      });
    });
  }

  onSubmit() {
    if (this.businessForm.valid) {
      console.log('Formulario válido, enviando datos...', this.businessForm.value);
      let dataE = this.businessForm.value;
      
      if(dataE.id ) this.handleUpdate( dataE );
      else this.handleCreate( dataE );
      this._toolsService.tooast(this.dataConfig.txtUpdateCompany);
    }
  }

  handleCreate( data ){
    return new Promise( resolve => {
      this._companyServices.create( data ).subscribe( res => {
        resolve( res );
      })
    });
  }

  handleUpdate( data ){
    return new Promise( resolve => {
      this._companyServices.update( data ).subscribe( res => {
        resolve( res );
      })
    });
  }

}
