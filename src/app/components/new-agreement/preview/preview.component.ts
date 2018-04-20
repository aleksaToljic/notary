import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../shared/session.service';
import {PDFDocumentProxy} from 'pdfjs-dist';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    constructor(private sessionService: SessionService) {
    }

    ngOnInit() {
    }
    callBackFn(pdf: PDFDocumentProxy) {
        // do anything with "pdf"
        // console.log(pdf);
        // pdf.destroy();
        // pdf.dataLoaded()
    }
}
