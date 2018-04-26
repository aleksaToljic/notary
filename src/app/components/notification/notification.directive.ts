import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

@Directive({
    selector: '[appClickOutside]'
})
export class NotificationDirective {
    @HostBinding('class.show') isOpen = false;

    constructor(private _elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }

        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.isOpen = false;
        } else if (targetElement.parentElement.classList[0] === 'hell' && this.isOpen) {
            this.isOpen = false;
        } else {
            this.isOpen = true;
        }
    }
}
