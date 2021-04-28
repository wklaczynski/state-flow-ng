import { Component, ElementRef, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FilterService } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { AppConfigService } from '../service/appconfigservice';
import { Subscription } from 'rxjs';
import { AppConfig } from '../domain/appconfig';

declare let gtag: Function;

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./styles/decorator.scss'],
    animations: [
        trigger('submenu', [
            state('hidden', style({
                height: '0',
                overflow: 'hidden',
                opacity: 0,
            })),
            state('visible', style({
                height: '*',
                opacity: 1
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
        ])
    ]
})
export class AppMenuComponent {

    @Input() active: boolean;
    
    activeSubmenus: {[key: string]: boolean} = {};

    filteredRoutes: any[];

    selectedRoute: any;

    submenuRouting: boolean;

    routes = [
        {
            label: 'General', value: 'general', 
            items: [
                {label: 'Setup', value: '/setup'},
            ]
        },
        {
            label: 'Examles', value: 'examles', 
            items: [
                {label: 'SCXML Structure', value: '/example/scxml-structure'}
            ]
        },
        {
            label: 'Utilities', value: 'utilities', 
            items: [
                {label: 'Develop', value: '/develop'}
            ]
        },
    ];

    scrollable = true;

    config: AppConfig;

    subscription: Subscription;

    constructor(private el: ElementRef,private router: Router, private filterService: FilterService, private configService: AppConfigService) {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => this.config = config);
        router.events.subscribe((routerEvent) => {
                if (routerEvent instanceof NavigationStart && (routerEvent.navigationTrigger ==="popstate" || this.scrollable)){
                    let routeUrl = routerEvent.url;

                    if (this.isSubmenu(routeUrl) && !this.isSubmenuActive('/'+routeUrl.split('/')[1])){
                        this.submenuRouting = true;
                    }

                    if (routerEvent.navigationTrigger ==="popstate") {
                        this.scrollable = true;
                    }
                }
    
                if (routerEvent instanceof NavigationEnd && !this.submenuRouting && this.scrollable){
                    setTimeout(() => {
                        this.scrollToSelectedRoute();
                    },1);
                }
        });
    }

    filterGroupedRoute(event) {
        let query = event.query;
        let filteredGroups = [];

        for (let optgroup of this.routes) {
            let filteredSubOptions = this.filterService.filter(optgroup.items, ['value'], query, "contains");
            if (filteredSubOptions && filteredSubOptions.length) {
                filteredGroups.push({
                    label: optgroup.label,
                    value: optgroup.value,
                    items: filteredSubOptions
                });
            }
        }

        this.filteredRoutes = filteredGroups;
    }

    onSelect(event) {
        if (this.router.url !== event.value) {
            this.scrollable = true;
            this.router.navigate([event.value]);
        }

        this.selectedRoute = null;
    }

    onAnimationDone() {
        if (this.submenuRouting) {
            this.scrollToSelectedRoute();
            this.submenuRouting = false;
        }
    }

    scrollToSelectedRoute() {
        let routeEl = DomHandler.findSingle(this.el.nativeElement, '.router-link-exact-active');

        if (routeEl) 
            routeEl.scrollIntoView({inline: 'start'});

        this.scrollable = false;
    }

    toggleSubmenu(event: Event, name: string) {
        this.activeSubmenus[name] = this.activeSubmenus[name] ? false: true;
        event.preventDefault();
    }

    isSubmenu(route) {
        return route.includes('table') || route.includes('treetable') || route.includes('tree') || route.includes('galleria');
    }

    isSubmenuActive(name: string) {
        if (this.activeSubmenus.hasOwnProperty(name)) {
            return this.activeSubmenus[name];
        }
        else if (this.router.isActive(name, false)) {
            this.activeSubmenus[name] = true;
            return true;
        }

        return false;
    }
}