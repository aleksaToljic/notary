import {Component, OnDestroy, OnInit} from '@angular/core';
import {Notification} from '../../components/notification/notification.model';
import {Subscription} from 'rxjs/Subscription';
import {NotificationService} from '../../components/notification/notification.service';
import * as Web3 from '../../../../node_modules/web3/src';
import {SessionService} from '../../shared/session.service';
import {ConfigService} from '../../config/config.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

    subscription = new Subscription();
    web3: any;
    notaryContract: any;
    notifications: any[];

    constructor(private notificationService: NotificationService, private sessionService: SessionService, private config: ConfigService, private http: HttpClient, private router: Router) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io'));

        this.notaryContract = new this.web3.eth.Contract(this.config.notary_contract_abi, this.config.notary_contract_address);
        setTimeout(() => {
            console.log(this.sessionService.address, 'kurcina1');
        }, 3000);
        this.subscription = this.sessionService.addressReceived.subscribe(
            (uploaded: boolean) => {
                console.log(this.sessionService.address, 'kurcina2');
                if (uploaded) {
                    this.getNotificationEvents();
                }
            }
        );
    }

    getNotificationEvents() {
        this.notaryContract.getPastEvents('Sent', {
            filter: {
                receiver: this.sessionService.address
            },
            fromBlock: this.config.contract_deployed_at_block,
            toBlock: 'latest'
        }, (error2, events2) => {
            console.log('sve ti jebem', events2);
            this.notifications = events2;
            // ako se prima isti dokument od razlicith ljudi????
            // i potpis za receive mora da bude validan
            this.getNotificationEventsInfo();
            this.getNotificationBlocksMinedAt();
            this.notificationsCheckEventsValidity();
            this.getNotificationFilenames();
        });
    }

    ngOnInit() {
        this.subscription = this.notificationService.notificationsChanged.subscribe(
            (notifications: Notification[]) => {
                this.notifications = notifications;
            }
        );
        this.notifications = this.notificationService.getNotifications();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getNotificationEventsInfo() {
        for (let eventNumber = 0; eventNumber < this.notifications.length; eventNumber++) {
            this.http.post(this.config.server_url + 'getUserInfo', {
                address: this.notifications[eventNumber]['returnValues']['sender']
            }, {
                withCredentials: true,
                responseType: 'text'
            }).subscribe((res) => {
                const data = JSON.parse(res);

                this.notifications[eventNumber]['username'] = data['username'];
                this.notifications[eventNumber]['firstname'] = data['firstname'];
                this.notifications[eventNumber]['lastname'] = data['lastname'];
                this.notifications[eventNumber]['email'] = data['email'];
            });
        }
    }

    getNotificationBlocksMinedAt() {
        for (let eventNumber = 0; eventNumber < this.notifications.length; eventNumber++) {
            this.web3.eth.getBlock(this.notifications[eventNumber]['blockNumber'], (err, block) => {
                if (!err) { // kad je block 0 onda je vreme ucofnirmaed, al to tek kad bude realtime
                    // onda i block mora da bude unconfirmed, gore u eventsInfo
                    if (block == null) {
                        this.notifications[eventNumber]['time'] = 'not confirmed';
                    } else {
                        const date = new Date(block['timestamp'] * 1000);

                        this.notifications[eventNumber]['time'] = date;
                        this.notifications[eventNumber]['timestamp'] = block['timestamp'];
                    }
                } else {
                    console.log(err);
                }
            });
        }
    }

    notificationsCheckEventsValidity() {
        for (let eventNumber = 0; eventNumber < this.notifications.length; eventNumber++) {
            if (this.web3.eth.accounts.recover(
                    this.notifications[eventNumber]['returnValues']['receiver'].toLowerCase() +
                    this.notifications[eventNumber]['returnValues']['documentHash'].toLowerCase(),
                    this.notifications[eventNumber]['returnValues']['signature'].toLowerCase()
                ).toLowerCase() === this.notifications[eventNumber]['returnValues']['receiver'].toLowerCase()) {
                this.notifications[eventNumber]['valid'] = true;
            } else {
                this.notifications[eventNumber]['valid'] = false;
            }
        }
    }

    getNotificationFilenames() {
        this.http.get(this.config.server_url + 'filelistWithHash', {
            responseType: 'text',
            withCredentials: true
        }).subscribe(res => {
            const files = JSON.parse(res);
            console.log(files);

            for (let x = 0; x < files.length; x++) {
                for (let y = 0; y < this.notifications.length; y++) {
                    if (this.notifications[y]['returnValues']['documentHash'].toLowerCase() === files[x]['sha3_hash'].toLowerCase()) {
                        console.log(222222, files[x]['name']);
                        this.notifications[y]['filename'] = files[x]['name'];
                        this.notifications[y]['filesize'] = files[x]['fileInfo']['{DAV:}getcontentlength'];
                        this.notifications[y]['filesha3'] = files[x]['sha3_hash'];
                    }
                }
            }
            console.log('bomba1111');
        }, err => {
            console.log(err, 123123333);

        });
    }

    getFile(path, cb) {
        this.http.post(this.config.server_url + 'getFile', {
            path: path
        }, {
            responseType: 'text',
            withCredentials: true
        }).subscribe(res => {
            cb(false, res);
        }, err => {
            cb(true, null);
        });
    }

    openFile(path, size, sha3) {
        this.getFile(path, (err, content) => {
            if (err) {
                console.log(err);
            } else {
                console.log(content);
                this.sessionService.currentDocument.size = size;
                this.sessionService.currentDocument.name = path.substr(1, path.length);
                this.sessionService.currentDocument.type = 'application/pdf';
                this.sessionService.currentDocument.content = content;
                this.sessionService.currentDocument.hash = sha3;
                this.sessionService.notificationSwitch.next(true);
                this.router.navigate(['notary/new-agreement/preview/3'], {fragment: 'audit'});
            }
        });
    }
}

