import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { AmountBeingPaidRendererComponent } from '../../../@components/amount-being-paid-renderer/amount-being-paid-renderer.component';
import { DueDateRendererComponent } from '../../../@components/due-date-renderer/due-date-renderer.component';
import { FetchBillsActionRendererComponent } from '../../../@components/fetch-bills-action-renderer/fetch-bills-action-renderer.component';
import { PaymentDateRendererComponent } from '../../../@components/payment-date-renderer/payment-date-renderer.component';
import { BillPaymentService } from '../../@services/bill-payment.service';

class SchedulePayment {
  constructor(
    public paymentMethod: string = '',
    public payAmount: string = '',
    public holidayAction: string = '',
    public startDate: string = '',
    public endDate: string = '',
  ) {}
}

class PaymentDetails {
  constructor(
    public paymentMethod: string = 'Debit Card',
    public cardNumber: string = '',
    public nameOnCard: string = '',
    public expiryDate: string = '',
    public cvv: string = '',
  ) {}
}

@Component({
  selector: 'app-large-biller-payment-details',
  templateUrl: './large-biller-payment-details.component.html',
  styleUrls: ['./large-biller-payment-details.component.scss'],
})
export class LargeBillerPaymentDetailsComponent implements OnInit {
  @ViewChild('consumersGrid') consumersGrid: AgGridListingComponent;

  loading = true;
  loadingGrid = false;

  consumersCount: number = 0;

  showSubmit = false;
  showApplyToSelectedDialog = false;
  paymentDetails = false;
  isSchedulePayment = false;
  selectingRows = false;

  paymentDateToBeApplied: string = '';

  schedule: SchedulePayment = new SchedulePayment();

  paymentDetailsForm: PaymentDetails = new PaymentDetails();

  biller: any;

  consumerDetailsColDefsUrl = 'payments/billPayments/registeredBillPayment/consumerDetailsColDefs';

