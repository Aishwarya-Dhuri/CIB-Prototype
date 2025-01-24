import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/@services/http.service';
import { map } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { UserService } from '../../../shared/@services/user.service';
import { MenuService } from '../../../base/main/@services/menu.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  URL_CONST = {
    CREDICARD_COLDEF_URL: 'accountServices/creditCard/private/creditCardColDef',
    GET_CREDITCARDS: 'accountServices/creditCard/private/getCreditCards',
    NEAREST_DUE_COLDEF_URL: 'accountServices/creditCard/private/nearestDueColDef',
    UNBILLED_COLDEF_URL: 'accountServices/creditCard/private/unbilledDueColDef',
    VIEWRECENTCREDITS_COLDEF_URL: 'accountServices/creditCard/private/viewRecentCreditsColDef',
    VIEW: 'accountServices/creditCard/private/view',
  };

  selectedCardDetails: any;
  insights: any[] = [
    {
      icon: 'fa-info-circle',
      class: 'text-color-danger',
      label: 'Payment due date of credit card XXXX1111 has exprired yesterday.',
    },
    {
      icon: 'fa-info-circle',
      class: 'text-color-success',
      label:
        'Electricity auto payment is due in next 3 days. Card XXXX2222 offers 1% cash back on utlity payments.',
    },
  ];

  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private menuService: MenuService,
  ) {}

  getCreditCardList(paginationData?: any): Observable<any[]> {
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
    return this.httpService.httpPost(this.URL_CONST.GET_CREDITCARDS, data);
    // .pipe(map((response: any): any[] => response.data));
  }

  getCreditCard(url: string, id: string) {
    //DB Id
    return this.httpService.httpPost(url || this.URL_CONST.VIEW, { dataMap: { id } });
  }

  getFilterData(cardNo: string) {
    const dataMap = { filters: [] };
    dataMap.filters.push({ name: 'cardNo', value: cardNo });
    return dataMap;
  }

  getCreditCardByFilter(url: string, data: any) {
    //fetching from respective listing
    return this.httpService.httpPost(url || this.URL_CONST.VIEW, data);
  }

  getAccounts() {
    const data = { dataMap: { corporateId: this.userService.getCorporateId() } };
    return this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .pipe(map((response: any) => response.dataList));
  }

  getCreditCardById(creditCardId: string) {
    console.log(creditCardId);
    return this.getCreditCardList().pipe(
      map((response: any): any[] => response.data),
      map((data: any[]) => {
        const filterData = data.filter((card) => card.id === creditCardId);
        return filterData && filterData.length > 0 ? filterData[0] : undefined;
      }),
    );
  }

  getSupplementaryCards(): Observable<any> {
    const supplementaryCards = {
      columnData: [
        { headerName: 'Credit Card No', field: 'cardNo' },
        { headerName: 'Embossed Name', field: 'embossedName' },
        { headerName: 'Card Type', field: 'cardType' },
        { headerName: 'Credit Limit', field: 'cardLimit', cellRenderer: 'currencyRenderer' },
        { headerName: 'Cash Limit', field: 'cashLimit', cellRenderer: 'currencyRenderer' },
      ],
      rowData: [
        {
          cardNo: '1234 XXXX XXXX 4567',
          embossedName: 'Robert',
          cardType: 'Visa',
          cardLimit: '2000000',
          cashLimit: '20000',
        },
        {
          cardNo: '1234 XXXX XXXX 4567',
          embossedName: 'Albert',
          cardType: 'Visa',
          cardLimit: '2000000',
          cashLimit: '20000',
        },
      ],
    };
    return of(supplementaryCards);
  }

  getNearestDueData() {
    const rowData$ = this.getCreditCardList().pipe(
      map((response: any): any[] => response.data),
      map((data: any[]) => {
        data.map((a, index) => {
          a.actions = [];
          const action = {
            displayName: 'Pay Now',
            index: 1,
            onClick: 'id',
            type: 'BUTTON',
            methodName: `payNow('${data[index].id}')`,
          };
          a.actions.push(action);
        });
        return data;
      }),
    );
    const columnData$ = this.httpService.httpPost(this.URL_CONST.NEAREST_DUE_COLDEF_URL, {});
    return forkJoin([rowData$, columnData$]).pipe(
      map((results: any[]) => {
        const data: any = {};
        data.rowData = results[0];
        data.columnData = results[1].columnDefs;
        return data;
      }),
    );
  }

  getAmount(amt: any) {
    try {
      return parseInt(amt.replaceAll(',', ''));
    } catch (e) {
      console.log(e);
    }
    return amt;
  }

  getTopUnbilledData() {
    const rowData$ = this.getCreditCardList().pipe(
      map((response: any): any[] => response.data),
      map((data) =>
        data.sort((a, b) => this.getAmount(b.unbilledAmount) - this.getAmount(a.unbilledAmount)),
      ),
    );
    const columnData$ = this.httpService.httpPost(this.URL_CONST.UNBILLED_COLDEF_URL, {});
    return forkJoin([rowData$, columnData$]).pipe(
      map((results: any[]) => {
        const data: any = {};
        data.rowData = results[0];
        data.columnData = results[1].columnDefs;
        return data;
      }),
    );
  }

  authorizeRecord(id, serviceUrl) {
    let data = { dataMap: { ids: [id] } };
    this.httpService.httpPost(serviceUrl + '/private/authorize', data).subscribe((res) => {
      console.log('authorized txn ', id);
    });
  }

  setServiceURL(url: any) {
    this.menuService.setSelectedServiceUrl(url);
  }
}
