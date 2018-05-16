import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './log-reg-wrapper/register/register.component';
import {LoginComponent} from './log-reg-wrapper/login/login.component';
import {NgModule} from '@angular/core';
import {LogRegWrapperComponent} from './log-reg-wrapper/log-reg-wrapper.component';

const appRoutes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {
        path: '', component: LogRegWrapperComponent, children: [
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},

        ]
    },
    {path: 'notary', loadChildren: './dashboard/dashboard.module#DashboardModule'},
    {path: '**', redirectTo: '/login'}

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
