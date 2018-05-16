import {Component, OnInit, ViewChild} from '@angular/core';
import {SessionService} from '../../../shared/session.service';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../config/config.service';
import * as Accounts from '../../../web3-eth-accounts/src/index';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    @ViewChild('f') slForm: NgForm;
    @ViewChild('f2') s2Form: NgForm;
    showNext: boolean;
    meAndSecond: boolean;
    multiple: boolean;
    signedMeAndSecond: boolean;
    web3accounts: any = Accounts;
    signed: boolean;
    transactionB: boolean;
    transactionHash: string;
    await: boolean;
    multipleInviteSignDialog: boolean;
    multipleTxHashes: any[] = [];

    texts: string[] = [];
    users: string[] = ['tolja', 'ajaleksa', 'grizzello', 'tolja4', 'aRes', 'aTim', 'tolja2', 'tolja3'];
    results: string[];

    receiver: any;

    constructor(private sessionService: SessionService, private http: HttpClient, private config: ConfigService) {
    }

    submitedMeAndSecond() {
        this.signedMeAndSecond = true;
    }

    search(event) {
        const query = event.query;
        this.results = this.filterCountry(query, this.users);
    }

    filterCountry(query, users: any[]): any[] {
        const filtered: any[] = [];
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let isAlready = false;
            for (const text of this.texts) {
                if (user === text) {
                    isAlready = true;
                }
            }
            if (user.toLowerCase().indexOf(query.toLowerCase()) == 0 && !isAlready) {
                filtered.push(user);
            }
        }
        return filtered;
    }

    createSignature() {
        try {
            const privateKey = this.web3accounts.decrypt(JSON.parse(this.sessionService.privateKey), this.slForm.form.value.password);
            this.showNext = false;
            console.log(1112, privateKey);
            if (this.slForm.form.value.user.indexOf('@') > -1) {
                this.http.post(this.config.server_url + 'getUserInfoByEmail', {
                    email: this.receiver
                }, {
                    responseType: 'text',
                    withCredentials: true
                }).subscribe(
                    res => {
                        console.log(1113, res);
                        const signature = privateKey.sign(this.sessionService.address.toLowerCase() + JSON.parse(res).address.toLowerCase() + this.sessionService.currentDocument.hash.toLowerCase()).signature.toLowerCase();
                        console.log(1114, signature);
                        this.await = true;
                        this.signed = true;
                        console.log(1115, this.slForm);
                        this.onInvite(this.slForm, signature);
                    }, err => {
                        console.log(err);
                    }
                );
            } else {
                this.http.post(this.config.server_url + 'getUserInfoByUsername', {
                    username: this.receiver
                }, {
                    responseType: 'text',
                    withCredentials: true
                }).subscribe(
                    res => {
                        console.log(1116, res);
                        const signature2 = privateKey.sign(this.sessionService.address.toLowerCase() + JSON.parse(res).address.toLowerCase() + this.sessionService.currentDocument.hash.toLowerCase()).signature.toLowerCase();
                        console.log(1117, signature2);
                        this.await = true;
                        this.signed = true;
                        console.log(1118, this.slForm);
                        this.onInvite(this.slForm, signature2);
                    }, error => {
                        console.log(error);
                    }
                );
            }


        } catch {
            alert('Wrong Password!');
        }


    }

    uploadAndShareFile(path, content, user, signature, cb) {
        this.http.post(this.config.server_url + 'putFile', {
            path: path,
            content: content
        }, {
            withCredentials: true,
            responseType: 'text'
        }).subscribe(res => {
            if (res === 'true') {
                this.sendRequest(path, user, signature, (err) => {
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

    sendRequest(path, user, signature, cb) {
        if (user.indexOf('@') > -1) {
            this.http.post(this.config.server_url + 'sendRequest', {
                path: path,
                email: user,
                documentHash: this.sessionService.currentDocument.hash,
                signature: signature
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                if (res) {
                    cb(false);
                    if (this.multiple) {
                        this.multipleTxHashes.push(JSON.parse(res).transactionHash);
                        console.log(this.multipleTxHashes);
                    } else {
                        this.transactionHash = JSON.parse(res).transactionHash;
                        console.log(this.transactionHash);
                    }

                    this.transactionB = true;
                } else {
                    cb('Unknown error');
                }
            }, err => {
                cb(err);
            });
        } else {
            this.http.post(this.config.server_url + 'sendRequest', {
                path: path,
                user: user,
                documentHash: this.sessionService.currentDocument.hash,
                signature: signature
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                if (res) {
                    cb(false);
                    if (this.multiple) {
                        this.multipleTxHashes.push(JSON.parse(res).transactionHash);
                        console.log(this.multipleTxHashes);
                    } else {
                        this.transactionHash = JSON.parse(res).transactionHash;
                        console.log(this.transactionHash);
                    }

                    this.transactionB = true;
                } else {
                    cb('Unknown error');
                }
            }, err => {
                cb(err);
            });
        }
    }

    onInvite(form: NgForm, signature) {
        const value = form.value;
        console.log(33, value);
        if (value.user.indexOf('@') > -1) {
            console.log(334);
            this.http.post(this.config.server_url + 'emailExists', {
                email: value.user
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                console.log(34, res);
                if (res === 'true') {
                    console.log(35);
                    this.uploadAndShareFile(this.sessionService.currentDocument.name, this.sessionService.currentDocument.content, value.user, signature, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            this.await = false;
                            this.showNext = true;
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
            console.log(36, value.user);
            this.http.post(this.config.server_url + 'usernameExists', {
                username: value.user
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                console.log(367, res);
                if (res === 'true') {
                    console.log(37, res);
                    this.uploadAndShareFile(this.sessionService.currentDocument.name, this.sessionService.currentDocument.content, value.user, signature, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            this.await = false;
                            this.showNext = true;
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

    emailExists(user) {
        return new Promise(resolve => {
            this.http.post(this.config.server_url + 'emailExists', {
                email: user
            }, {
                withCredentials: true,
                responseType: 'text'
            }).toPromise().then(
                res => {
                    resolve(JSON.parse(res));
                }, err => {
                    console.log(err);
                }
            );
        });
    }

    usernameExists(user) {
        return new Promise(resolve => {
            this.http.post(this.config.server_url + 'usernameExists', {
                username: user
            }, {
                withCredentials: true,
                responseType: 'text'
            }).toPromise().then(res => {
                resolve(JSON.parse(res));

            }, err => {
                console.log(err);
            });
        });
    }

    async checkUsers() {
        let valid = true;

        const users = this.texts;

        for (let i = 0; i < users.length; i++) {
            const user = users[i];

            if (users[i].indexOf('@') > -1) {
                if (!(await this.emailExists(user))) {
                    valid = false;
                    alert('Email ' + users[i] + ' does not exist.');
                    // break;
                }
            } else {
                if (!(await this.usernameExists(user))) {
                    valid = false;
                    alert('Username ' + users[i] + ' does not exist.');
                    // break;
                }
            }
        }

        if (valid) {
            this.multipleInviteSignDialog = true;
        }
    }

    createMultipleSignature() {
        const users = this.texts;

        this.uploadFile(this.sessionService.currentDocument.name, this.sessionService.currentDocument.content, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('document uploaded');

                try {
                    const privateKey = this.web3accounts.decrypt(JSON.parse(this.sessionService.privateKey), this.s2Form.form.value.password);
                    this.await = true;

                    for (let user = 0; user < users.length; user++) {
                        this.http.post(this.config.server_url + 'getUserInfoByEmail', {
                            email: users[user]
                        }, {
                            responseType: 'text',
                            withCredentials: true
                        }).subscribe(
                            res => {
                                const signature = privateKey.sign(this.sessionService.address.toLowerCase() + JSON.parse(res).address.toLowerCase() + this.sessionService.currentDocument.hash.toLowerCase()).signature.toLowerCase();
                                console.log(signature);
                                this.multipleInviteSignDialog = false;

                                this.sendRequest(this.sessionService.currentDocument.name, users[user], signature, (err2) => {
                                    if (err2) {
                                        console.log(err2);
                                    } else {
                                        console.log('document shared');
                                    }
                                });
                            }, err3 => {
                                this.http.post(this.config.server_url + 'getUserInfoByUsername', {
                                    username: users[user]
                                }, {
                                    responseType: 'text',
                                    withCredentials: true
                                }).subscribe(
                                    res => {
                                        const signature = privateKey.sign(this.sessionService.address.toLowerCase() + JSON.parse(res).address.toLowerCase() + this.sessionService.currentDocument.hash.toLowerCase()).signature.toLowerCase();
                                        console.log(signature);
                                        this.multipleInviteSignDialog = false;

                                        this.sendRequest(this.sessionService.currentDocument.name, users[user], signature, (err4) => {
                                            if (err4) {
                                                console.log(err4);
                                            } else {
                                                console.log('document shared');
                                            }
                                        });
                                    }, error => {
                                        console.log(error);
                                    }
                                );
                            }
                        );

                        this.await = false;
                        this.showNext = true;
                    }
                } catch {
                    alert('Wrong password.');
                }
            }
        });
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
                this.showNext = false;
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
