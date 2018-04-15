import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import * as Web3 from '../../../../node_modules/web3/src';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  web3: any;

  @Output() onDrop = new EventEmitter<documentProps>();
  @Input() uploadMode: boolean = true;

  constructor() {
    this.web3 = new Web3();
  }

  ngOnInit() {
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
      this.onDrop.emit({
        name: fileObject.name,
        size: fileObject.size,
        hash: this.web3.utils.sha3(fileContent),
        type: fileObject.type,
        content: fileContent
      }); //treba web3 da se uradi web3.utils.sha3
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
