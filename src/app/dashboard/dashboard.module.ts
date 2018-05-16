import {NgModule} from '@angular/core';
import {SigneesListComponent} from '../components/signees-list/signees-list.component';
import {NewAgreementComponent} from '../components/new-agreement/new-agreement.component';
import {PreviewComponent} from '../components/new-agreement/preview/preview.component';
import {FilterPipe} from '../shared/filter.pipe';
import {NotificationDirective} from '../components/notification/notification.directive';
import {StorageComponent} from '../components/storage/storage.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {FileDropModule} from 'ngx-file-drop';
import {NotificationComponent} from '../components/notification/notification.component';
import {SortPipe} from '../shared/sort.pipe';
import {DashboardComponent} from './dashboard.component';
import {PreviewStep3Component} from '../components/new-agreement/preview/preview-step-3/preview-step-3.component';
import {DropdownDirective} from '../shared/dropdown.directive';
import {HeaderComponent} from '../header/header.component';
import {DashboardIndexComponent} from './dashboard-index/dashboard-index.component';
import {DocumentComponent} from '../components/document/document.component';
import {PreviewWrapperComponent} from '../components/new-agreement/preview-wrapper/preview-wrapper.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {InlineSVGModule} from 'ng-inline-svg';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotificationService} from '../components/notification/notification.service';

import {SpinnerModule} from 'primeng/spinner';
import {AutoCompleteModule} from 'primeng/autocomplete';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FileDropModule,
        PdfViewerModule,
        InlineSVGModule,
        ReactiveFormsModule,
        FormsModule,
        SpinnerModule,
        AutoCompleteModule
    ],
    declarations: [
        HeaderComponent,
        DocumentComponent,
        DashboardComponent,
        DashboardIndexComponent,
        NewAgreementComponent,
        PreviewComponent,
        DropdownDirective,
        PreviewWrapperComponent,
        PreviewStep3Component,
        SigneesListComponent,
        StorageComponent,
        NotificationComponent,
        NotificationDirective,
        FilterPipe,
        SortPipe,
    ],
    providers: [
        NotificationService
    ],
})
export class DashboardModule {
}
