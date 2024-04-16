import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { AudienceComponent } from 'src/app/pages/audience/audience.component';
import { BellComponent } from 'src/app/pages/bell/bell.component';
import { BroadcastComponent } from 'src/app/pages/broadcast/broadcast.component';
import { FlowsComponent } from 'src/app/pages/flows/flows.component';
import { ConfigComponent } from 'src/app/pages/config/config.component';
import { LiveChatComponent } from 'src/app/pages/live-chat/live-chat.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'perfil',           component: PerfilComponent },
    { path: 'audience',           component: AudienceComponent },
    { path: 'bell',           component: BellComponent },
    { path: 'broadcast',           component: BroadcastComponent },
    { path: 'liveChat',           component: LiveChatComponent },
    { path: 'flows',           component: FlowsComponent },
    { path: 'config',           component: ConfigComponent },
];
