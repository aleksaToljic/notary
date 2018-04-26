import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../config/config.service';
import {SessionService} from '../../shared/session.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

    files: File[] = [];

    constructor(private http: HttpClient, private config: ConfigService, private sessionService: SessionService, private router: Router) {
    }

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

    openFile(path) {
        this.getFile(path, (err, content) => {
            if (err) {
                console.log(err);
            } else {
                console.log(content);
                this.sessionService.currentDocument.content = content;
                this.router.navigate(['notary/new-agreement/preview/3']);
            }
        });
    }

    ngOnInit() {
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
                this.files.push({
                    name: files[i].name,
                    size: parseFloat((files[i].fileInfo['{DAV:}getcontentlength'] / (1024 * 1024)).toFixed(2)),
                    fileType: extension
                });
            }

            console.log(this.files);
        }, err => console.log(err));
    }

    getTypeIcon(extension) {
        if (extension == 'pdf') {
            return '../../../assets/icon-pdf.svg';
        } else {
            return 'aa';
        }
    }
}


interface File {
    name: string;
    size: number;
    fileType: string;
}
