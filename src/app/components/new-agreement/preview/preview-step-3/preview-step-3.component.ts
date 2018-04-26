import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../../shared/session.service';
import * as Accounts from '../../../../web3-eth-accounts/src/index';
import {NgForm} from '@angular/forms';
import * as Web3 from '../../../../../../node_modules/web3/src';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../../../../config/config.service';

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

    transactionHash: string;

    signed = false;

    web3: any;
    notaryContract: any;

    events: any[];

    constructor(private sessionService: SessionService, private http: HttpClient, private config: ConfigService) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io'));

        this.notaryContract = new this.web3.eth.Contract(this.config.notary_contract_abi, this.config.notary_contract_address);
        this.notaryContract.getPastEvents('Signed', {
            filter: {
                documentHash: this.sessionService.currentDocument.hash
            },
            fromBlock: this.config.contract_deployed_at_block,
            toBlock: 'latest'
        })
            .then((events, error) => {
                this.sessionService.currentEvents = events;
                this.getEventsInfo();
                this.getBlocksMinedAt();
                this.checkEventsValidity();
                console.log(error, events);
            });
    }

    agree() {
        this.agreed = true;
        this.signDialog = true;
    }

    disagree() {
        this.agreed = false;
        this.signDialog = true;
    }


    onSign(form: NgForm) {

        const value = form.value;

        try {
            const privateKey = this.web3accounts.decrypt(JSON.parse(this.sessionService.privateKey), value.pass);

            this.http.post(this.config.server_url + 'sign', {
                address: this.sessionService.address,
                documentHash: this.sessionService.currentDocument.hash,
                agreed: this.agreed,
                signature: privateKey.sign(this.sessionService.address + this.agreed + this.sessionService.currentDocument.hash).signature
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                console.log(res);
                this.transactionHash = JSON.parse(res).transactionHash;
                this.signed = true;
            }, err => {
                console.log(err);
            });

            this.signDialog = false;

        } catch {
            alert('Wrong password!');
        }


    }

    ngOnInit() {
    }

    getEventsInfo() {
        for (let eventNumber = 0; eventNumber < this.sessionService.currentEvents.length; eventNumber++) {
            this.http.post(this.config.server_url + 'getUserInfo', {
                address: this.sessionService.currentEvents[eventNumber]['returnValues']['signer']
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe((res) => {
                const data = JSON.parse(res);

                this.sessionService.currentEvents[eventNumber]['username'] = data['username'];
                this.sessionService.currentEvents[eventNumber]['firstname'] = data['firstname'];
                this.sessionService.currentEvents[eventNumber]['lastname'] = data['lastname'];
                this.sessionService.currentEvents[eventNumber]['email'] = data['email'];
            });
        }
    }

    getBlocksMinedAt() {
        for (let eventNumber = 0; eventNumber < this.sessionService.currentEvents.length; eventNumber++) {
            this.web3.eth.getBlock(this.sessionService.currentEvents[eventNumber]['blockNumber'], (err, block) => {
                if (!err) { // kad je block 0 onda je vreme ucofnirmaed, al to tek kad bude realtime
                    // onda i block mora da bude unconfirmed, gore u eventsInfo
                    if (block == null) {
                        this.sessionService.currentEvents[eventNumber]['time'] = 'not confirmed';
                    } else {
                        let date = new Date(block['timestamp'] * 1000);

                        this.sessionService.currentEvents[eventNumber]['time'] = date;
                        this.sessionService.currentEvents[eventNumber]['timestamp'] = block['timestamp'];
                    }
                } else {
                    console.log(err)
                }
            });
        }
    }

    checkEventsValidity() {
        const operationName = {
            'true': 'agree',
            'false': 'disagree'
        };

        for (let eventNumber = 0; eventNumber < this.sessionService.currentEvents.length; eventNumber++) {
            if (this.web3.eth.accounts.recover(
                    this.sessionService.currentEvents[eventNumber]['returnValues']['signer'].toLowerCase() + this.sessionService.currentEvents[eventNumber]['returnValues']['agreed'] + this.sessionService.currentEvents[eventNumber]['returnValues']['documentHash'],
                    this.sessionService.currentEvents[eventNumber]['returnValues']['signature']
                ).toLowerCase() == this.sessionService.currentEvents[eventNumber]['returnValues']['signer'].toLowerCase()) {
                this.sessionService.currentEvents[eventNumber]['valid'] = true;
            } else {
                this.sessionService.currentEvents[eventNumber]['valid'] = false;
            }
        }
    }

}
