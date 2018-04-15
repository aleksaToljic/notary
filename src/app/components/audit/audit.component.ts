import { Component, OnInit } from '@angular/core';

import { Http } from '@angular/http';

import { ConfigService } from '../../config/config.service';

import 'rxjs/add/operator/map';

import * as Web3 from '../../../../node_modules/web3/src';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  documentProperties: documentProps;
  uploadMode: boolean = true;

  notaryContract: any;

  web3: any;

  events: any = [];

  constructor(private config: ConfigService, private http: Http) {
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://' + this.config.network_name + '.infura.io/'));
    this.notaryContract = new this.web3.eth.Contract(this.config.notary_contract_abi, this.config.notary_contract_address);
  }

  ngOnInit() {
  }

  signatures() {
    /*this.notaryContract.events.Signed({
      filter: {
        document: this.documentProperties.hash
      },
      fromBlock: this.config.contract_deployed_at_block,
      toBlock: 'latest'
    })
    .on('data', function(event){
        console.log(event);
    })*/ // ne radi?????????????

    this.notaryContract.getPastEvents('Signed', {
      filter: {
        documentHash: this.documentProperties.hash
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
  }

  getEventsInfo() {
    for (let numberOfEvents = 0; numberOfEvents < this.events.length; numberOfEvents++) {
      this.http.post(this.config.server_url + 'getUserInfo', {
        address: this.events[numberOfEvents]['returnValues']['signer']
      }).map(res => res.json()).subscribe((data) => {
        this.events[numberOfEvents]['username'] = data['username'];
        this.events[numberOfEvents]['firstname'] = data['firstname']
        this.events[numberOfEvents]['lastname'] = data['lastname'];
        this.events[numberOfEvents]['email']= data['email'];
      });
    }
  }

  getBlocksMinedAt() {
    for (let numberOfEvents = 0; numberOfEvents < this.events.length; numberOfEvents++) {
      this.web3.eth.getBlock(this.events[numberOfEvents]['blockNumber'], (err, block) => {
        if (!err) { // kad je block 0 onda je vreme ucofnirmaed, al to tek kad bude realtime
          // onda i block mora da bude unconfirmed, gore u eventsInfo
          if (block == null) {
            this.events[numberOfEvents]['time'] = 'not confirmed';
          } else {
            let date = new Date(block['timestamp'] * 1000);

            this.events[numberOfEvents]['time'] = date;
          }
        } else {
          //inform user
        }
      });
    }
  }

  changeListener($event) : void {
    this.readThis($event.target);
    this.uploadMode = false;
  }

  readThis(inputValue: any) : void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.readAsDataURL(file);
//napravi loading document
//vise data typeova, i viewer za njih, to ne ide sigurno preko readera
//napravi da vuce preko stream-a
//https://github.com/maxogden/filereader-stream
//https://stackoverflow.com/questions/25810051/filereader-api-on-big-files

    let loaded = (fileObject, fileContent) => {
      this.documentProperties = {
        name: fileObject.name,
        size: fileObject.size,
        hash: this.web3.eth.accounts.hashMessage(fileContent),
        type: fileObject.type,
        content: fileContent
      }; //treba web3 da se uradi web3.utils.sha3
    }

    myReader.onloadend = function(e){
      window.document.getElementById('viewer').setAttribute('src', myReader.result);
      loaded(file, myReader.result);
    }
  }

}

interface documentProps {
  name: string;
  size: number;
  hash: string;
  type: string;
  content: string;
}
