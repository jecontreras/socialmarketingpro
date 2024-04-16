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

@NgModule({
  declarations: [
    TablaComponent,
    ArchivosComponent,
    TableStatisticsComponent,
    ListChatComponent,
    ListChatDetailedComponent,
  ],
  exports:[
    TablaComponent,
    TableStatisticsComponent,
    ArchivosComponent,
    ListChatComponent,
    ListChatDetailedComponent
  ],
  imports: [
    CommonModule,
    NgbPaginationModule, NgbAlertModule, NgbDatepickerModule,
    InfiniteScrollModule,
    NgxDropzoneModule,
    NgxSpinnerModule,
    MyOwnCustomMaterialModule,
    FormsModule,
    PickerModule
  ],
  providers: [FullConnectionService]
})
export class ToolsModule { }
