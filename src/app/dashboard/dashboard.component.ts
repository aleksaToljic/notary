import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../config/config.service';
import {SessionService} from '../shared/session.service';
import {HttpClient} from '@angular/common/http';
import * as Web3 from '../../../node_modules/web3/src';
import {Subscription} from 'rxjs/Subscription';
import {NgForm} from '@angular/forms';
import * as Accounts from '../web3-eth-accounts/src/index';
import {NotificationService} from '../components/notification/notification.service';
import {Notification} from '../components/notification/notification.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    subscription: Subscription;
    blocked = false;
    closeButton = false;
    web3: any;
    notaryContract: any;

    web3accounts: any = Accounts;

    transactionHash = '';

    awaitingForTransaction: boolean;

    password: string;

    showBlockerPassword: boolean[] = [];
    showBlockerButtons: boolean[] = [];
    buttonsDisabled: boolean;

    recievedDocuments: any[] = [];
    recievedNotificationEvents: any[] = [];

    checkInterval: any;

    constructor(private config: ConfigService, private sessionService: SessionService, private http: HttpClient, private notificationService: NotificationService) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io'));

        this.notaryContract = new this.web3.eth.Contract(this.config.notary_contract_abi, this.config.notary_contract_address);
        setTimeout(() => {
            console.log(this.sessionService.address, 'kurcina1');
        }, 3000);
        this.subscription = this.sessionService.addressReceived.subscribe(
            (uploaded: boolean) => {
                console.log(this.sessionService.address, 'kurcina2');
                if (uploaded) {
                    this.refreshEvents();
                }
            }
        );


    }


    refreshEvents() {
        this.recievedDocuments = [];

        let sentEvents, receivedEvents = [];

        this.notaryContract.getPastEvents('Sent', {
            filter: {
                receiver: this.sessionService.address
            },
            fromBlock: this.config.contract_deployed_at_block,
            toBlock: 'latest'
        }, (error, events) => {
            sentEvents = events;

            this.notaryContract.getPastEvents('Received', {
                filter: {
                    receiver: this.sessionService.address
                },
                fromBlock: this.config.contract_deployed_at_block,
                toBlock: 'latest'
            }, (error2, events2) => {
                receivedEvents = events2;
                console.log(receivedEvents, receivedEvents.length);

                // ako se prima isti dokument od razlicith ljudi????
                // i potpis za receive mora da bude validan

                for (let x = 0; x < sentEvents.length; x++) {
                    let received = false;

                    for (let y = 0; y < receivedEvents.length; y++) {
                        if (sentEvents[x]['returnValues']['documentHash'].toLowerCase() === receivedEvents[y]['returnValues']['documentHash'].toLowerCase()) {
                            received = true;
                        }
                    }

                    if (received === false) {
                        this.recievedDocuments.push(sentEvents[x]);
                    }
                }

                this.getEventsInfo();
                this.getBlocksMinedAt();
                this.checkEventsValidity();
                this.getFilenames();
                console.log(2, error, events);

                for (let x = 0; x < events.length; x++) {
                    this.showBlockerPassword[x] = false;
                    this.showBlockerButtons[x] = true;
                }
            });
        });
    }

    async ngOnInit() {
        if (await this.checkBlock()) {
            this.refreshEvents();
            this.blocked = true;
            this.closeButton = false;
        } else {
            this.checkInterval = setInterval(async () => {
                if (await this.checkBlock()) {
                    this.refreshEvents();
                    this.blocked = true;
                    this.closeButton = false;

                    clearInterval(this.checkInterval);
                }
            }, 5000);
        }
        // this.getNotificationEvents();
        setTimeout(() => {
            // this.getNotificationEvents();
            this.http.get(this.config.server_url + 'lastEventTimestamp', {
                withCredentials: true
            }).subscribe(res => {
                    console.log('bem ti leba', res);
                },
                err => {
                    console.log(err);
                });
            // console.log('JEBOTEE', this.recievedNotificationEvents);
            // for (const notificationEvent of this.recievedNotificationEvents) {
            //     const notification = new Notification(notificationEvent.username, notificationEvent.time, true, notificationEvent.filename);
            //     this.notificationService.addNotification(notification);
            // }
        }, 10000);
    }

    checkBlock() {
        return new Promise(resolve => {
            if (this.sessionService.loggedin) {
                this.http.get(this.config.server_url + 'isBlocked', {withCredentials: true, responseType: 'text'}).subscribe(
                    res => {
                        console.log(56565, res);
                        resolve(JSON.parse(res).data);
                    }, err => {
                        console.log(err);
                    }
                );
            }
        });
    }

    getEventsInfo() {
        for (let eventNumber = 0; eventNumber < this.recievedDocuments.length; eventNumber++) {
            this.http.post(this.config.server_url + 'getUserInfo', {
                address: this.recievedDocuments[eventNumber]['returnValues']['sender']
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe((res) => {
                const data = JSON.parse(res);

                this.recievedDocuments[eventNumber]['username'] = data['username'];
                this.recievedDocuments[eventNumber]['firstname'] = data['firstname'];
                this.recievedDocuments[eventNumber]['lastname'] = data['lastname'];
                this.recievedDocuments[eventNumber]['email'] = data['email'];
            });
        }
    }

    getBlocksMinedAt() {
        for (let eventNumber = 0; eventNumber < this.recievedDocuments.length; eventNumber++) {
            this.web3.eth.getBlock(this.recievedDocuments[eventNumber]['blockNumber'], (err, block) => {
                if (!err) { // kad je block 0 onda je vreme ucofnirmaed, al to tek kad bude realtime
                    // onda i block mora da bude unconfirmed, gore u eventsInfo
                    if (block == null) {
                        this.recievedDocuments[eventNumber]['time'] = 'not confirmed';
                    } else {
                        const date = new Date(block['timestamp'] * 1000);

                        this.recievedDocuments[eventNumber]['time'] = date;
                        this.recievedDocuments[eventNumber]['timestamp'] = block['timestamp'];
                    }
                } else {
                    console.log(err);
                }
            });
        }
    }

    checkEventsValidity() {
        for (let eventNumber = 0; eventNumber < this.recievedDocuments.length; eventNumber++) {
            if (this.web3.eth.accounts.recover(
                    this.recievedDocuments[eventNumber]['returnValues']['sender'].toLowerCase() +
                    this.recievedDocuments[eventNumber]['returnValues']['receiver'].toLowerCase() +
                    this.recievedDocuments[eventNumber]['returnValues']['documentHash'].toLowerCase(),
                    this.recievedDocuments[eventNumber]['returnValues']['signature'].toLowerCase()
                ).toLowerCase() === this.recievedDocuments[eventNumber]['returnValues']['sender'].toLowerCase()) {
                this.recievedDocuments[eventNumber]['valid'] = true;
            } else {
                this.recievedDocuments[eventNumber]['valid'] = false;
            }
        }
    }


    getFilenames() {
        this.http.get(this.config.server_url + 'filelistWithHash', {
            responseType: 'text',
            withCredentials: true
        }).subscribe(res => {
            const files = JSON.parse(res);
            console.log(files);

            for (let x = 0; x < files.length; x++) {
                for (let y = 0; y < this.recievedDocuments.length; y++) {
                    if (this.recievedDocuments[y]['returnValues']['documentHash'].toLowerCase() === files[x]['sha3_hash'].toLowerCase()) {
                        console.log(222222);
                        this.recievedDocuments[y]['filename'] = files[x]['name'];
                    }
                }
            }
        }, err => {
            console.log(err, 123123333);

        });
    }


    receive(index) {
        clearInterval(this.checkInterval);

        this.transactionHash = '';
        this.password = '';

        for (let x = 0; x < this.showBlockerPassword.length; x++) {
            if (x === index) {
                this.showBlockerPassword[index] = true;

            } else {
                this.showBlockerPassword[x] = false;
            }
        }
    }

    onBlockerSubmit(form: NgForm) {
        const value = form.value;
        console.log(value);
    }

    completeReceivation(index, documentHash) {
        this.buttonsDisabled = true;

        try {
            const privateKey = this.web3accounts.decrypt(JSON.parse(this.sessionService.privateKey), this.password);
            delete this.password;
            this.awaitingForTransaction = true;
            this.http.post(this.config.server_url + 'receive', {
                receiver: this.sessionService.address,
                documentHash: documentHash,
                signature: privateKey.sign(
                    this.sessionService.address.toLowerCase() +
                    documentHash.toLowerCase()
                ).signature
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe(res => {
                console.log(res);
                this.transactionHash = JSON.parse(res).transactionHash;
                this.awaitingForTransaction = false;
                this.showBlockerButtons[index] = false;
                this.buttonsDisabled = false;

                this.checkInterval = setInterval(async () => {
                    if ((await this.checkBlock()) === false) {
                        this.closeButton = true;
                    } else {
                        if (this.blocked === false) {
                            this.refreshEvents();
                        }
                        this.blocked = true;
                        this.closeButton = false;

                        clearInterval(this.checkInterval);
                    }
                }, 5000);
            }, err => {
                console.log(err);
            });

        } catch {
            alert('Wrong password!');
        }

    }

}
