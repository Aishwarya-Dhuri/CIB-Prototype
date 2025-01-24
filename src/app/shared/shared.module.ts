import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { OrderModule } from 'ngx-order-pipe';
import { MomentModule } from 'ngx-moment';
import { AccordionTreeComponent } from './@components/accordion-tree/accordion-tree.component';
import { AgGridListingComponent } from './@components/ag-grid-listing/ag-grid-listing.component';
import { DateRendererComponent } from './@components/ag-grid-listing/date-renderer/date-renderer.component';
import { CurrencyRendererComponent } from './@components/ag-grid-listing/currency-renderer/currency-renderer.component';
import { FavoriteRendererComponent } from './@components/ag-grid-listing/favorite-renderer/favorite-renderer.component';
import { GridActionRendererComponent } from './@components/ag-grid-listing/grid-action-renderer/grid-action-renderer.component';
import { ColumnConfigurationComponent } from './@components/ag-grid-listing/grid-listing-tools/column-configuration/column-configuration.component';
import { DownloadOptionsComponent } from './@components/ag-grid-listing/grid-listing-tools/download-options/download-options.component';
import { GridListingToolsComponent } from './@components/ag-grid-listing/grid-listing-tools/grid-listing-tools.component';
import { ListingMoreOptionsComponent } from './@components/ag-grid-listing/grid-listing-tools/listing-more-options/listing-more-options.component';
import { InvoiceStatusRendererComponent } from './@components/ag-grid-listing/invoice-status-renderer/invoice-status-renderer.component';
import { LinkRendererComponent } from './@components/ag-grid-listing/link-renderer/link-renderer.component';
import { RadioSelectRendererComponent } from './@components/ag-grid-listing/radio-select-renderer/radio-select-renderer.component';
import { ApsCalenderComponent } from './@components/aps-calender/aps-calender.component';
import { DateRangeSepratorPipe } from './@components/aps-calender/date-range-seprator-pipe';
import { ApsCheckboxComponent } from './@components/aps-checkbox/aps-checkbox.component';
import { ApsCustomSelectComponent } from './@components/aps-custom-select/aps-custom-select.component';
import { ApsRadiobuttonComponent } from './@components/aps-radiobutton/aps-radiobutton.component';
import { ApsSelectDropdownComponent } from './@components/aps-select-dropdown/aps-select-dropdown.component';
import { AttachmentModalComponent } from './@components/attachment-modal/attachment-modal.component';
import { BackdropComponent } from './@components/backdrop/backdrop.component';
import { BaseCurrencyComponent } from './@components/base-currency/base-currency.component';
import { CurrencySelectDropdownComponent } from './@components/currency-select-dropdown/currency-select-dropdown.component';
import { DraftListModalComponent } from './@components/draft-list-modal/draft-list-modal.component';
import { DynamicEnrichmentComponent } from './@components/dynamic-enrichment/dynamic-enrichment.component';
import { PrefillCriterialModalComponent } from './@components/dynamic-search/@components/prefill-criterial-modal/prefill-criterial-modal.component';
import { SaveCriterialModalComponent } from './@components/dynamic-search/@components/save-criterial-modal/save-criterial-modal.component';
import { DynamicSearchComponent } from './@components/dynamic-search/dynamic-search.component';
import { FormInputFieldComponent } from './@components/form-input-field/form-input-field.component';
import { ListingComponent } from './@components/generic-listing/components/listing/listing.component';
import { GenericListingComponent } from './@components/generic-listing/generic-listing.component';
import { HeaderWithSearchComponent } from './@components/header-with-search/header-with-search.component';
import { IconComponent } from './@components/icon/icon.component';
import { MakerCheckerDetailComponent } from './@components/maker-checker-detail/maker-checker-detail.component';
import { ModalComponent } from './@components/modal/modal.component';
import { NothingHereComponent } from './@components/nothing-here/nothing-here.component';
import { OrgTreeComponent } from './@components/org-tree/org-tree.component';
import { PieChartComponent } from './@components/pie-chart/pie-chart.component';
import { SearchModalComponent } from './@components/search-modal/search-modal.component';
import { StepperHeaderComponent } from './@components/stepper/@components/stepper-header/stepper-header.component';
import { StepperFooterComponent } from './@components/stepper/@components/stepper-footer/stepper-footer.component';
import { ToasterComponent } from './@components/toaster/toaster.component';
import { TreeStructureHierarchyComponent } from './@components/tree-structure-hierarchy/tree-structure-hierarchy.component';
import { TreeComponent } from './@components/tree/tree.component';
import { UploadFormControlComponent } from './@components/upload-form-control/upload-form-control.component';
import { AlphaNumericDirective } from './@directives/alpha-numeric.directive';
import { CurrencyFormatNotZeroDirective } from './@directives/currency-format-not-zero.directive';
import { NoSpaceDirective } from './@directives/no-space.directive';
import { NumberDirective } from './@directives/number.directive';
import { NumberToWordPipe } from './@pipes/number-to-word.pipe';
import { SafeHtmlPipe } from './@pipes/safe-html.pipe';
import { PrimeNgModule } from './primeng/primeng.module';
import { ApsTranslatePipe } from './@pipes/aps-translate.pipe';
import { PaginationComponent } from './@components/pagination/pagination.component';
import { SideSelectionPanelComponent } from './@components/side-selection-panel/side-selection-panel.component';
import { LimitBarComponent } from './@components/limit-bar/limit-bar.component';
import { InsightsComponent } from './@components/insights/insights.component';
import { SearchedByViewComponent } from './@components/searched-by-view/searched-by-view.component';
import { ChartComponent } from './@components/chart/chart.component';
import { HideDirective } from './@directives/hide.directive';
import { ReviewFormFieldComponent } from './@components/review-form-field/review-form-field.component';
import { TagToBlankSpacePipe } from './@pipes/tag-to-blank-space.pipe';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { LoadingSpinnerComponent } from './@components/loading-spinner/loading-spinner.component';
import { CardNumberDirective } from './@directives/card-number.directive';
import { RangeInputFieldComponent } from './@components/range-input-field/range-input-field.component';
import { DynamicFormComponent } from './@components/dynamic-form/dynamic-form.component';
import { DynamicCardComponent } from './@components/dynamic-form/@components/dynamic-card/dynamic-card.component';
import { DynamicFormGridComponent } from './@components/dynamic-form/@components/dynamic-form-grid/dynamic-form-grid.component';
import { DangerCurrencyRendererComponent } from './@components/ag-grid-listing/danger-currency-renderer/danger-currency-renderer.component';
import { SuccessCurrencyRendererComponent } from './@components/ag-grid-listing/success-currency-renderer/success-currency-renderer.component';
import { ApsAutocompleteComponent } from './@components/aps-autocomplete/aps-autocomplete.component';
import { RejectReasonRendererComponent } from './@components/ag-grid-listing/reject-reason-renderer/reject-reason-renderer.component';
import { AmountRendererComponent } from './@components/ag-grid-listing/amount-renderer/amount-renderer.component';
import { ApsGroupSelectComponent } from './@components/aps-group-select/aps-group-select.component';
import { SafeUrlPipe } from './@pipes/safe-url.pipe';
import { SwiftGpiDataflowComponent } from './@components/swift-gpi-dataflow/swift-gpi-dataflow.component';
import { MaskRendererComponent } from './@components/ag-grid-listing/mask-renderer/mask-renderer.component';
import { RaiseDisputeComponent } from './@components/raise-dispute/raise-dispute.component';

