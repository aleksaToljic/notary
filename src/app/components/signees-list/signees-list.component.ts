import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../shared/session.service';

@Component({
    selector: 'app-signees-list',
    templateUrl: './signees-list.component.html',
    styleUrls: ['./signees-list.component.scss']
})
export class SigneesListComponent implements OnInit {


    constructor(private sessionService: SessionService) {
    }

    ngOnInit() {
    }

}
