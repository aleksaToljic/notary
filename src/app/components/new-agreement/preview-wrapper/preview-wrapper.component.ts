import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../shared/session.service';
import {PDFDocumentProxy, PDFProgressData} from 'pdfjs-dist';
import {NgProgress} from 'ngx-progressbar';

@Component({
    selector: 'app-preview-wrapper',
    templateUrl: './preview-wrapper.component.html',
    styleUrls: ['./preview-wrapper.component.scss']
})
export class PreviewWrapperComponent implements OnInit {

    constructor(private sessionService: SessionService, private ngProgress: NgProgress) {
    }

    ngOnInit() {
        this.ngProgress.start();
    }

    callBackFn(pdf: PDFDocumentProxy) {
        // do anything with "pdf"
        // console.log(111, pdf);
        this.ngProgress.done();
    }

    onProgress(progressData: PDFProgressData) {
        // do anything with progress data. For example progress indicator
        // console.log(222, progressData);

    }
}
