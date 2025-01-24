import { Pipe, PipeTransform } from '@angular/core';

import * as converter from 'number-to-words';

@Pipe({
  name: 'numberToWord',
})
export class NumberToWordPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    const values: any = value.toString().split('.');

    const integerPart = converter.toWords(values[0]).replace(',', '').replace('-', ' ');

    const floatingPointPart =
      values[1] && !isNaN(parseInt(values[1]))
        ? converter.toWords(parseInt(values[1])).replace(',', '').replace('-', ' ')
        : '';

    const word1 = [...integerPart.split(' ')]
      .map((word: string, i: number) => {
        return [...word]
          .map((char: string, j: number) => {
            if (j == 0) {
              return char.toUpperCase();
            }
            return char;
          })
          .join('');
      })
      .join(' ');

    const word2 = [...floatingPointPart.split(' ')]
      .map((word: string, i: number) => {
        return [...word]
          .map((char: string, j: number) => {
            if (j == 0) {
              return char.toUpperCase();
            }
            return char;
          })
          .join('');
      })
      .join(' ');

    return word1 + (word2 ? ' and ' + word2 : '');
  }
}
