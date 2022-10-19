import { Routes } from '@angular/router';
import { FormArticuloComponent } from './form-articulo/form-articulo.component';
import { FormCategoriaComponent } from './form-categoria/form-categoria.component';
import { FormEmpresaComponent } from './form-empresa/form-empresa.component';
import { FormFacturaComponent } from './form-factura/form-factura.component';
import { FormInventarioComponent } from './form-inventario/form-inventario.component';
import { FormLogsComponent } from './form-logs/form-logs.component';
import { FormPerfilComponent } from './form-perfil/form-perfil.component';
import { FormProvedorComponent } from './form-provedor/form-provedor.component';

export const FormRoutes: Routes = [
    { path: 'formarticulo',           component: FormArticuloComponent },
    { path: 'formarticulo/:id',           component: FormArticuloComponent },
    { path: 'formcategoria',           component: FormCategoriaComponent },
    { path: 'formcategoria/:id',           component: FormCategoriaComponent },
    { path: 'formempresa',           component: FormEmpresaComponent },
    { path: 'formempresa/:id',           component: FormEmpresaComponent },
    { path: 'formfactura',           component: FormFacturaComponent },
    { path: 'formfactura/:id',           component: FormFacturaComponent },
    { path: 'forminventario',           component: FormInventarioComponent },
    { path: 'forminventario/:id',           component: FormInventarioComponent },
    { path: 'formlogs',           component: FormLogsComponent },
    { path: 'formlogs/:id',           component: FormLogsComponent },
    { path: 'formperfil',           component: FormPerfilComponent },
    { path: 'formperfil/:id',           component: FormPerfilComponent },
    { path: 'formprovedor',           component: FormProvedorComponent },
    { path: 'formprovedor/:id',           component: FormProvedorComponent },
];
