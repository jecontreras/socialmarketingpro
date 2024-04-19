import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { MovementItemComponent } from './movement-item/movement-item.component';
import { DetailContactComponent } from './detail-contact/detail-contact.component';
import { OpenQrComponent } from './open-qr/open-qr.component';
import { FormBellDialogComponent } from './for-bell-dialog/form-bell-dialog.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FormFlowsComponent } from './form-flows/form-flows.component';
import { ToolsModule } from '../tools/tools.module';
import { FormTagComponent } from './form-tag/form-tag.component';
import { FormBroadcastComponent } from './form-broadcast/form-broadcast.component';



@NgModule({
  entryComponents:[
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowsComponent,
    FormTagComponent,

  ],
  declarations: [
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowsComponent,
    FormTagComponent,
    FormBroadcastComponent
    ,
  ],
  exports:[
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowsComponent,
    FormTagComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ToolsModule,
    MyOwnCustomMaterialModule

  ]
})
export class DialogModule { }
