import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {ConfigService} from '../../config/config.service';
import {SessionService} from "../../shared/session.service";

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

    @Input() title: string;
    // @Output() sendSession = new EventEmitter<SessionInterface>();

    loggedin: boolean = false;
    username: string;

    constructor(private config: ConfigService, private http: Http, private router: Router, private sessionService: SessionService) {
        this.http.get(this.config.server_url + 'session', {
            withCredentials: true
        }).map(res => res.json()).subscribe((data) => {
            if (Object.keys(data).length === 0) {
                // if notary, rediret to login
                //this.router.navigateByUrl('/login');
                // trnutno console.log(this.router.url)
            } else {
                this.sessionService.username = data['username'];
                this.sessionService.address = data['address'];
                this.sessionService.privateKey = data['private'];
                // this.sendSession.emit({
                //   username: data['username'],
                //   address: data['address'],
                //   privateKey: data['private']
                // });
                this.loggedin = true;
                this.username = data['username'];
            }
        });
        //provere za redirectove, i ubaci event emitter za session
        //uradi redirevtove sa 3000 na 4200 i neke poruke im daj
    }

    ngOnInit() {
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

}

interface sessionInterface {
    username: string,
    address: string,
    privateKey: any
}
