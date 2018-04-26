import {Notification} from './notification.model';
import {Subject} from 'rxjs/Subject';

export class NotificationService {

    notificationsChanged = new Subject<Notification[]>();
    private notifications: Notification[] = [
        new Notification('tolja', new Date(), true, 'Some document.pdf'),
        new Notification('user5', new Date(), true, 'Some document2.pdf'),
        new Notification('user7', new Date(), false, 'Some document3.pdf'),
    ];

    addNotification(notification: Notification) {
        this.notifications.push(notification);
        this.notificationsChanged.next(this.notifications.slice());
    }

    getNotifications() {
        return this.notifications.slice();
    }

    updateNotification(index: number, newNotification: Notification) {
        this.notifications[index] = newNotification;
        this.notificationsChanged.next(this.notifications.slice());
    }

    deleteNotification(index: number) {
        this.notifications.splice(index, 1);
        this.notificationsChanged.next(this.notifications.slice());
    }
}
