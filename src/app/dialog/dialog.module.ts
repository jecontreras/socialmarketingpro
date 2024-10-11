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
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormWhatsappComponent } from './form-whatsapp/form-whatsapp.component';
import { ListAdvisorsComponent } from './list-advisors/list-advisors.component';
import { FastMsxComponent } from './fast-msx/fast-msx.component';
import { A11yModule } from '@angular/cdk/a11y';



@NgModule({
  entryComponents:[
    MovementItemComponent,
    DetailContactComponent,
    OpenQrComponent,
    FormBellDialogComponent,
    FileDetailComponent,
    FormFlowsComponent,
    FormTagComponent,
    FormAllChatComponent,
    FormWhatsappComponent

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
    OpenGalleriaComponent,
    FormWhatsappComponent,
    ListAdvisorsComponent,
    FastMsxComponent
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
    FormWhatsappComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ToolsModule,
    MyOwnCustomMaterialModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    A11yModule

  ]
})
export class DialogModule { }
