import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountStructureService {
  structureCreationType: string = 'create';

  accountStructureHierarchy = [
    {
      label: 'IND-HDFC-001186941212-MYR',
      styleClass: 'node-content',
      expanded: true,
      children: [
        {
          label: 'IND-HDFC-001186941212-MYR',
          styleClass: 'node-content',
          expanded: true,
          children: [
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              type: 'leaf',
            },
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              type: 'leaf',
            },
          ],
        },
        {
          label: 'IND-HDFC-001186941212-MYR',
          styleClass: 'node-content',
          expanded: true,

          children: [
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              expanded: true,

              children: [
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',

                  type: 'leaf',
                },
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',
                  type: 'leaf',
                },
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',
                  type: 'leaf',
                },
              ],
            },
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              type: 'leaf',
            },
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              type: 'leaf',
            },
          ],
        },
        {
          label: 'IND-HDFC-001186941212-MYR',
          styleClass: 'node-content',
          expanded: true,

          children: [
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              type: 'leaf',
            },
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              expanded: true,

              children: [
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',
                  type: 'leaf',
                },
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',
                  type: 'leaf',
                },
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',
                  type: 'leaf',
                },
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',
                  type: 'leaf',
                },
              ],
            },
          ],
        },
        {
          label: 'IND-HDFC-001186941212-MYR',
          styleClass: 'node-content',
          expanded: true,

          children: [
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              type: 'leaf',
            },
            {
              label: 'IND-HDFC-001186941212-MYR',
              styleClass: 'node-content',
              expanded: true,

              children: [
                {
                  label: 'IND-HDFC-001186941212-MYR',
                  styleClass: 'node-content',

                  type: 'leaf',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  constructor() {}
}
