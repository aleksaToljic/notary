import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionService} from './shared/session.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private http: HttpClient, private sessionService: SessionService) {
        sessionService.getSession();
    }


}
