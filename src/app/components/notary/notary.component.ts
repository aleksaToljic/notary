import { Component, OnInit, Input } from '@angular/core';
import {SessionService} from "../../shared/session.service";

@Component({
  selector: 'app-notary',
  templateUrl: './notary.component.html',
  styleUrls: ['./notary.component.css']
})
export class NotaryComponent implements OnInit {

  columns: number;
  // session: sessionInterface;
  documentProperties: documentProps = {
    name: '',
    size: 0,
    hash: '',
    type: '',
    content: ''
  };

  showSignatures: boolean = false;
  uploadMode: boolean = true;

  @Input() showProps: boolean = true;
  @Input() showSign: boolean = true;
  @Input() showHyperlink: boolean = false;
  @Input() title: string = "Notary";

  constructor(private sessionService: SessionService) {
    if (window.innerWidth / window.innerHeight >= 1) {
      this.columns = 2;
    } else {
      this.columns = 1;
    }
  }

  ngOnInit() {

  }

  onResize(event) {
      let width = event.target.innerWidth;
      let height = event.target.innerHeight;

      if (width / height >= 1) {
        this.columns = 2;
      } else {
        this.columns = 1;
      }
  }

  droped(event) {
    this.documentProperties = event;
    this.showSignatures = true;
    this.uploadMode = false;
  }

  // sessionMidleman(event) {
  //   this.sessionService = event;
  // }

  close(event) {
    this.showSignatures = false;
    this.uploadMode = true;
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
