import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../config/config.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    signupForm: FormGroup;

    constructor(private config: ConfigService, private http: HttpClient, private router: Router) {
    }

    ngOnInit() {
        this.signupForm = new FormGroup({
            'userData': new FormGroup({
                'username': new FormControl(null, Validators.required),
                'email': new FormControl(null, [Validators.required, Validators.email]),
                'password': new FormControl(null, Validators.required),
                'lastname': new FormControl(null, Validators.required),
                'firstname': new FormControl(null, Validators.required)
            }),
        });
    }

    register() {
        this.http.post(this.config.server_url + 'register', {
            username: this.signupForm.get('userData.username').value,
            password: this.signupForm.get('userData.password').value,
            email: this.signupForm.get('userData.email').value,
            firstname: this.signupForm.get('userData.firstname').value,
            lastname: this.signupForm.get('userData.lastname').value
        }, {
            responseType: 'text',
            withCredentials: true
        })
            .subscribe(
                res => {
                    this.router.navigate(['login']);
                    console.log(res);
                },
                err => {
                    console.log(err);
                }
            );
    }

}
