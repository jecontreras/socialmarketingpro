import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { MovementItemComponent } from './movement-item/movement-item.component';
import { BottomSheetSheetTag, DetailContactComponent } from './detail-contact/detail-contact.component';
import { OpenQrComponent } from './open-qr/open-qr.component';
import { FormBellDialogComponent } from './for-bell-dialog/form-bell-dialog.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FormFlowsComponent } from './form-flows/form-flows.component';
import { ToolsModule } from '../tools/tools.module';
import { FormTagComponent } from './form-tag/form-tag.component';
import { FormBroadcastComponent } from './form-broadcast/form-broadcast.component';
import { FormAllChatComponent } from './form-all-chat/form-all-chat.component';
import { OpenGalleriaComponent } from './open-galleria/open-galleria.component';



@NgModule({
  entryComponents:[
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowsComponent,
    FormTagComponent,
    FormAllChatComponent

  ],
  declarations: [
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowsComponent,
    FormTagComponent,
    FormBroadcastComponent,
    FormAllChatComponent,
    BottomSheetSheetTag,
    OpenGalleriaComponent
    ,
  ],
  exports:[
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowsComponent,
    FormTagComponent,
    FormAllChatComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ToolsModule,
    MyOwnCustomMaterialModule,
    ReactiveFormsModule
  ]
})
export class DialogModule { }
