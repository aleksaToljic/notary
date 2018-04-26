import {Component, OnInit} from '@angular/core';
import {ConfigService} from './config/config.service';
import {SessionService} from './shared/session.service';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    blocked = false;

    constructor(private config: ConfigService, private sessionService: SessionService, private http: HttpClient) {
    }

    ngOnInit() {
        this.http.get(this.config.server_url + 'session', {withCredentials: true}).subscribe(
            res => {
                if (!(Object.keys(res).length === 0 && res.constructor === Object)) {

                    this.sessionService.loggedin = true;
                }
                // this.username = res.username;
                // this.address = res.address;
                // this.privateKey = res.privateKey;
            }
        );
        setTimeout(() => {
            if (this.sessionService.loggedin) {
                this.blocked = true;
            }
        }, 5000);
    }
}
