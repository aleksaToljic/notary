import {Component, OnInit} from '@angular/core';

import * as Web3 from '../../../../node_modules/web3/src';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';
import {SessionService} from '../../shared/session.service';

@Component({
    selector: 'app-document',
    templateUrl: './document.component.html',
    styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

    web3: any;

    public file: UploadFile;
    // @Output() onDrop = new EventEmitter<documentProps>();

    // @Input() uploadMode = true;

    constructor(private sessionService: SessionService) {
        this.web3 = new Web3();
    }

    public dropped(event: UploadEvent) {

        // this.uploadMode = false;
        this.file = event.files[0];
        this.sessionService.documentUploadedSubject.next(true);
        // console.log(this.file);
        if (this.file.fileEntry.isFile) {
            const fileEntry = this.file.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
                // Here you can access the real file
                // console.log(this.file.relativePath, file);

                this.readFile(file);
                // this.sessionService.documentUploaded = true;
                // this.sessionService.documentUploadedSubject.next(true);
                // console.log('aaaa21312s12' + this.sessionService.documentUploaded);
            });
        } else {
            const fileEntry = this.file.fileEntry as FileSystemDirectoryEntry;
            // console.log(this.file.relativePath, fileEntry);
        }
    }

    public fileOver(event) {
        // console.log(event);
        // this.sessionService.fileDraggedOver = true;
    }

    public fileLeave(event) {
        // console.log(event);
        // this.sessionService.fileDraggedOver = false;
    }

    ngOnInit() {
    }

    changeListener($event): void {
        this.readThis($event.target);
        // this.uploadMode = false;
    }

    readFile(file: File) {
        this.sessionService.documentAwait = true;
        const myReader: FileReader = new FileReader();
        myReader.readAsDataURL(file);
        // this.uploadMode = false;
// napravi loading document
// vise data typeova, i viewer za njih, to ne ide sigurno preko readera
// napravi da vuce preko stream-a
// https://github.com/maxogden/filereader-stream
// https://stackoverflow.com/questions/25810051/filereader-api-on-big-files

        const loaded = (fileObject, fileContent) => {
            this.sessionService.currentDocument.name = fileObject.name;
            this.sessionService.currentDocument.size = fileObject.size;
            this.sessionService.currentDocument.hash = this.web3.utils.sha3(fileContent);
            this.sessionService.currentDocument.type = fileObject.type;
            this.sessionService.currentDocument.content = fileContent;
            this.sessionService.documentUploadedSubject.next(true);
            this.sessionService.documentAwait = false;
            // this.sessionService.documentUploaded = true;
            // this.onDrop.emit({
            //     name: fileObject.name,
            //     size: fileObject.size,
            //     hash: this.web3.utils.sha3(fileContent),
            //     type: fileObject.type,
            //     content: fileContent
            // }); // treba web3 da se uradi web3.utils.sha3
        };

        myReader.onloadend = function (e) {
            // console.log(e);
            // console.log(window.document.getElementById('viewer'));
            // window.document.getElementById('viewer').setAttribute('src', myReader.result);
            loaded(file, myReader.result);
            // console.log('file');
            // console.log(file);
            // console.log('my reader ');
            // console.log(myReader);

        };
    }

    readThis(inputValue: any): void {
        const file: File = inputValue.files[0];
        this.readFile(file);


    }
}
