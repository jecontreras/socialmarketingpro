import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormRoutes } from './admin-layout.routing';
import { NgxCurrencyModule } from "ngx-currency";
import { QRCodeModule } from 'angularx-qrcode';
import { NgxBarcodeModule } from 'ngx-barcode';
import { DialogModule } from '../dialog/dialog.module';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { ToolsModule } from '../tools/tools.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@NgModule({
  declarations: [
  ],
  exports:[
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxCurrencyModule,
    QRCodeModule,
    NgxBarcodeModule,
    DialogModule,
    ToolsModule,
    MyOwnCustomMaterialModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    RouterModule.forChild(FormRoutes),
  ]
})
export class FormModule { }
