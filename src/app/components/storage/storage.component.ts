import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../config/config.service';
import {SessionService} from '../../shared/session.service';
import {Router} from '@angular/router';
import {NgProgress} from 'ngx-progressbar';
import * as Web3 from '../../../../node_modules/web3/src';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {
    filterString: string;
    files: File[] = [];
    order: number;
    column: '';
    descending = false;
    web3: any;

    constructor(private http: HttpClient, private config: ConfigService, public sessionService: SessionService, private router: Router, private ngProgress: NgProgress) {
        this.web3 = new Web3();
    }

    sort(column) {
        this.column = column;
        this.descending = !this.descending;
        this.order = this.descending ? 1 : -1;
    }

    // sortFilesBySize() {
    //
    //     this.files.sort((a: any, b: any) => {
    //         return a.valueOf() - b.valueOf();
    //     });
    //
    // }

    getFile(path, cb) {
        this.http.post(this.config.server_url + 'getFile', {
            path: path
        }, {
            responseType: 'text',
            withCredentials: true
        }).subscribe(res => {
            cb(false, res);
        }, err => {
            cb(true, null);
        });
    }

    openFile(path, size, type) {
        this.getFile(path, (err, content) => {
            if (err) {
                console.log(err);
            } else {
                console.log(content);
                this.sessionService.currentDocument.size = size;
                this.sessionService.currentDocument.name = path.substr(1, path.length);
                this.sessionService.currentDocument.type = 'application/pdf';
                this.sessionService.currentDocument.content = content;
                this.sessionService.currentDocument.hash = this.web3.utils.sha3(content);
                this.router.navigate(['notary/new-agreement/preview/3']);
            }
        });
    }

    ngOnInit() {
        this.ngProgress.start();
        this.http.get(this.config.server_url + 'filelist', {
            responseType: 'text',
            withCredentials: true
        }).subscribe(res => {
            const files = JSON.parse(res);

            console.log(files);
            for (let i = 0; i < files.length; i++) {
                let extension: string;
                if (files[i].name.split('.').pop().startsWith('/')) {
                    extension = '';
                } else {
                    extension = files[i].name.split('.').pop();
                }

                // extension.findIndex(extension.length - 1);
                console.log(extension);
                console.log(files[i].fileInfo['{DAV:}getcontentlength'] * 1);
                if (files[i].fileInfo['{DAV:}getcontentlength'] !== undefined) {
                    this.files.push({
                        name: files[i].name,
                        sizeB: files[i].fileInfo['{DAV:}getcontentlength'] * 1,
                        fileType: extension
                    });
                }
            }

            console.log(this.files);
            this.ngProgress.done();
        }, err => {
            console.log(err);
            this.ngProgress.done();
        });
    }

    getTypeIcon(extension) {
        if (extension == 'pdf') {
            return '../../../assets/icon-pdf.svg';
        } else {
            return '';
        }
    }
}


interface File {
    name: string;
    sizeB: number;
    fileType: string;
}