  colDefs = [
    { headerName: 'Consumer', field: 'consumer' },
    { headerName: 'Bill No', field: 'billNo' },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      cellRenderer: 'dueDateRenderer',
      filter: 'agDateColumnFilter',
      floatingFilter: false,
    },
    {
      headerName: 'Bill Amount',
      field: 'billAmount',
      cellRenderer: 'currencyRenderer',
    },
    {
      headerName: 'Amount Being Paid',
      field: 'amountBeingPaid',
      cellRenderer: 'currencyRenderer',
      filter: false,
      floatingFilter: false,
    },
    {
      headerName: 'Payment Date',
      field: 'paymentDate',
      cellRenderer: 'dateRenderer',
      filter: false,
      floatingFilter: false,
    },
  ];

  consumers: any[] = [];

  rowData: any[] = [];
  reviewRowData: any[] = [];

  frameworkComponents = {
    fetchBillsActionRenderer: FetchBillsActionRendererComponent,
    amountBeingPaidRenderer: AmountBeingPaidRendererComponent,
    paymentDateRenderer: PaymentDateRendererComponent,
    dueDateRenderer: DueDateRendererComponent,
  };

  gridOptions = {
    rowModelType: 'clientSide',
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
  };

  selectedConsumer: any;

  selectedConsumers: any[] = [];
  selectedBillsForTotal: any[] = [];

  totalPayableAmount = 0;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private billPaymentService: BillPaymentService,
    private toasterService: ToasterService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.biller = this.billPaymentService.activeBiller;

    if (!this.biller) {
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

    this.setBreadcrumbAndActions('Biller Details');

    const data = {
      dataMap: {
        category: this.biller.category,
        billerName: this.biller.billerName,
        product: this.biller.product,
        type: this.biller.type,
      },
    };

    this.httpService
      .httpPost('payments/billPayments/billerRegistration/private/getBillerConsumers', data)
      .subscribe((response: any) => {
        this.consumers = response.data;

        this.consumersCount = response.data.length;

        this.prepareRowData();

        this.loading = false;
      });
  }

  setBreadcrumbAndActions(heading: string) {
    const actions: Actions = {
      heading,
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Account Services' },
      { label: 'Bill Payment' },
      { label: heading },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  prepareRowData() {
    const rowData: any[] = [];

    this.consumers.forEach((consumer: any) => {
      if (consumer.children && consumer.children.length > 0) {
        const i = consumer.actions.findIndex((action: any) => action.methodName === 'fetchBills');

        if (i >= 0) {
          consumer.actions.splice(i, 1);
        }
      }

      rowData.push(consumer);

      if (consumer.children && consumer.children.length > 0) {
        consumer.children.forEach((billDetails: any) => {
          rowData.push(billDetails);
        });
      }
    });

    this.rowData = rowData;
  }

  prepareReviewRowData() {
    const rowData: any[] = [];

    this.consumers.forEach((consumer: any) => {
      if (consumer.selected || consumer.partialSelected) {
        if (consumer.children && consumer.children.length > 0) {
          rowData.push(consumer);

          consumer.children.forEach((billDetails: any) => {
            if (billDetails.selected) {
              rowData.push(billDetails);
            }
          });
        }
      }
    });

    this.reviewRowData = rowData;
  }

  applyPaymentDateToSelectedBills() {
    this.consumers = this.consumers.map((consumer: any) => {
      if (consumer.children && consumer.children.length > 0) {
        consumer.children = consumer.children.map((billDetails: any) => {
          if (billDetails.selected) {
            billDetails.paymentDate = this.paymentDateToBeApplied;
          }

          return billDetails;
        });
      }

      return consumer;
    });

    this.selectedBillsForTotal.forEach((data: any) => {
      data.paymentDate = this.paymentDateToBeApplied;

      const index = this.rowData.findIndex((rData: any) => rData.id == data.id);
      if (index >= 0) {
        this.rowData[index].paymentDate = this.paymentDateToBeApplied;
        this.consumersGrid.updateRowDataByIndex(index, data);
      }
    });

    // this.resetSelection();

    this.paymentDateToBeApplied = '';

    this.showApplyToSelectedDialog = false;
  }

  fetchBills(rowIndex: any, rowData: any) {
    this.httpService
      .httpPost('payments/billPayments/billerRegistration/private/getBillerConsumerBills', {
        dataMap: { noOfBills: rowData.noOfBills },
      })
      .subscribe((response: any) => {
        const data = response.data.map((d: any, i: number) => {
          return {
            ...d,
            parentId: rowData.id,
            id: '' + rowData.id + i,
            billNo: 'Bill No ' + rowData.id + i,
          };
        });

        const i = this.consumers.findIndex((consumer: any) => consumer.id === rowData.id);

        if (i >= 0) {
          this.consumers[i]['children'] = data;

          this.resetSelection();
        }
      });
  }

  raiseDispute(rowIndex: any, rowData: any) {}

  changePay(e: any) {
    // if (e.id === 'Other') {
    //   this.schedule.payAmount = '';
    //   return;
    // }

    this.schedule.payAmount = this.selectedConsumer.billAmount;
  }

  fetchSelected() {
    const reqData: any[] = [];
    for (let selectedConsumer of this.selectedConsumers) {
      const consumer = this.consumers.find((cons: any) => cons.id === selectedConsumer);

      if (consumer) {
        reqData.push({ id: consumer.id, noOfBills: consumer.noOfBills });
      }
    }

    this.httpService
      .httpPost('payments/billPayments/billerRegistration/private/getMultipleConsumerBills', {
        dataMap: { selectedConsumers: reqData },
      })
      .subscribe((response: any) => {
        for (let selectedConsumer of this.selectedConsumers) {
          const consumerIndex = this.consumers.findIndex(
            (cons: any) => cons.id === selectedConsumer,
          );

          if (consumerIndex >= 0) {
            const consumer = this.consumers[consumerIndex];

            const data = response.data
              .find((c: any) => c.id === consumer.id)
              .bills.map((d: any, i: number) => {
                return {
                  ...d,
                  parentId: consumer.id,
                  id: '' + consumer.id + i,
                  billNo: 'Bill No ' + consumer.id + i,
                };
              });

            this.consumers[consumerIndex]['children'] = data;
          }
        }

        this.resetSelection();
      });
  }

  schedulePayment(rowIndex: any, rowData: any) {
    const data = {
      dataMap: {
        id: rowData.id,
      },
    };

    this.httpService
      .httpPost('payments/billPayments/billerRegistration/private/view', data)
      .subscribe((response: any) => {
        this.selectedConsumer = response;

        this.isSchedulePayment = true;

        this.paymentDetailsForm = new PaymentDetails();

        this.setBreadcrumbAndActions('Schedule Payment');
      });
  }

  onRowSelection(selectedRow: any) {
    if (!this.selectingRows) {
      if (!selectedRow.data.parentId) {
        const consumerIndex = this.consumers.findIndex(
          (consumer) => consumer.id === selectedRow.data.id,
        );

        this.consumers[consumerIndex].selected = selectedRow.node.selected;

        if (this.consumers[consumerIndex].children) {
          this.consumers[consumerIndex].children = this.consumers[consumerIndex].children.map(
            (bill: any) => {
              const selectedBilIndex = this.selectedBillsForTotal.findIndex(
                (b: any) => b.id === bill.id,
              );

              const newBill = {
                ...bill,
                selected: selectedRow.node.selected,
              };

              if (selectedRow.node.selected) {
                if (selectedBilIndex === -1) {
                  this.selectedBillsForTotal.push(bill);
                }
              } else {
                if (selectedBilIndex !== -1) {
                  this.selectedBillsForTotal.splice(selectedBilIndex, 1);
                }
              }

              return newBill;
            },
          );

          this.agGridRowSelect(this.consumers[consumerIndex].children, selectedRow.node.selected);
        } else {
          const selectedConsumerIndex = this.selectedConsumers.findIndex(
            (selectedConsumer: string) => selectedConsumer === selectedRow.data.id,
          );

          if (selectedRow.node.selected) {
            if (selectedConsumerIndex === -1) {
              this.selectedConsumers.push(selectedRow.data.id);
            }
          } else {
            if (selectedConsumerIndex !== -1) {
              this.selectedConsumers.splice(selectedConsumerIndex, 1);
            }
          }
        }
      } else {
        const selectedBilIndex = this.selectedBillsForTotal.findIndex(
          (b: any) => b.id === selectedRow.data.id,
        );

        if (selectedRow.node.selected) {
          if (selectedBilIndex === -1) {
            this.selectedBillsForTotal.push(selectedRow.data);
          }
        } else {
          if (selectedBilIndex !== -1) {
            this.selectedBillsForTotal.splice(selectedBilIndex, 1);
          }
        }

        const consumerIndex = this.consumers.findIndex(
          (consumer) => consumer.id === selectedRow.data.parentId,
        );

        if (consumerIndex >= 0) {
          const billIndex = this.consumers[consumerIndex].children.findIndex(
            (b: any) => b.id === selectedRow.data.id,
          );

          if (billIndex >= 0) {
            this.consumers[consumerIndex].children[billIndex].selected = selectedRow.node.selected;
          }

          let selectedChildCount = 0;

          this.consumers[consumerIndex].children.forEach((child: any) => {
            if (child.selected) {
              selectedChildCount++;
            }
          });

          if (selectedChildCount > 0) {
            this.consumers[consumerIndex].partialSelected = true;
          } else {
            this.consumers[consumerIndex].partialSelected = false;
          }

          this.agGridRowSelect(
            [this.consumers[consumerIndex]],
            this.consumers[consumerIndex].children.length === selectedChildCount,
          );
        }
      }

      this.totalPayableAmount = this.getTotalPayableAmount();
    }
  }

  agGridRowSelect(rows: any[], selected: boolean) {
    this.selectingRows = true;

    const ids: string[] = [];

    rows.forEach((row) => {
      ids.push(row.id);
    });

    if (selected) {
      this.consumersGrid.selectRowsByIds(ids);
    } else {
      this.consumersGrid.unselectRowsByIds(ids);
    }

    setTimeout(() => {
      this.selectingRows = false;
    }, 100);
  }

  getTotalPayableAmount() {
    let total = 0;

    this.selectedBillsForTotal.forEach((bill: any) => {
      total = total + +bill.amountBeingPaid;
    });

    return total;
  }

  previous() {
    this.paymentDetails = false;
    this.isSchedulePayment = false;
    this.showSubmit = false;
    this.selectedConsumer = null;
    // this.resetSelection();

    this.selectedConsumers = [];

    this.setBreadcrumbAndActions('Biller Details');

    setTimeout(() => {
      this.selectedBillsForTotal.forEach((selectedBill: any) => {
        this.consumersGrid.selectRow(selectedBill, 'id');
      });
    }, 100);
  }

  payNow() {
    this.prepareReviewRowData();

    this.paymentDetails = true;

    this.setBreadcrumbAndActions('Payment Details');
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  submit() {
    const formData = {
      billerType: 'registered',
      ...this.biller,
      ...this.paymentDetailsForm,
      channel: 'WEB',
      status: 'Paid',
      serviceType: '--',
      billNo: this.biller.id,
      consumerName: `Consumer ${new Date().getTime()}`,
      consumers: this.reviewRowData,
    };

    formData.outstandingBalance = formData.totalPayableAmount;

    this.httpService
      .httpPost('payments/billPayments/payBill/private/create', formData)
      .subscribe((response: any) => {
        this.biller.dueDate = new Date().toDateString();
        this.showSubmit = true;
      });
  }

  onSchedule() {
    const formData = {
      billerType: 'registered',
      ...this.biller,
      ...this.paymentDetailsForm,
      ...this.schedule,
      consumers: [this.selectedConsumer],
    };

    formData.outstandingBalance = formData.totalPayableAmount;

    this.httpService
      .httpPost('payments/billPayments/payBill/private/create', formData)
      .subscribe((response: any) => {
        this.toasterService.showToaster({
          severity: 'success',
          detail: 'Payment Scheduled Successfully',
        });
        this.previous();
      });
  }

  prepareConsumers() {
    this.consumers = this.consumers.map((consumer: any) => {
      consumer.selected = false;
      consumer.partiallySelected = false;

      if (consumer.children) {
        consumer.children = consumer.children.map((bill: any) => {
          bill.selected = false;

          return bill;
        });
      }

      return consumer;
    });
  }

  resetSelection() {
    this.selectedConsumers = [];
    this.selectedBillsForTotal = [];

    this.prepareConsumers();

    this.prepareRowData();

    if (this.consumersGrid) {
      this.consumersGrid.setRowData(this.rowData);
      this.consumersGrid.refreshGridList();
    }

    this.refreshGrid();
  }

  refreshGrid() {
    this.loadingGrid = true;
    setTimeout(() => {
      this.loadingGrid = false;
    }, 100);
  }

  ngOnDestroy() {}
}
