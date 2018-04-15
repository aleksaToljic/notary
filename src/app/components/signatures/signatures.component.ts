import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    Pipe,
    PipeTransform,
    SimpleChange
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {Http} from '@angular/http';

import {ConfigService} from '../../config/config.service';

import 'rxjs/add/operator/map';

import * as Web3 from '../../../../node_modules/web3/src'
import {SessionService} from "../../shared/session.service";

@Component({
    selector: 'app-signatures',
    templateUrl: './signatures.component.html',
    styleUrls: ['./signatures.component.css']
})
export class SignaturesComponent implements OnInit, OnChanges {

    web3: any;
    notaryContract: any;

    events: any = [];

    @Input() documentProperties: documentProps;
    // @Input() session: sessionInterface;

    documentHash: string = "0x0000000000000000000000000000000000000000000000000000000000000000";

    @Input() showSignatures: boolean = false;

    @Input() showProps: boolean = true;

    @Input() showSign: boolean = true;
    @Input() showHyperlink: boolean = false;

    @Output() closeEvent = new EventEmitter();

    refreshSignaturesInterval: any;
    refreshSignaturesIntervalFunction: any;

    validFilterCriteria: string = 'true';

    constructor(public dialog: MatDialog, private http: Http, private config: ConfigService, private ref: ChangeDetectorRef, private sessionService: SessionService) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://' + this.config.network_name + '.infura.io/'));
        this.notaryContract = new this.web3.eth.Contract(this.config.notary_contract_abi, this.config.notary_contract_address);
    }

    ngOnInit() {
        this.refreshSignaturesIntervalFunction = () => {
            this.notaryContract.getPastEvents('Signed', {
                filter: {
                    documentHash: this.documentHash
                },
                fromBlock: this.config.contract_deployed_at_block,
                toBlock: 'latest'
            })
                .then((events) => {
                    this.events = events;
                    this.getEventsInfo();
                    this.getBlocksMinedAt();
                    this.checkEventsValidity();
                });
        }
        /*
        this.refreshSignaturesIntervalFunction = () => {
          this.notaryContract.getPastEvents('Signed', {
            filter: {
              documentHash: this.documentHash
            },
            fromBlock: this.config.contract_deployed_at_block,
            toBlock: 'latest'
          })
          .then((events) => {
            if (events.lenth != this.events.length) {
              let difference = events.length - this.events.length;
              let firstDifferentEvent = events.length - difference - 1;

              for (let eventNumber = firstDifferentEvent; eventNumber < events; eventNumber++) {
                this.events.push(events[eventNumber]);
              }

              this.getEventsInfo();
              this.getBlocksMinedAt();
            }
          });
        }
        */ //realtime alternativa, ne radi
        this.refreshSignaturesInterval = setInterval(this.refreshSignaturesIntervalFunction, 5000);
        /*this.notaryContract.events.Signed({
          filter: {
            documentHash: this.documentHash
          },
          fromBlock: this.config.contract_deployed_at_block
        }, (err, data) => {
          console.log(err, data)
        })*/
        //wait for web3 to implenet websockets error is: The current provider doesn't support subscriptions

        console.log(this.showProps, this.showSign, this.showHyperlink)
        this.ref.detectChanges();
        //////////////
        ///
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        // errorrrrrrrrrr, ne promeni ngIF
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        ////////////////////////////
    }

    ngOnChanges(change: { [propKey: string]: SimpleChange }) {
        if (change['documentProperties'] != undefined) {
            if (change['documentProperties']['currentValue']['hash'] == "") {
                clearInterval(this.refreshSignaturesInterval);
            } else {
                this.documentHash = change['documentProperties']['currentValue']['hash'];
                this.notaryContract.getPastEvents('Signed', {
                    filter: {
                        documentHash: this.documentHash
                    },
                    fromBlock: this.config.contract_deployed_at_block,
                    toBlock: 'latest'
                })
                    .then((events) => {
                        this.events = events;
                        this.getEventsInfo();
                        this.getBlocksMinedAt();
                    });
                this.refreshSignaturesInterval = setInterval(this.refreshSignaturesIntervalFunction, 5000);
            }
            /*if (change['documentProperties']['currentValue']['hash'] == "") {
              this.documentHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
            } else {
              this.documentHash = change['documentProperties']['currentValue']['hash'];
              console.log('----------', this.documentHash)
              this.notaryContract.getPastEvents('Signed', {
                filter: {
                  documentHash: this.documentHash
                },
                fromBlock: this.config.contract_deployed_at_block,
                toBlock: 'latest'
              })
              .then((events) => {
                console.log(events)
                //vidi pa stavi i block number, block hash, time...
                //onda ono confirmed unconfirmed, al kad uspostavis real time tj subscribe
                //isto ovo i za reject, napravi da uzme signees pa rejectors i posbno ih izlista,
                //a kasnije ce biti u jednom objektu sortirani po vremenu
                this.events = events;
                this.getEventsInfo();
                this.getBlocksMinedAt();
              });
            }*/
            // ovo iznad kad implementiras subsrie na event
        }
    }

    getEventsInfo() {
        for (let eventNumber = 0; eventNumber < this.events.length; eventNumber++) {
            this.http.post(this.config.server_url + 'getUserInfo', {
                address: this.events[eventNumber]['returnValues']['signer']
            }).map(res => res.json()).subscribe((data) => {
                this.events[eventNumber]['username'] = data['username'];
                this.events[eventNumber]['firstname'] = data['firstname']
                this.events[eventNumber]['lastname'] = data['lastname'];
                this.events[eventNumber]['email'] = data['email'];
            });
        }
    }

    getBlocksMinedAt() {
        for (let eventNumber = 0; eventNumber < this.events.length; eventNumber++) {
            this.web3.eth.getBlock(this.events[eventNumber]['blockNumber'], (err, block) => {
                if (!err) { // kad je block 0 onda je vreme ucofnirmaed, al to tek kad bude realtime
                    // onda i block mora da bude unconfirmed, gore u eventsInfo
                    if (block == null) {
                        this.events[eventNumber]['time'] = 'not confirmed';
                    } else {
                        let date = new Date(block['timestamp'] * 1000);

                        this.events[eventNumber]['time'] = date;
                    }
                } else {
                    //inform user
                }
            });
        }
    }

    checkEventsValidity() {
        let operationName = {
            'true': 'agree',
            'false': 'disagree'
        }

        for (let eventNumber = 0; eventNumber < this.events.length; eventNumber++) {
            if (this.web3.eth.accounts.recover(
                    'I, ' + this.events[eventNumber]['returnValues']['signer'].toLowerCase() + ', ' +
                    (this.events[eventNumber]['returnValues']['agreed'] ? 'agree' : 'disagree') +
                    ' with content of document with hash: ' + this.events[eventNumber]['returnValues']['documentHash'] + '.',
                    this.events[eventNumber]['returnValues']['signature']
                ).toLowerCase() == this.events[eventNumber]['returnValues']['signer'].toLowerCase()) {
                this.events[eventNumber]['valid'] = true;
            } else {
                this.events[eventNumber]['valid'] = false;
            }
        }
    }

    sign() {
        let dialogRef = this.dialog.open(SignDialog, {
            data: {
                encryptedPrivateKey: this.sessionService.privateKey
            }
        })

        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                console.log('I, ' + this.sessionService.address + ', ' + result.operationName + ' with content of document with hash: ' + this.documentProperties.hash + '.')
                this.http.post(this.config.server_url + 'broadcastToBlockchain', {
                    documentHash: this.documentProperties.hash,
                    signature: result.privateKey.sign(
                        'I, ' + this.sessionService.address.toLowerCase() + ', ' + result.operationName + ' with content of document with hash: ' + this.documentProperties.hash + '.'
                    ).signature,
                    operation: result.operation
                }, {
                    withCredentials: true
                }).map(res => res.json()).subscribe((data) => {
                    this.dialog.open(TxHashDialog, {
                        data: {
                            txHash: data['transactionHash']
                        }
                    })
                });
            }
        });
    }

    filter() {
        let dialogRef = this.dialog.open(FilterDialog, {})
    }

    close() {
        this.documentHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
        this.closeEvent.emit();
    }

}

