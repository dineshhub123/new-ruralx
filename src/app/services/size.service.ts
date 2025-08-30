import { Injectable } from '@angular/core';
import { SIZE_MASTER } from '../constants/size-master'

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  getSizes(category: string, subCategory?: string): string[] {
    category = category.toLowerCase();

    if (SIZE_MASTER[category]) {
      if (subCategory && SIZE_MASTER[category][subCategory]) {
        return SIZE_MASTER[category][subCategory];
      }
      // if subCategory not given, merge all sizes in category
      const allSizes = Object.values(SIZE_MASTER[category]).flat() as string[];
      return allSizes;
    }

    return []; // default no sizes
  }

  constructor() { }
}
