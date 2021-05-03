import { NgModule, Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, AnimationEvent } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { AppConfigService } from '../service/appconfigservice';
import { VersionService } from '../service/versionservice';
import { AppConfig } from '../domain/appconfig';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./styles/decorator.scss'],
    animations: [
        trigger('overlayMenuAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
            ]),
            transition(':leave', [
                animate('.1s linear', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class AppTopBarComponent implements OnInit, OnDestroy {

    @Output() menuButtonClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('topbarMenu') topbarMenu: ElementRef;

    activeMenuIndex: number;

    outsideClickListener: any;

    config: AppConfig;

    subscription: Subscription;

    versions: any[];

    constructor(private router: Router, private versionService: VersionService, private configService: AppConfigService) { }

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);
        this.versionService.getVersions().then(data => this.versions = data);

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.activeMenuIndex = null;
            }
        });
    }

    onMenuButtonClick(event: Event) {
        this.menuButtonClick.emit();
        event.preventDefault();
    }

    bindOutsideClickListener() {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event) => {
                if (this.isOutsideTopbarMenuClicked(event)) {
                    this.activeMenuIndex = null;
                }
            };

            document.addEventListener('click', this.outsideClickListener);
        }
    }

    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }

    toggleMenu(event: Event, index: number) {
        this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
        event.preventDefault();
    }

    isOutsideTopbarMenuClicked(event): boolean {
        return !(this.topbarMenu.nativeElement.isSameNode(event.target) || this.topbarMenu.nativeElement.contains(event.target));
    }

    onOverlayMenuEnter(event: AnimationEvent) {
        switch (event.toState) {
            case 'visible':
                this.bindOutsideClickListener();
                break;

            case 'void':
                this.unbindOutsideClickListener();
                break;
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}