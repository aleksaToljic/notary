import {Component} from '@angular/core';
import {SessionService} from './shared/session.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(public sessionService: SessionService) {
        sessionService.getSession();
    }


}
