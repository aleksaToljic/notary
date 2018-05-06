import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from '../config/config.service';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {SessionService} from '../shared/session.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() title: string;
    // @Output() sendSession = new EventEmitter<SessionInterface>();

    // username: string;

    constructor(private config: ConfigService, private http: Http, private router: Router, private sessionService: SessionService) {
        this.http.get(this.config.server_url + 'session', {
            withCredentials: true
        }).map(res => res.json()).subscribe((data) => {
            if (Object.keys(data).length === 0) {
                // if notary, rediret to login
                // this.router.navigateByUrl('/login');
                // trnutno console.log(this.router.url)
            } else {
                this.sessionService.loggedin = true;
                this.sessionService.username = data['username'];

                this.sessionService.address = data['address'];

                console.log(111, this.sessionService.address);
                this.sessionService.addressReceived.next(true);
                this.sessionService.privateKey = data['private'];
                // this.sendSession.emit({
                //   username: data['username'],
                //   address: data['address'],
                //   privateKey: data['private']
                // });

                // this.username = data['username'];
            }
        });
        //provere za redirectove, i ubaci event emitter za session
        //uradi redirevtove sa 3000 na 4200 i neke poruke im daj
    }

    ngOnInit() {
    }


}

