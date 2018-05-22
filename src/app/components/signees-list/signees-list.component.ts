import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionService} from '../../shared/session.service';
import * as Web3 from '../../../../node_modules/web3/src';
import {ConfigService} from '../../config/config.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-signees-list',
    templateUrl: './signees-list.component.html',
    styleUrls: ['./signees-list.component.scss']
})
export class SigneesListComponent implements OnInit, OnDestroy {
    descending = false;
    showSignature: boolean[] = [];
    web3: any;
    notaryContract: any;
    filterString: string;
    column = '';
    order: number;
    refreshing = false;
    isAudit = false;
    subscription = new Subscription();

    constructor(public sessionService: SessionService, private config: ConfigService, private http: HttpClient, private route: ActivatedRoute) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io'));


        this.notaryContract = new this.web3.eth.Contract(this.config.notary_contract_abi, this.config.notary_contract_address);
        this.refreshEvents();
    }

    sort(column) {
        this.column = column;
        this.descending = !this.descending;
        this.order = this.descending ? 1 : -1;
        console.log('order', this.order);
    }

    getASCBool(column) {
        if (this.column === column && this.order !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    getDSCBool(column) {
        if (this.column === column && this.order === 1) {
            return true;
        } else {
            return false;
        }
    }


    refreshEvents() {
        this.refreshing = true;
        this.notaryContract.getPastEvents('Signed', {
            filter: {
                documentHash: this.sessionService.currentDocument.hash
            },
            fromBlock: this.config.contract_deployed_at_block,
            toBlock: 'latest'
        }).then((events, error) => {
            this.sessionService.currentEvents = events;
            this.getEventsInfo();
            this.getBlocksMinedAt();
            this.checkEventsValidity();
            console.log(22, error, events);
            this.filterString = '';
            for (let x = 0; x < events.length; x++) {
                this.showSignature.push(false);
            }
        }).then(() => {
            this.refreshing = false;
        });
    }


    ngOnInit() {
        if (this.route.snapshot.fragment === 'audit') {
            this.isAudit = true;
        }
        this.subscription = this.sessionService.notificationSwitch.subscribe(res => {
            if (res) {
                this.refreshEvents();
            }
        });
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
                    console.log(err);
                }
            });
        }
    }

    checkEventsValidity() {
        console.log(11);
        for (let eventNumber = 0; eventNumber < this.sessionService.currentEvents.length; eventNumber++) {
            if (this.web3.eth.accounts.recover(
                    this.sessionService.currentEvents[eventNumber]['returnValues']['signer'].toLowerCase() +
                    this.sessionService.currentEvents[eventNumber]['returnValues']['agreed'] +
                    this.sessionService.currentEvents[eventNumber]['returnValues']['documentHash'].toLowerCase(),
                    this.sessionService.currentEvents[eventNumber]['returnValues']['signature']
                ).toLowerCase() == this.sessionService.currentEvents[eventNumber]['returnValues']['signer'].toLowerCase()) {
                this.sessionService.currentEvents[eventNumber]['valid'] = true;
            } else {
                this.sessionService.currentEvents[eventNumber]['valid'] = false;
            }
        }

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