const Components = [
  BackdropComponent,
  AgGridListingComponent,
  GridActionRendererComponent,
  LimitBarComponent,
  CurrencyRendererComponent,
  AmountRendererComponent,
  DateRendererComponent,
  DangerCurrencyRendererComponent,
  SuccessCurrencyRendererComponent,
  InvoiceStatusRendererComponent,
  LinkRendererComponent,
  RejectReasonRendererComponent,
  FavoriteRendererComponent,
  GridListingToolsComponent,
  StepperHeaderComponent,
  StepperFooterComponent,
  HeaderWithSearchComponent,
  AccordionTreeComponent,
  TreeComponent,
  SideSelectionPanelComponent,
  SearchModalComponent,
  UploadFormControlComponent,
  TreeStructureHierarchyComponent,
  NothingHereComponent,
  ListingComponent,
  GenericListingComponent,
  DynamicSearchComponent,
  SaveCriterialModalComponent,
  PrefillCriterialModalComponent,
  FormInputFieldComponent,
  ApsSelectDropdownComponent,
  ApsGroupSelectComponent,
  ApsCustomSelectComponent,
  ApsCalenderComponent,
  DateRangeSepratorPipe,
  ModalComponent,
  OrgTreeComponent,
  ApsAutocompleteComponent,
  IconComponent,
  PieChartComponent,
  BaseCurrencyComponent,
  CurrencySelectDropdownComponent,
  DynamicEnrichmentComponent,
  MakerCheckerDetailComponent,
  DraftListModalComponent,
  ToasterComponent,
  InsightsComponent,
  AttachmentModalComponent,
  SearchedByViewComponent,
  ChartComponent,
  PaginationComponent,
  ReviewFormFieldComponent,
  LoadingSpinnerComponent,
  RangeInputFieldComponent,
  DynamicFormComponent,
  DynamicCardComponent,
  DynamicFormGridComponent,
  SwiftGpiDataflowComponent,
  MaskRendererComponent,
];

const directives = [
  NumberDirective,
  AlphaNumericDirective,
  NoSpaceDirective,
  CurrencyFormatNotZeroDirective,
  CardNumberDirective,
  HideDirective,
];

const pipes = [SafeHtmlPipe, SafeUrlPipe, NumberToWordPipe, ApsTranslatePipe, TagToBlankSpacePipe];

const modules = [
  FormsModule,
  MomentModule,
  DynamicModule,
  ReactiveFormsModule,
  PrimeNgModule,
  OrderModule,
  TranslateModule,
  AgChartsAngularModule,
  GridsterModule,
];

const providers = [DecimalPipe, TranslatePipe, ApsTranslatePipe];

@NgModule({
  declarations: [
    ...Components,
    ...directives,
    ...pipes,
    ColumnConfigurationComponent,
    DownloadOptionsComponent,
    ApsRadiobuttonComponent,

    ApsCheckboxComponent,
    ListingMoreOptionsComponent,
    RadioSelectRendererComponent,
    RaiseDisputeComponent,
  ],
  imports: [CommonModule, AgGridModule, ...modules],
  providers: [...providers],
  exports: [...Components, ...directives, ...pipes, ...modules],
})
export class SharedModule {}
