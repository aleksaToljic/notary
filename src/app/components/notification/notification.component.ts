import {Component, OnDestroy, OnInit} from '@angular/core';
import {Notification} from '../../components/notification/notification.model';
import {Subscription} from 'rxjs/Subscription';
import {NotificationService} from '../../components/notification/notification.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

    subscription = new Subscription();

    notifications: Notification[];

    constructor(private notificationService: NotificationService) {
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

}

