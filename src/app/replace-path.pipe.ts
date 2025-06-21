import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replacePath'
})
export class ReplacePathPipe implements PipeTransform {
  transform(value: string, search: string, replace: string): string {
    return value.replace(search, replace);
  }

}
