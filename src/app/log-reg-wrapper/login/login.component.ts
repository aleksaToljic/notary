import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../config/config.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SessionService} from '../../shared/session.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    signupForm: FormGroup;
    user: User = {username: '', password: '', email: '', firstname: '', lastname: ''};
    wrongUserPass = false;

    constructor(private http: HttpClient, private config: ConfigService, private router: Router, private sessionService: SessionService) {
    }

    ngOnInit() {
        this.sessionService.logout();
        this.signupForm = new FormGroup({
            'userData': new FormGroup({
                'username': new FormControl(null, Validators.required),
                'password': new FormControl(null, Validators.required),
            }),
        });
        this.signupForm.valueChanges.subscribe(
            (value) => {
                if (this.wrongUserPass) {
                    this.wrongUserPass = false;
                }
            }
        );
    }

    login() {
        this.user.username = this.signupForm.get('userData.username').value;
        this.user.password = this.signupForm.get('userData.password').value;
        this.sessionService.post<User>(this.config.server_url + 'login', this.user).subscribe(
            res => {

                console.log(res);
                if (res.toString() === 'Successfully logged in.') {
                    this.sessionService.loggedin = true;
                    this.router.navigate(['notary']);
                } else {
                    this.wrongUserPass = true;
                }

            },
            err => {
                console.log(err);
            }
        );

    }
}

interface User {
    username: string,
    password: string,
    email: string,
    firstname: string,
    lastname: string
}
