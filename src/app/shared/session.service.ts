import {Injectable} from "@angular/core";
import {ConfigService} from "../config/config.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class SessionService {
    public username: string;
    public address: string;
    public privateKey: string;
    public loggedin = false;

    constructor(private http: HttpClient, private config: ConfigService, private router: Router) {
    }

    isLoggedIn() {
        const promise = new Promise(
            (resolve) => {
                resolve(this.loggedin);
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
                },
                err => {
                    console.log("Error occured");
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
        }
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
