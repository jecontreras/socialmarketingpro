import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolsModule } from 'src/app/tools/tools.module';
import { FormModule } from 'src/app/form/form.module';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NotificationsComponent } from 'src/app/pages/notifications/notifications.component';
import { MyOwnCustomMaterialModule } from 'src/app/app.material.module';
import { AudienceComponent } from 'src/app/pages/audience/audience.component';
import { BellComponent } from 'src/app/pages/bell/bell.component';
import { BroadcastComponent } from 'src/app/pages/broadcast/broadcast.component';
import { LiveChatComponent } from 'src/app/pages/live-chat/live-chat.component';
import { FlowsComponent } from 'src/app/pages/flows/flows.component';
import { ConfigComponent } from 'src/app/pages/config/config.component';
import { ListTagComponent } from 'src/app/pages/list-tag/list-tag.component';
import { DetailConfigComponent } from 'src/app/pages/detail-config/detail-config.component';
import { FastAnswerComponent } from 'src/app/pages/fast-answer/fast-answer.component';
import { TeamMembersComponent } from 'src/app/pages/team-members/team-members.component';
import { OfficeHoursComponent } from 'src/app/pages/office-hours/office-hours.component';
import { DefaultFlowsComponent } from 'src/app/pages/default-flows/default-flows.component';
import { WhatsappComponent } from 'src/app/pages/whatsapp/whatsapp.component';
import { QRCodeModule } from 'angularx-qrcode';
import { GoogleSheetComponent } from 'src/app/pages/google-sheet/google-sheet.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxBarcodeModule,
    ClipboardModule,
    ToolsModule,
    FormModule,
    MyOwnCustomMaterialModule,
    NgbAccordionModule,
    ReactiveFormsModule,
    QRCodeModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    PerfilComponent,
    NotificationsComponent,
    AudienceComponent,
    BellComponent,
    BroadcastComponent,
    LiveChatComponent,
    FlowsComponent,
    ConfigComponent,
    ListTagComponent,
    DetailConfigComponent,
    FastAnswerComponent,
    TeamMembersComponent,
    OfficeHoursComponent,
    DefaultFlowsComponent,
    WhatsappComponent,
    GoogleSheetComponent
  ]
})

export class AdminLayoutModule {}
