import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from './tabla/tabla.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ArchivosComponent } from './archivos/archivos.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TableStatisticsComponent } from './table-statistics/table-statistics.component';
import { ListChatComponent } from './list-chat/list-chat.component';
import { BottomSheetSheetFastAnswer, BottomSheetSheetFlows, ListChatDetailedComponent } from './list-chat-detailed/list-chat-detailed.component';
import { FullConnectionService } from '../servicesComponent/full-connection.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CanvasBlocksComponent } from './canvas-blocks/canvas-blocks.component';
import { FormFlowsHsComponent } from './form-flows-hs/form-flows-hs.component';
import { MatListModule } from '@angular/material/list';
import { ChatNewDetailedComponent } from './chat-new-detailed/chat-new-detailed.component';
import { ListChatOptionComponent } from './list-chat-option/list-chat-option.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    TablaComponent,
    ArchivosComponent,
    TableStatisticsComponent,
    ListChatComponent,
    //ListChatDetailedComponent,
    CanvasBlocksComponent,
    FormFlowsHsComponent,
    ChatNewDetailedComponent,
    ListChatOptionComponent,
    BottomSheetSheetFastAnswer,
    BottomSheetSheetFlows,
    ListChatDetailedComponent
  ],
  exports:[
    TablaComponent,
    TableStatisticsComponent,
    ArchivosComponent,
    ListChatComponent,
    //ListChatDetailedComponent,
    CanvasBlocksComponent,
    FormFlowsHsComponent,
    ChatNewDetailedComponent,
    BottomSheetSheetFastAnswer,
    BottomSheetSheetFlows,
    ListChatDetailedComponent
  ],
  imports: [
    CommonModule,
    NgbPaginationModule, NgbAlertModule, NgbDatepickerModule,
    InfiniteScrollModule,
    NgxDropzoneModule,
    NgxSpinnerModule,
    MyOwnCustomMaterialModule,
    MatListModule ,
    FormsModule,
    PickerModule,
    ReactiveFormsModule,
    A11yModule
  ],
  providers: [FullConnectionService]
})
export class ToolsModule { }
