import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'longName'})
export class LongNamePipe implements PipeTransform {
  transform(value, args: Array<string>, lookupProperty) {
      let result = '';
      args.map((item, index) => {
        if (value[item] && value[item][lookupProperty]) {
          result += (index === 0 ? '' : ' ' ) + value[item][lookupProperty];
        }
      });
      return result;
  }
}
