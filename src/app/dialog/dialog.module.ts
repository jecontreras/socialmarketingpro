import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { MovementItemComponent } from './movement-item/movement-item.component';
import { DetailContactComponent } from './detail-contact/detail-contact.component';
import { OpenQrComponent } from './open-qr/open-qr.component';
import { FormBellDialogComponent } from './for-bell-dialog/form-bell-dialog.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FormFlowDetailsComponent } from './form-flow-details/form-flow-details.component';



@NgModule({
  entryComponents:[
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FormFlowDetailsComponent,
    FileDetailComponent
  ],
  declarations: [
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowDetailsComponent,
  ],
  exports:[
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MyOwnCustomMaterialModule

  ]
})
export class DialogModule { }
