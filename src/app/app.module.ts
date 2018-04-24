import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatToolbarModule
} from '@angular/material';

import {AppComponent} from './app.component';
import {LoginComponent} from './log-reg-wrapper/login/login.component';
import {RegisterComponent} from './log-reg-wrapper/register/register.component';
import {NotaryComponent} from './components/notary/notary.component';
import {DocumentComponent} from './components/document/document.component';
import {WalletComponent} from './components/wallet/wallet.component';
import {
    FilterDialog,
    HyperlinkDialog,
    SignaturesComponent,
    SignDialog,
    TxHashDialog,
    ValidFilterPipe
} from './components/signatures/signatures.component';

import {ConfigService} from './config/config.service';
import {AuditComponent} from './components/audit/audit.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {LogRegWrapperComponent} from './log-reg-wrapper/log-reg-wrapper.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HeaderComponent} from './header/header.component';
import {DashboardIndexComponent} from './dashboard/dashboard-index/dashboard-index.component';
import {SessionService} from './shared/session.service';
import {AuthGuard} from './shared/auth-guard.service';
import {FileDropModule} from 'ngx-file-drop';
import {NewAgreementComponent} from './components/new-agreement/new-agreement.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {PreviewComponent} from './components/new-agreement/preview/preview.component';
import {PreviewGuard} from './shared/preview-guard.service';
import {DropdownDirective} from './shared/dropdown.directive';
import { PreviewWrapperComponent } from './components/new-agreement/preview-wrapper/preview-wrapper.component';
import { PreviewStep2Component } from './components/new-agreement/preview/preview-step-2/preview-step-2.component';
import { PreviewStep3Component } from './components/new-agreement/preview/preview-step-3/preview-step-3.component';
import { SigneesListComponent } from './components/signees-list/signees-list.component';
import { StorageComponent } from './components/storage/storage.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        NotaryComponent,
        HeaderComponent,
        DocumentComponent,
        WalletComponent,
        SignaturesComponent,
        SignDialog,
        TxHashDialog,
        FilterDialog,
        HyperlinkDialog,
        ValidFilterPipe,
        AuditComponent,
        LogRegWrapperComponent,
        DashboardComponent,
        DashboardIndexComponent,
        NewAgreementComponent,
        PreviewComponent,
        DropdownDirective,
        PreviewWrapperComponent,
        PreviewStep2Component,
        PreviewStep3Component,
        SigneesListComponent,
        StorageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpModule,
        ReactiveFormsModule,
        HttpClientModule,
        InlineSVGModule,
        FormsModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        MatGridListModule,
        MatCardModule,
        MatListModule,
        MatExpansionModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        FileDropModule,
        PdfViewerModule
    ],
    providers: [
        ConfigService, SessionService, AuthGuard, PreviewGuard
    ],
    entryComponents: [
        SignDialog,
        TxHashDialog,
        FilterDialog,
        HyperlinkDialog
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
