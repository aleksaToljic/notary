import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './log-reg-wrapper/register/register.component';
import {LoginComponent} from './log-reg-wrapper/login/login.component';
import {NgModule} from '@angular/core';
import {LogRegWrapperComponent} from './log-reg-wrapper/log-reg-wrapper.component';
import {AuditComponent} from './components/audit/audit.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DashboardIndexComponent} from "./dashboard/dashboard-index/dashboard-index.component";
import {AuthGuard} from "./shared/auth-guard.service";

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
            {path: 'audit', component: AuditComponent}
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
