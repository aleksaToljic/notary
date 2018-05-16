import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {LoginComponent} from './log-reg-wrapper/login/login.component';
import {RegisterComponent} from './log-reg-wrapper/register/register.component';

import {ConfigService} from './config/config.service';
import {InlineSVGModule} from 'ng-inline-svg';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {LogRegWrapperComponent} from './log-reg-wrapper/log-reg-wrapper.component';
import {SessionService} from './shared/session.service';
import {AuthGuard} from './shared/auth-guard.service';
import {PreviewGuard} from './shared/preview-guard.service';
import {NgProgressModule} from 'ngx-progressbar';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        LogRegWrapperComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        InlineSVGModule,
        NgProgressModule
    ],
    providers: [
        ConfigService, SessionService, AuthGuard, PreviewGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
