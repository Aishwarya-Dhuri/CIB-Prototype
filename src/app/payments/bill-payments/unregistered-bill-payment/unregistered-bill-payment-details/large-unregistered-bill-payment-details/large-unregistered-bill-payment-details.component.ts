import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { UnregisteredBillPaymentService } from '../../@services/unregistered-bill-payment.service';
import { AmountBeingPaidRendererComponent } from '../../../@components/amount-being-paid-renderer/amount-being-paid-renderer.component';
import { DueDateRendererComponent } from '../../../@components/due-date-renderer/due-date-renderer.component';
import { PaymentDateRendererComponent } from '../../../@components/payment-date-renderer/payment-date-renderer.component';
import { MenuService } from 'src/app/base/main/@services/menu.service';

@Component({
  selector: 'app-large-unregistered-bill-payment-details',
  templateUrl: './large-unregistered-bill-payment-details.component.html',
  styleUrls: ['./large-unregistered-bill-payment-details.component.scss'],
})
export class LargeUnregisteredBillPaymentDetailsComponent implements OnInit {
  @ViewChild('consumersGrid') consumersGrid: any;

  loading = true;

  showSubmit = false;
  showApplyToSelectedDialog = false;

  selectingRows = false;

  paymentDateToBeApplied: string = '';

  additionalDetails: any = {
    subscriberName: '',
    registerBiller: '',
  };

  paymentDetailsForm: any = {
    paymentMethod: 'Debit Card',
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  };

  filters: any[] = [];
  biller: any;

  consumerDetailsColDefsUrl =
    'payments/billPayments/unregisteredBillPayment/consumerDetailsColDefs';

  colDefs = [
    { headerName: 'Consumer', field: 'consumer' },
    { headerName: 'Bill No', field: 'billNo' },
    { headerName: 'Due Date', field: 'dueDate' },
    {
      headerName: 'Bill Amount',
      field: 'billAmount',
      cellRenderer: 'currencyRenderer',
    },
    {
      headerName: 'Amount Being Paid',
      field: 'amountBeingPaid',
      cellRenderer: 'currencyRenderer',
    },
    {
      headerName: 'Payment Date',
      field: 'paymentDate',
    },
  ];

  consumers: any[] = [];

  rowData: any[] = [];
  reviewRowData: any[] = [];

  selectedBillsForTotal: any[] = [];

  totalPayableAmount = 0;

  isReview: boolean = false;

  frameworkComponents = {
    amountBeingPaidRenderer: AmountBeingPaidRendererComponent,
    paymentDateRenderer: PaymentDateRendererComponent,
    dueDateRenderer: DueDateRendererComponent,
  };

  gridOptions = {
    rowModelType: 'clientSide',
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
  };

  constructor(
    private actionsService: ActionService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private menuService: MenuService,
    private breadcrumbService: BreadcrumbService,
    private unregisteredBillPaymentService: UnregisteredBillPaymentService,
  ) {}

  ngOnInit(): void {
    this.filters = this.unregisteredBillPaymentService.filters;

    if (this.filters.length === 0) {
      this.cancel();
      return;
    }

    const biller: any = {};

    this.filters.forEach((filter: any) => {
      biller[filter.name] = filter.value;
    });

    const actions: Actions = {
      heading: 'Bill Payment Details',
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
      { label: 'Unregistered Bill Payment' },
      { label: 'Bill Payment Details' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    const data = {
      dataMap: {
        billerName: biller.biller,
        product: biller.product,
        consumer: biller.consumerNo,
      },
    };

    this.httpService
      .httpPost(
        'payments/billPayments/billerRegistration/private/getBillerUnregisteredConsumer',
        data,
      )
      .subscribe((response: any) => {
        this.consumers = response.data;
        this.biller = response.billerData;
        this.prepareRowData();

        this.loading = false;
      });
  }

  prepareRowData() {
    const rowData: any[] = [];

    this.consumers.forEach((consumer: any) => {
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

  agGridRowSelect(childs: any[], selected: boolean) {
    this.selectingRows = true;

    const ids: string[] = [];

    childs.forEach((child) => {
      ids.push(child.id);
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
    this.showSubmit = false;
    this.isReview = false;
    // this.resetSelection();

    setTimeout(() => {
      this.selectedBillsForTotal.forEach((selectedBill: any) => {
        this.consumersGrid.selectRow(selectedBill, 'id');
      });
    }, 100);
  }

  payNow() {
    this.prepareReviewRowData();
    this.isReview = true;
  }

  clearAll() {
    this.unregisteredBillPaymentService.filters = [];
    this.cancel();
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  submit() {
    const formData = {
      billerType: 'unregistered',
      ...this.biller,
      ...this.paymentDetailsForm,
      channel: 'WEB',
      status: 'Paid',
      serviceType: '--',
      billNo: new Date().getTime(),
      consumerName: `Consumer ${new Date().getTime()}`,
      consumers: this.reviewRowData,
    };

    this.httpService
      .httpPost('payments/billPayments/payBill/private/create', formData)
      .subscribe((response: any) => {
        this.showSubmit = true;
      });
  }

  closeSubmit() {
    this.showSubmit = false;
    // this.cancel();
    this.router.navigateByUrl(this.menuService.getSelectedServiceUrl() + '/listing');
  }

  resetSelection() {
    this.selectedBillsForTotal = [];

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

    this.prepareRowData();

    this.consumersGrid.setRowData(this.rowData);
  }
}
