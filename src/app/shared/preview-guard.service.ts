import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class PreviewGuard implements CanActivate, CanActivateChild {

    constructor(private sessionService: SessionService, private router: Router) {
    }


    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        return this.sessionService.isUploaded().then(
            (authenticated: boolean) => {
                if (authenticated) {

                    return true;
                } else if (this.sessionService.currentDocument.content !== '') {
                    return true;
                } else {
                    this.router.navigate(['/notary/new-agreement']);
                }
            }
        );
    }

    canActivateChild(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }
}
