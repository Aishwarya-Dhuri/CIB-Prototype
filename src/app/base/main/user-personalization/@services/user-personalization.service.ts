import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserPersonalizationService {
  tabDetails = [
    {
      name: 'userInfo',
      displayName: 'User Information',
      icon: 'fa-user',
      isActive: true,
      isHover: false,
      dataObjs: [
        'userDetails',
        'addressDetails',
        'loginRestrictionDetails',
        'securityCriteriaDetails',
      ],
      subTabs: [
        {
          name: 'User Details',
          isEdit: false,
          isExpand: true,
          templateName: 'userDetails',
        },
        {
          name: 'Address Details',
          isEdit: false,
          isExpand: false,
          templateName: 'addressDetails',
        },
        {
          name: 'Login Restriction Details',
          isEdit: false,
          isExpand: false,
          templateName: 'loginRestrictionDetails',
        },
        {
          name: 'Security Criteria Details',
          isEdit: false,
          isExpand: false,
          templateName: 'securityCriteriaDetails',
        },
      ],
    },
    {
      name: 'corporateInfo',
      displayName: 'Corporate Information',
      icon: 'fa-users',
      isActive: false,
      isHover: false,
      dataObjs: ['corporateMainDetails', 'officeDetails'],
      subTabs: [
        {
          name: 'Corporate Main Details',
          isEdit: false,
          isExpand: false,
          templateName: 'corporateMainDetails',
        },
        {
          name: 'Office Details',
          isEdit: false,
          isExpand: false,
          templateName: 'officeDetails',
        },
      ],
    },
    {
      name: 'security',
      displayName: 'Security',
      icon: 'fa-user-shield',
      isActive: false,
      isHover: false,
      dataObjs: ['antiPhishingDetails', 'securityQuestionsDetails'],
      subTabs: [
        {
          name: 'Anti Phishing Details',
          isEdit: false,
          isExpand: false,
          templateName: 'antiPhishingDetails',
        },
        {
          name: 'Security Questions Details',
          isEdit: false,
          isExpand: false,
          templateName: 'securityQuestionsDetails',
        },
      ],
    },
    {
      name: 'personalisation',
      displayName: 'Personalisation',
      icon: 'fa-sliders-v',
      isActive: false,
      isHover: false,
      dataObjs: [
        'defaultLanguageDetails',
        'loginPreferenceDetails',
        'widgetMappingDetails',
        'themeSelectionDetails',
      ],
      subTabs: [
        {
          name: 'Default Language Details',
          isEdit: false,
          isExpand: false,
          templateName: 'defaultLanguageDetails',
        },
        {
          name: 'Login Preference Details',
          isEdit: false,
          isExpand: false,
          templateName: 'loginPreferenceDetails',
        },
        {
          name: 'Widget Mapping Details',
          isEdit: false,
          isExpand: false,
          templateName: 'widgetMappingDetails',
        },
        {
          name: 'Theme Selection Details',
          isEdit: false,
          isExpand: false,
          templateName: 'themeSelectionDetails',
        },
      ],
    },
    {
      name: 'alertsAndNotifications',
      displayName: 'Alerts and Notifications',
      icon: 'fa-bell',
      isActive: false,
      isHover: false,
      dataObjs: ['alertsAndNotificationsDetails'],
      subTabs: [
        {
          name: 'Alerts And Notifications Details',
          isEdit: false,
          isExpand: false,
          templateName: 'alertsAndNotificationsDetails',
        },
      ],
    },
    {
      name: 'makerCheckerLimits',
      displayName: 'Maker/Checker Limits',
      icon: 'fa-user-check',
      isActive: false,
      isHover: false,
      dataObjs: ['makerCheckerLimitDetails'],
      subTabs: [
        {
          name: 'Maker Checker Limit Details',
          isEdit: false,
          isExpand: false,
          templateName: 'makerCheckerLimitDetails',
        },
      ],
    },
    {
      name: 'authMatrixInfo',
      displayName: 'Authorisation Matrix Information',
      icon: 'fa-user-tie',
      isActive: false,
      isHover: false,
      dataObjs: ['authMatrixInfoDetails'],
      subTabs: [
        {
          name: 'Auth Matrix Info Details',
          isEdit: false,
          isExpand: false,
          templateName: 'authMatrixInfoDetails',
        },
      ],
    },
    {
      name: 'accountWiseAccessInfo',
      displayName: 'Account Wise Access Information',
      icon: 'fa-university',
      isActive: false,
      isHover: false,
      dataObjs: ['accountWiseAccessInfoDetails'],
      subTabs: [
        {
          name: 'Account Wise Access Info Details',
          isEdit: false,
          isExpand: false,
          templateName: 'accountWiseAccessInfoDetails',
        },
      ],
    },
  ];
}
