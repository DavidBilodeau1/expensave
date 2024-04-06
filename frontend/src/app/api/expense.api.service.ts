import {Injectable, Type} from '@angular/core';
import {Observable} from 'rxjs';
import {EntityInterface} from '../interfaces/entity.interface';
import {AbstractApiService} from './abstract.api.service';
import {Expense} from './objects/expense';
import {ExpenseSuggestResponse} from './response/expense-suggest.response';

@Injectable()
export class ExpenseApiService extends AbstractApiService<Expense> {
    protected backend: string = '/expense';
    protected entity: Type<EntityInterface> = Expense;

    public suggest(label: string): Observable<ExpenseSuggestResponse> {
        return super.request<ExpenseSuggestResponse>(
            'post',
            ExpenseSuggestResponse,
            `${this.backend}/suggest`, {'label': label}
        );
    }
}
