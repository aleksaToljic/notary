import {Component, OnDestroy, OnInit} from '@angular/core';
import {SessionService} from '../../shared/session.service';
import {Subscription} from 'rxjs/Subscription';


@Component({
    selector: 'app-new-agreement',
    templateUrl: './new-agreement.component.html',
    styleUrls: ['./new-agreement.component.scss']
})
export class NewAgreementComponent implements OnInit, OnDestroy {
    subscription = new Subscription();

    constructor(private sessionService: SessionService) {
    }

    ngOnInit() {
        this.sessionService.currentDocument = {name: '', size: 0, hash: '', type: '', content: ''};
        this.subscription = this.sessionService.documentUploadedSubject.subscribe(
            (uploaded: boolean) => {
                if (uploaded) {
                    console.log('this is sub' + uploaded);
                    this.sessionService.documentUploaded = true;
                    setTimeout(() => this.sessionService.documentUploaded = true, 4000);
                }
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
