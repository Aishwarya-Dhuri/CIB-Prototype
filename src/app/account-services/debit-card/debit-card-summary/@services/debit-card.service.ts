import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const URL_CONST = {
  GET_ACCOUNTS: 'setup/corporateOnboarding/corporateMain/private/accountList',
  GET_ALL_DEBIT_CARDS: 'accountServices/debitCard/private/getAllDebitCards',
};

@Injectable({
  providedIn: 'root',
})
export class DebitCardService {
  constructor(private userService: UserService, private httpService: HttpService) {}

  getAccounts() {
    const data = { dataMap: { corporateId: this.userService.getCorporateId() } };
    return this.httpService
      .httpPost(URL_CONST.GET_ACCOUNTS, data)
      .pipe(map((response: any) => response.dataList));
  }

  getAllDebitCards() {
    return this.httpService
      .httpPost(URL_CONST.GET_ALL_DEBIT_CARDS)
      .pipe(map((response: any) => response.dataList));
  }

  getDebitCardList(paginationData?: any): Observable<any[]> {
    let data = {
      startRow: 0,
      endRow: 10,
      rowGroupCols: [],
      valueCols: [],
      pivotCols: [],
      pivotMode: false,
      groupKeys: [],
      filterModel: {},
      sortModel: [],
      entityName: '',
    };
    const paginationObj = paginationData || {};
    data = { ...data, ...paginationObj };
    return this.httpService.httpPost(URL_CONST.GET_ALL_DEBIT_CARDS, data);
    // .pipe(map((response: any): any[] => response.data));
  }
}
