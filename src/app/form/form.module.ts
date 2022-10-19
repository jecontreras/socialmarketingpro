import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArticuloComponent } from './form-articulo/form-articulo.component';
import { RouterModule } from '@angular/router';
import { FormRoutes } from './admin-layout.routing';
import { NgxCurrencyModule } from "ngx-currency";
import { FormsModule } from '@angular/forms';
import { FormCategoriaComponent } from './form-categoria/form-categoria.component';
import { FormEmpresaComponent } from './form-empresa/form-empresa.component';
import { FormFacturaComponent } from './form-factura/form-factura.component';
import { FormInventarioComponent } from './form-inventario/form-inventario.component';
import { FormLogsComponent } from './form-logs/form-logs.component';
import { FormPerfilComponent } from './form-perfil/form-perfil.component';
import { FormProvedorComponent } from './form-provedor/form-provedor.component';


@NgModule({
  declarations: [
    FormArticuloComponent,
    FormCategoriaComponent,
    FormEmpresaComponent,
    FormFacturaComponent,
    FormInventarioComponent,
    FormLogsComponent,
    FormPerfilComponent,
    FormProvedorComponent
  ],
  exports:[
    FormArticuloComponent,
    FormCategoriaComponent,
    FormEmpresaComponent,
    FormFacturaComponent,
    FormInventarioComponent,
    FormLogsComponent,
    FormPerfilComponent,
    FormProvedorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxCurrencyModule,
    RouterModule.forChild(FormRoutes),
  ]
})
export class FormModule { }
