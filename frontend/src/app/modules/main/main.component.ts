import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NbDateService, NbMediaBreakpointsService} from '@nebular/theme';
import {ResizedEvent} from 'angular-resize-event';
import {ExpenseApiService} from '../../api/expense.api.service';
import {Calendar} from '../../api/objects/calendar';
import {User} from '../../api/objects/user';
import {SwipeEvent} from '../../interfaces/swipe.interface';
import {DateUtil} from '../../util/date.util';
import {MainService} from './main.service';

@Component({
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit {
    public isBusy: boolean = false;
    public isMobile: boolean;

    public constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly expenseApiService: ExpenseApiService,
        private readonly breakpointService: NbMediaBreakpointsService,
        private readonly dateService: NbDateService<Date>,
        private readonly zone: NgZone,
        public readonly mainService: MainService,
    ) {
        this.expenseApiService.onBusyChange.subscribe((isBusy: boolean) => this.isBusy = isBusy);
    }

    public ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ user }: { user: User }) => {
            this.mainService.user = user;
            this.mainService.calendar = user.calendars[0];
        });

        this.activatedRoute.queryParams.subscribe(({ date }: { date?: string }) => {
            if (date) {
                const parsedDate = this.dateService.parse(date, DateUtil.DATE_MONTH_DAY_FORMAT);
                if (DateUtil.valid(parsedDate)) {
                    this.mainService.visibleDate = parsedDate;
                }
            }
        });
    }

    public onResized(event: ResizedEvent): void {
        this.isMobile = this.breakpointService.getByName('md').width > event.newRect.width
    }

    public onSwipeEnd(event: SwipeEvent): void {
        if (event.direction === 'x') {
            this.zone.run(() => {
                const newVisibleDate = this.dateService.addMonth(this.mainService.visibleDate, event.distance < 0 ? 1 : -1);
                this.router.navigate(['.'], {
                    relativeTo: this.activatedRoute,
                    queryParams: { date: this.dateService.format(newVisibleDate, DateUtil.DATE_MONTH_DAY_FORMAT) },
                    queryParamsHandling: 'merge',
                    replaceUrl: true,
                })
            });
        }
    }

    public onRangeChange({ dateFrom, dateTo} : { dateFrom: Date, dateTo: Date }): void {
        this.mainService.calendarDateFrom = dateFrom;
        this.mainService.calendarDateTo = dateTo;

        this.mainService.refreshCalendar();
    }

    public onCalendarChange(calendar: Calendar): void {
        this.mainService.refreshCalendar(calendar);
    }
}
