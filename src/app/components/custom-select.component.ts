import {Component, forwardRef, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {MatMenuTrigger} from '@angular/material';
import {IconInjectorService} from '../services/icon-injector.service';
import {SelectMenuItem} from '../types/selectMenuItem';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.template.html',
  styleUrls: ['./custom-select.style.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomSelectComponent),
    multi: true
  }]
})

export class CustomSelectComponent implements ControlValueAccessor, OnChanges {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Input() label: string;
  @Input() multiselect: boolean;
  @Input() options: Array<SelectMenuItem>;

  @Input() selected: SelectMenuItem | Array<any>;
  @Input() classes: string;

  @Output() onChange: any;
  @Output() onTouched: any;

  isDisabled: boolean;
  readonly nothingSelected = 'Ничего не выбрано';

  constructor(private iconInjectorService: IconInjectorService) {
    iconInjectorService.injectIcon('arrow-xs');
  }

  ngOnChanges(changes) {
    if (changes && changes.options) {
      const asArray = changes.options.currentValue as Array<any>;
      if (!asArray || (asArray && asArray.length === 0)) {
        this.setValue(null);
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
        if (changes.options.currentValue !== changes.options.previousValue) {
          this.setValue(null);
        }
      }
    } else {
      this.isDisabled = true;
      this.setValue(null);
    }
  }

  writeValue(value) {
    if (this.isDisabled) {
      return;
    }
    if (this.multiselect) {
      if (Array.isArray(value)) {
        this.selected = value;
      } else if (value) {
        this.selected = [value];
      }
    } else {
      this.selected = value;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  private setValue(value) {
    this.writeValue(value);
    if (this.onChange) {
      this.onChange(value);
    }
  }

  selectItem(event, item: SelectMenuItem) {
    if (this.multiselect) {
      this.selectMulti(event, item);
    } else {
      this.selectSingle(item);
    }
    this.setValue(this.selected);
  }

  private selectSingle(item) {
    this.selected = item;
  }

  private selectMulti(event, item: SelectMenuItem) {
    if (Array.isArray(this.selected)) {
      const selectedArray = this.selected as Array<any>;
      const index = selectedArray.indexOf(item);
      if (index > -1) {
        selectedArray.splice(index, 1);
      } else {
        selectedArray.push(item);
      }
    } else {
      this.selected = Array<SelectMenuItem>(item);
    }
    event.stopPropagation();
  }

  isSelected(item) {
    if (this.multiselect && this.selected) {
      return (this.selected as Array<any>).indexOf(item) > -1;
    } else {
      return this.selected === item;
    }
  }

  getSelected() {
    if (this.multiselect) {
      if (this.selected && this.selected[0]) {
        const asArray = (this.selected as Array<any>);
        if (asArray.length > 1) {
          let result = '';
          asArray.map((item, i) => {
            i !== asArray.length - 1 ? result += item.title + ', ' : result += item.title;
          });
          return result;
        }
        return this.selected[0].title;
      } else {
        return this.nothingSelected;
      }
    } else {
      if (this.selected) {
        return this.selected['title'];
      } else {
        return this.nothingSelected;
      }
    }
  }
}