@Component({
    selector: 'app-dialog-sign',
    templateUrl: 'sign.html'
})
export class SignDialog {

    web3: any;
    password: string;
    message: string;

    operationName: string = 'agree';

    operationBoolean = {
        'agree': true,
        'disagree': false
    }

    constructor(public dialogRef: MatDialogRef<SignDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.web3 = new Web3();
        // u dialogu dekriptuj kljuc genersi public key potpisi i posalji!!!!
    }

    toggle() {
        if (this.operationName == 'agree') {
            this.operationName = 'disagree';
        } else if (this.operationName == 'disagree') {
            this.operationName = 'agree'
        }
    }

    decrypt() {
        try {
            this.dialogRef.close({
                privateKey: this.web3.eth.accounts.decrypt(this.data.encryptedPrivateKey, this.password),
                operation: this.operationBoolean[this.operationName],
                operationName: this.operationName
            })
        }

        catch {
            this.message = "Wrong password, try again."
        }
        //jedan dialog sa uspesno potpisano, status: pending ili koji k vec, i tx hash

        //gore si subscribeovan na eventovve za taj doc,
        //ako je adresa prepoznatljiva onda ubaci ime, ako ne onda jbg,
        //ako je block hash null, onda je pending
        //ako postoji block hash, onda je confirmed
        //kad se collapse imaju informacije: timestamp, mined at (block (time)), signature, tx hash, i linkovi do etherscan
    }
}

@Component({
    selector: 'app-dialog-txhash',
    templateUrl: 'txhash.html'
})
export class TxHashDialog {
    constructor(public dialogRef: MatDialogRef<TxHashDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public config: ConfigService) {
    }

    close() {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'app-dialog-filter',
    templateUrl: 'filter.html'
})
export class FilterDialog {
    constructor(public dialogRef: MatDialogRef<SignDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private config: ConfigService) {
    }
}

@Component({
    selector: 'app-dialog-hyperlink',
    templateUrl: 'hyperlink.html'
})
export class HyperlinkDialog {
    constructor(public dialogRef: MatDialogRef<SignDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private config: ConfigService) {
    }
}

@Pipe({
    name: 'validFilter',
    pure: false
})
export class ValidFilterPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter || filter == 'both') {
            return items;
        }

        items.map(item => console.log)

        return items.filter(item => item['valid'] == filter);
    }
}

interface documentProps {
    name: string;
    size: number;
    hash: string;
    type: string;
    content: string;
}

interface sessionInterface {
    username: string,
    address: string,
    privateKey: any
}
