import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../shared/session.service';
import {PDFDocumentProxy, PDFProgressData} from 'pdfjs-dist';
import {NgProgress} from 'ngx-progressbar';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-preview-wrapper',
    templateUrl: './preview-wrapper.component.html',
    styleUrls: ['./preview-wrapper.component.scss']
})
export class PreviewWrapperComponent implements OnInit {
    // aaa: FileSaver = new FileSaver();

    constructor(public sessionService: SessionService, private ngProgress: NgProgress) {
    }

    ngOnInit() {
        this.ngProgress.start();
    }

    downloadDocument() {
        const blob = this.dataURItoBlob(this.sessionService.currentDocument.content);
        // const blob = new Blob([this.sessionService.currentDocument.content], {type: 'application/pdf'});
        const filename = this.sessionService.currentDocument.name;
        // const file = new File([this.sessionService.currentDocument.content], filename, {type: 'application/pdf'});
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
