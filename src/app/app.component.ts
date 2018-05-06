import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionService} from './shared/session.service';
import {ConfigService} from './config/config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private http: HttpClient, private sessionService: SessionService, private config: ConfigService) {
    }

    ngOnInit() {
        this.http.get(this.config.server_url + 'session', {withCredentials: true}).subscribe(
            res => {
                if (!(Object.keys(res).length === 0 && res.constructor === Object)) {
                    this.sessionService.loggedin = true;
                }
            }
        );
    }

}
