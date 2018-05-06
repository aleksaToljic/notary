import {Injectable} from '@angular/core';
import {ConfigService} from '../config/config.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SessionService {
    public username: string;
    public address: string;
    public privateKey: string;
    public loggedin: boolean;
    public documentAwait = false;
    public currentDocument: DocumentProperties = {name: '', size: 0, hash: '', type: '', content: ''};
    public documentUploaded = false;
    documentUploadedSubject = new Subject();
    public currentEvents = [];

    addressReceived = new Subject();

    // public fileDraggedOver = false;

    constructor(private http: HttpClient, private config: ConfigService, private router: Router) {
    }

    isLoggedIn() {
        const promise = new Promise(
            (resolve) => {
                setTimeout(() => resolve(this.loggedin), 800);

            }
        );
        return promise;
    }

    isUploaded() {
        const promise = new Promise(
            (resolve) => {
                setTimeout(() => resolve(this.documentUploaded), 800);

            }
        );
        return promise;
    }

    logout() {
        this.http.get(this.config.server_url + 'logout', {
            withCredentials: true
        })
            .subscribe(
                res => {
                    console.log(res);
                    this.router.navigate(['login']);
                    this.loggedin = false;
                },
                err => {
                    console.log('Error occured');
                }
            );
    }

    post<T>(url: string, body: any, headers?: HttpHeaders | null): Observable<T> {
        const expandedHeaders = this.prepareHeader(headers);
        return this.http.post<T>(url, body, expandedHeaders);
    }


    private prepareHeader(headers: HttpHeaders | null): object {
        headers = headers || new HttpHeaders();

        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Accept', 'application/json');

        return {
            headers: headers,
            responseType: 'text',
            withCredentials: true
        };
    }

    // constructor(username: string, address: string, privateKey: string) {
    //     this.username = username;
    //     this.address = address;
    //     this.privateKey = privateKey;
    // }

}

// interface SessionInterface {
//     username: string;
//     address: string;
//     privateKey: any;
//
// }
interface DocumentProperties {
    name: string;
    size: number;
    hash: string;
    type: string;
    content: string;
}
