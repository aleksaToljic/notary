import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../shared/session.service';
import {PDFDocumentProxy} from 'pdfjs-dist';
import {NgProgress} from 'ngx-progressbar';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-preview-wrapper',
    templateUrl: './preview-wrapper.component.html',
    styleUrls: ['./preview-wrapper.component.scss']
})
export class PreviewWrapperComponent implements OnInit {
    page = 1;
    pdf: any;
    pdfLoaded = false;

    constructor(public sessionService: SessionService, private ngProgress: NgProgress) {
    }

    ngOnInit() {
        this.ngProgress.start();
    }

    downloadDocument() {
        const blob = this.dataURItoBlob(this.sessionService.currentDocument.content);
        const filename = this.sessionService.currentDocument.name;
        saveAs(blob, filename);
    }

    dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type: mimeString});
    }

    incrementPage(amount: number) {
        this.page += amount;
    }

    afterLoadComplete(pdf: PDFDocumentProxy) {
        // do anything with "pdf"
        this.pdf = pdf;
        this.pdfLoaded = true;
        console.log(pdf);
        this.ngProgress.done();
    }

}
