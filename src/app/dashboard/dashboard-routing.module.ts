import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {DashboardIndexComponent} from './dashboard-index/dashboard-index.component';
import {AuthGuard} from '../shared/auth-guard.service';
import {NewAgreementComponent} from '../components/new-agreement/new-agreement.component';
import {PreviewWrapperComponent} from '../components/new-agreement/preview-wrapper/preview-wrapper.component';
import {PreviewGuard} from '../shared/preview-guard.service';
import {PreviewComponent} from '../components/new-agreement/preview/preview.component';
import {PreviewStep3Component} from '../components/new-agreement/preview/preview-step-3/preview-step-3.component';
import {StorageComponent} from '../components/storage/storage.component';


const dashboardRoutes: Routes = [
    {
        path: '', canActivate: [AuthGuard], component: DashboardComponent, children: [
            {path: '', component: DashboardIndexComponent},
            {path: 'new-agreement', component: NewAgreementComponent},
            {
                path: 'new-agreement/preview', canActivate: [PreviewGuard], component: PreviewWrapperComponent, children: [
                    {path: '', component: PreviewComponent},
                    {path: '3', component: PreviewStep3Component}
                ]
            },
            {path: 'storage', component: StorageComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(dashboardRoutes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}
