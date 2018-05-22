import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../config/config.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {SessionService} from '../../shared/session.service';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    signupForm: FormGroup;
    existingUser = false;

    constructor(private config: ConfigService, private http: HttpClient, private router: Router, private sessionService: SessionService) {
    }

    ngOnInit() {
        this.signupForm = new FormGroup({
            'username': new FormControl(null, Validators.required),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'firstname': new FormControl(null, Validators.required),
            'lastname': new FormControl(null, Validators.required),
            'userData': new FormGroup({
                'password': new FormControl(null, Validators.required),
                'passwordConfirm': new FormControl(null, Validators.required)
            }, this.passwordMatchValidator),
        });
        this.signupForm.valueChanges.subscribe(
            (value) => {
                if (this.existingUser) {
                    this.existingUser = false;
                }
            }
        );
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password').value === g.get('passwordConfirm').value
            ? null : {'mismatch': true};
    }

    register() {
        // console.log(this.signupForm.valid);
        if (this.signupForm.valid) {
            this.http.post(this.config.server_url + 'register', {
                username: this.signupForm.get('username').value,
                password: this.signupForm.get('userData.password').value,
                email: this.signupForm.get('email').value,
                firstname: this.signupForm.get('firstname').value,
                lastname: this.signupForm.get('lastname').value
            }, {
                responseType: 'text',
                withCredentials: true
            })
                .subscribe(
                    res => {

                        console.log(res);
                        if (res.toString() !== 'Successfully registered.') {
                            this.existingUser = true;
                            console.log(res);
                        } else {
                            this.sessionService.msgs.push({
                                severity: 'info',
                                summary: 'Successfull',
                                detail: 'You have registered a new user.'
                            });
                            this.router.navigate(['login']);
                        }
                    },
                    err => {
                        console.log(err);
                        if (err.error.target) {
                            this.sessionService.msgs.push({
                                severity: 'error',
                                summary: 'Registration failed',
                                detail: 'Something went wrong.'
                            });
                        } else {
                            this.sessionService.msgs.push({severity: 'warn', summary: 'Registration failed', detail: err.error});
                        }
                    }
                );
        } else {
            this.sessionService.msgs.push({severity: 'warn', summary: 'Registration failed', detail: 'Enter valid information'});
        }

    }

}
