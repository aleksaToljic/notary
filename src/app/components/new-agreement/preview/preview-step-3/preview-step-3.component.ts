import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../../shared/session.service';
import * as Accounts from '../../../../web3-eth-accounts/src/index';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../../config/config.service';
import {NgProgress} from 'ngx-progressbar';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-preview-step-3',
    templateUrl: './preview-step-3.component.html',
    styleUrls: ['./preview-step-3.component.scss']
})
export class PreviewStep3Component implements OnInit {
    signDialog = false;
    web3accounts: any = Accounts;
    signInput: string;
    agreed: boolean;
    showHash: boolean;
    isAudit = false;

    transactionHash: string;

    progressbar: boolean;

    signed = false;

    web3: any;
    notaryContract: any;

    // events: any[];

    constructor(public sessionService: SessionService, private http: HttpClient, private config: ConfigService, private ngprogress: NgProgress, private route: ActivatedRoute) {
    }


    agree() {
        this.agreed = true;
        this.signDialog = true;
    }

    disagree() {
        this.agreed = false;
        this.signDialog = true;
    }

    toggleHash() {
        if (this.showHash) {
            this.showHash = false;
        } else {
            this.showHash = true;
        }
    }

    onSign(form: NgForm) {

        const value = form.value;

        try {
            const privateKey = this.web3accounts.decrypt(JSON.parse(this.sessionService.privateKey), value.pass);

            this.progressbar = true;

            this.http.post(this.config.server_url + 'sign', {
                address: this.sessionService.address,
                documentHash: this.sessionService.currentDocument.hash,
                agreed: this.agreed,
                signature: privateKey.sign(this.sessionService.address.toLowerCase() + this.agreed + this.sessionService.currentDocument.hash.toLowerCase()).signature.toLowerCase()
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                console.log(res);
                this.transactionHash = JSON.parse(res).transactionHash;
                this.signed = true;
                this.progressbar = false;
            }, err => {
                console.log(err);
                this.progressbar = false;
            });

            this.signDialog = false;

        } catch {
            alert('Wrong password!');
        }


    }

    ngOnInit() {
        if (this.route.snapshot.fragment === 'audit') {
            this.isAudit = true;
        }
    }


}
