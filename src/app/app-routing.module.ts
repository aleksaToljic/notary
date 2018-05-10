import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './log-reg-wrapper/register/register.component';
import {LoginComponent} from './log-reg-wrapper/login/login.component';
import {NgModule} from '@angular/core';
import {LogRegWrapperComponent} from './log-reg-wrapper/log-reg-wrapper.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DashboardIndexComponent} from './dashboard/dashboard-index/dashboard-index.component';
import {AuthGuard} from './shared/auth-guard.service';
import {NewAgreementComponent} from './components/new-agreement/new-agreement.component';
import {PreviewComponent} from './components/new-agreement/preview/preview.component';
import {PreviewGuard} from './shared/preview-guard.service';
import {PreviewWrapperComponent} from './components/new-agreement/preview-wrapper/preview-wrapper.component';
import {PreviewStep3Component} from './components/new-agreement/preview/preview-step-3/preview-step-3.component';
import {StorageComponent} from './components/storage/storage.component';

const appRoutes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {
        path: '', component: LogRegWrapperComponent, children: [
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},

        ]
    },
    {
        path: 'notary', canActivate: [AuthGuard], component: DashboardComponent, children: [
            {path: '', component: DashboardIndexComponent},
            {path: 'new-agreement', component: NewAgreementComponent},
            {
                path: 'new-agreement/preview', canActivate: [PreviewGuard], component: PreviewWrapperComponent, children: [
                    {path: '', component: PreviewComponent},
                    // {path: '2', component: PreviewStep2Component},
                    {path: '3', component: PreviewStep3Component}
                ]
            },
            {path: 'storage', component: StorageComponent}
        ]
    },
    {path: '**', redirectTo: '/login'}

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
