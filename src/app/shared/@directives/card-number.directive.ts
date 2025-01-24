import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cardNumber]',
})
export class CardNumberDirective {
  constructor(private el: ElementRef) {}

  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete',
  ];

  private regex: RegExp = new RegExp(/^([0-9]{1,15})?$/g);

  @HostListener('blur', ['$event']) onBlur(event: any) {
    let initialValue = this.el.nativeElement.value;

    if (!initialValue) {
      initialValue = '';
    }

    const newValue: any[] = [];

    [...initialValue.toString()].forEach((val: string, i: number) => {
      newValue.push(val);
      if ((i + 1) % 4 == 0) {
        newValue.push(' ');
      }
    });

    this.el.nativeElement.value = newValue.join('');
  }

  @HostListener('focus', ['$event']) onFocus(event: any) {
    const initVal = this.el.nativeElement.value.replace(/ /g, '');
    this.el.nativeElement.value = initVal;
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this.el.nativeElement.value;

    this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');

    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;

    const next: string = [current.slice(0, position), current.slice(position)].join('');

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
