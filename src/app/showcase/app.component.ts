import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'state-flow-engine';

    menuActive: boolean;

    newsActive = true;

    constructor() { }

    onMenuButtonClick() {
        this.menuActive = true;
        this.addClass(document.body, 'blocked-scroll');
    }

    onMaskClick() {
        this.hideMenu();
    }

    hideMenu() {
        this.menuActive = false;
        this.removeClass(document.body, 'blocked-scroll');
    }

    addClass(element: any, className: string) {
        if (element.classList) {
            element.classList.add(className);
        }
        else {
            element.className += ' ' + className;
        }
    }

    removeClass(element: any, className: string) {
        if (element.classList) {
            element.classList.remove(className);
        }
        else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    applyScale(scale: number) {
        document.documentElement.style.fontSize = scale + 'px';
    }

    ngOnDestroy(): void {

    }
    ngOnInit(): void {

    }

}
