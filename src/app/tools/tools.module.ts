import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaComponent } from './tabla/tabla.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ArchivosComponent } from './archivos/archivos.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TableStatisticsComponent } from './table-statistics/table-statistics.component';
import { ListChatComponent } from './list-chat/list-chat.component';
import { ListChatDetailedComponent } from './list-chat-detailed/list-chat-detailed.component';
import { FullConnectionService } from '../servicesComponent/full-connection.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CanvasBlocksComponent } from './canvas-blocks/canvas-blocks.component';
import { FormFlowsHsComponent } from './form-flows-hs/form-flows-hs.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    TablaComponent,
    ArchivosComponent,
    TableStatisticsComponent,
    ListChatComponent,
    ListChatDetailedComponent,
    CanvasBlocksComponent,
    FormFlowsHsComponent,
  ],
  exports:[
    TablaComponent,
    TableStatisticsComponent,
    ArchivosComponent,
    ListChatComponent,
    ListChatDetailedComponent,
    CanvasBlocksComponent,
    FormFlowsHsComponent
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
    PickerModule
  ],
  providers: [FullConnectionService]
})
export class ToolsModule { }
