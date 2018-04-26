import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionService} from '../../../shared/session.service';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../config/config.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    @ViewChild('f') slForm: NgForm;
    showNext: boolean;
    meAndSecond: boolean;
    multiple: boolean;

    constructor(private sessionService: SessionService, private http: HttpClient, private config: ConfigService, private router: Router) {
    }

    uploadAndShareFile(path, content, user, cb) {
        this.http.post(this.config.server_url + 'putFile', {
            path: path,
            content: content
        }, {
            withCredentials: true,
            responseType: 'text'
        }).subscribe(res => {
            if (res === 'true') {
                this.sendRequest(path, user, (err) => {
                    cb(err);
                });
            } else {
                cb('Unknown error');
            }
        }, err => {
            cb(err);
        });
    }

    uploadFile(path, content, cb) {
        this.http.post(this.config.server_url + 'putFile', {
            path: path,
            content: content
        }, {
            withCredentials: true,
            responseType: 'text'
        }).subscribe(res => {
            if (res === 'true') {
                cb(false);
            } else {
                cb('Unknown error');
            }
        }, err => {
            cb(err);
        });
    }

    sendRequest(path, user, cb) {
        this.http.post(this.config.server_url + 'sendRequest', {
            path: path,
            user: user
        }, {
            withCredentials: true,
            responseType: 'text'
        }).subscribe(res => {
            if (res === 'ok') {
                cb(false);
            } else {
                cb('Unknown error');
            }
        }, err => {
            cb(err);
        });
    }

    onInvite(form: NgForm) {
        const value = form.value;

        if (value.user.indexOf('@') > -1) {
            this.http.post(this.config.server_url + 'emailExists', {
                email: value.user
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                if (res === 'true') {
                        this.uploadAndShareFile(this.sessionService.currentDocument.name, this.sessionService.currentDocument.content, value.user, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // radi dalje
                            console.log('document shared');
                        }
                    });
                } else {
                    alert('Email does not exist.');
                }
            }, err => {
                console.log(err);
            });
        } else {
            this.http.post(this.config.server_url + 'usernameExists', {
                username: value.user
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                if (res === 'true') {
                    this.uploadAndShareFile(this.sessionService.currentDocument.name, this.sessionService.currentDocument.content, value.user, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('document shared');

                        }
                    });
                } else {
                    alert('Username does not exist.');
                }
            }, err => {
                console.log(err);
            });
        }
    }

    onMultipleInvite(form: NgForm) {
        const value = form.value;

        const users = value.users.split(',');
        let valid = true;

        for (let i = 0; i < users.length; i++) {
            if (users[i].indexOf('@') > -1) {
                this.http.post(this.config.server_url + 'emailExists', {
                    email: users[i]
                }, {
                    withCredentials: true,
                    responseType: 'text'
                }).toPromise().then(
                    res => {
                        if (res === 'false') {
                            // valid = false;
                            // alert('Email ' + users[i] + ' does not exist.');
                            // break;
                        }
                    }, err => {
                        console.log(err);
                    }
                );
            } else {
                this.http.post(this.config.server_url + 'usernameExists', {
                    username: value.user
                }, {
                    withCredentials: true,
                    responseType: 'text'
                }).toPromise().then(res => {
                    if (res === 'false') {
                        // valid = false;
                        // alert('Username ' + users[i] + ' does not exist.');
                        // break;
                    }
                }, err => {
                    console.log(err);
                });
            }
        }

        if (valid) {
            this.uploadFile(this.sessionService.currentDocument.name, this.sessionService.currentDocument.content, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    for (let i = 0; i < users.length; i++) {
                        this.sendRequest(this.sessionService.currentDocument.name, users[i], (error) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('document sucessfully shared ' + users[i]);
                            }
                        });
                    }
                }
            });
        }
    }

    onSelect(value: any) {
        switch (value) {
            case '1':
                this.showNext = true;
                this.meAndSecond = false;
                this.multiple = false;
                break;

            case '2':
                this.showNext = true;
                this.meAndSecond = true;
                this.multiple = false;
                break;

            case '3':
                this.showNext = true;
                this.meAndSecond = false;
                this.multiple = true;
                break;

            default:
                this.showNext = false;
                this.meAndSecond = false;
                this.multiple = false;
                break;
        }
    }

    ngOnInit() {
    }

}
