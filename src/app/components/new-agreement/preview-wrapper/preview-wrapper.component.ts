import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../../shared/session.service';

@Component({
    selector: 'app-preview-wrapper',
    templateUrl: './preview-wrapper.component.html',
    styleUrls: ['./preview-wrapper.component.scss']
})
export class PreviewWrapperComponent implements OnInit {

    constructor(private sessionService: SessionService) {
    }

    ngOnInit() {
    }

}
