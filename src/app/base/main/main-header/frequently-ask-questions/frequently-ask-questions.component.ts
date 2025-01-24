import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frequently-ask-questions',
  templateUrl: './frequently-ask-questions.component.html',
  styleUrls: ['./frequently-ask-questions.component.scss']
})
export class FrequentlyAskQuestionsComponent implements OnInit {
  loading: boolean = false;
  faqs: any[] = [
    {
      heading: 'What is AuroDigi?',
      isExpand: false,
      type: 'text',
      description:
        'AuroDigi is an advanced online cash management system which assists companies in initiating online payments, reconciling collections and managing their liquidity',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'How do I apply for AuroDigi?',
      isExpand: false,
      type: 'text',
      description:
        'Companies already existing on ADCB Active will be automatically transferred to AuroDigi by the Bank. New companies can apply for AuroDigi by contacting aurodigi.implementation@adcb.com.',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'What features are available in AuroDigi?',
      isExpand: false,
      type: 'list',
      description: null,
      list: [
        {
          data: 'Single Sign-On access to Cash Management Service & Trade Finance',
          subList: null,
        },
        {
          data: 'Multi-Bank Account Reporting made available as part of the Account Summary Screen with provision for Loan Account Reporting, both conventional and Islamic Banking products',
          subList: null,
        },
        {
          data: 'Corporate Admin Module, allowing clients to create user access rights at their end, but limited account reporting and payment preparation',
          subList: null,
        },
        {
          data: 'Corporate Cheque Printing functionality at bank or at customers end, with the option of printing cheque signatures',
          subList: null,
        },
        {
          data: 'Initiation of Wages Protection System (WPS) via Corporate IB portal',
          subList: null,
        },
        {
          data: 'Enhanced Bulk Payment Functionalities:',
          subList: [
            'File format flexibility',
            'Authorisation levels (i.e., currency, batch, file-level wise)',
            'Handle future-dated payments',
          ],
        },
      ],
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'What do I need to access AuroDigi?',
      isExpand: false,
      type: 'text',
      description:
        'To access AuroDigi you need to have User ID and a Security Token',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading:
        'What are the minimum software security requirements to access AuroDigi?',
      isExpand: false,
      type: 'list',
      description: null,
      list: [
        {
          data: 'Updated functioning antivirus and firewall installed.',
          subList: null,
        },
        {
          data: 'Operating system is running with latest security patches.',
          subList: null,
        },
        {
          data: 'Web browser is updated to the most recent version.',
          subList: null,
        },
      ],
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'What are Host-Host Payments?',
      isExpand: false,
      type: 'text-list',
      description:
        'Host to Host payment system provides ADCB corporate customers ability to route payment files through a secured SFTP channel which includes,',
      list: [
        {
          data: 'DES (Data Exchange Server) - secured SFTP channel without manual intervention.',
          subList: null,
        },
        {
          data: 'SSL VPN (Secure Sockets Layer virtual private network) - client will have to upload a file manual.',
          subList: null,
        },
      ],
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'How do I manage multi-bank relationship in AuroDigi?',
      isExpand: false,
      type: 'text',
      description:
        'System offers flexibility of managing accounts held with other banks through AuroDigi. Clients can see their balances on this account and also initiate transaction through this accounts. For additional details and setup contact ADCB Cash Management Sales manager.',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'How can I manage to print my corporate cheques?',
      isExpand: false,
      type: 'text',
      description:
        'Client needs to upload file containing the details of the corporate cheques and the Bank will print the cheques on the behalf of the customer as per the details submitted.',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading:
        'How can I view account balances of other bank accounts in AuroDigi?',
      isExpand: false,
      type: 'text',
      description:
        'Multi-Bank Account Reporting made available as part of the Account Summary Screen with provision for Loan Account Reporting, both conventional and Islamic Banking products',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'How can I initiate single payment?',
      isExpand: false,
      type: 'text',
      description:
        'The client has the option of adding beneficiary details and saving the same on AuroDigi. The saved beneficiary details can be used when initiating a single payment request or the client has the option of entering adhoc beneficiary details while initiating a single payment.',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'How can I initiate a bulk payment in AuroDigi?',
      isExpand: false,
      type: 'text',
      description:
        'Similar to the single payment request, the client has the option of adding beneficiary details and saving the same on AuroDigi. The saved beneficiary details can be used when initiating a bulk payment request or the client has the option of entering adhoc beneficiary details while creating the bulk payment file.',
      list: null,
      colHeading: null,
      rowData: null,
    },
    {
      heading: 'What currency payments are supported by AuroDigi?',
      isExpand: false,
      type: 'table',
      description:
        'Companies already existing on ADCB Active will be automatically transferred to AuroDigi by the Bank. New companies can apply for AuroDigi by contacting aurodigi.implementation@adcb.com.',
      list: null,
      colHeading: ['Sr No', 'Payment Method', 'Allow Payable Currency'],
      rowData: [
        [
          '1',
          'IFT Internal FundTransfer',
          'AED,AUD,CAD,CHF,CZK,DKK,EUR,GBP,HKD,INR,JOD,LKR,MAD,NOK,NZD,PKR,QAR,SAR,SEK,SGD,TND,USD,ZAR,JPY,BHD,KWD,OMR,SAN,CNH',
        ],
        ['2', 'EFD UAEFTS PAyments', 'CNH,AED,JPY,BHD,KWD,OMR,SAN'],
        [
          '3',
          'EFI - Swift Payments',
          'CNH,AUD,CAD,CHF,CZK,DKK,EUR,GBP,HKD,INR,JOD,LKR,MAD,NOK,NZD,PKR,QAR,SAR,SEK,SGD,TND,USD,ZAR,JPY,BHD,KWD,OMR,SAN,AED,CNH',
        ],
        [
          '4',
          'CST Corporate Salary Transfers',
          'All currencies covered under IFT, EFD, EFI payment methods.',
        ],
        ['5', 'BCK Bankers Cheque', 'AED,JPY,BHD,KWD,OMR,SAN'],
        ['6', 'DWP Dividend warrants', 'AED,JPY,BHD,KWD,OMR,SAN'],
        [
          '7',
          'DDT Demand Drafts',
          'AUD,CAD,CHF,CZK,DKK,EUR,GBP,HKD,INR,JOD,LKR,MAD,NOK,NZD,PKR,QAR,SAR,SEK,SGD,TND,USD,JPY,BHD,KWD,OMR,SAN',
        ],
        ['8', 'CCK Corporate Cheques', 'AED,JPY,BHD,KWD,OMR,SAN'],
        ['9', 'OCK Own Cheques', 'AED,JPY,BHD,KWD,OMR,SAN'],
        ['10', 'WPS Wages Protection System', 'AED,JPY,BHD'],
        [
          '11',
          'MT101',
          'All currencies covered under IFT, EFD, EFI payment methods.',
        ],
        ['12', 'Bill Payments (Etisalat, DEWA, SEWA etc.)', 'AED'],
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }


  cardClick(creditCard) {
    this.faqs.map((a) => {
      a === creditCard ? (creditCard.isOpen = !creditCard.isOpen) : (a.isOpen = false);
    });
  }

}
