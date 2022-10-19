import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ArticuloComponent } from 'src/app/pages/articulo/articulo.component';
import { CategoriaComponent } from 'src/app/pages/categoria/categoria.component';
import { EmpresaComponent } from 'src/app/pages/empresa/empresa.component';
import { FacturaComponent } from 'src/app/pages/factura/factura.component';
import { InventarioComponent } from 'src/app/pages/inventario/inventario.component';
import { LogsComponent } from 'src/app/pages/logs/logs.component';
import { PerfilComponent } from 'src/app/pages/perfil/perfil.component';
import { ProvedorComponent } from 'src/app/pages/provedor/provedor.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'articulo',           component: ArticuloComponent },
    { path: 'categoria',           component: CategoriaComponent },
    { path: 'empresa',           component: EmpresaComponent },
    { path: 'factura',           component: FacturaComponent },
    { path: 'inventario',           component: InventarioComponent },
    { path: 'logs',           component: LogsComponent },
    { path: 'perfil',           component: PerfilComponent },
    { path: 'provedor',           component: ProvedorComponent },
];
