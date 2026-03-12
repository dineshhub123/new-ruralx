import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PincodeService {

   private serviceablePins: number[] = [
    481001, // Balaghat
    481331, // Waraseoni
    481441, // Lalburra
    481222, // Lanji
    481337, // Khairlanji
    481556, // Paraswada
    481445, // Katangi
    481115  // Kirnapur
  ];

  constructor() { }

  isServiceable(pin: number): boolean {
    return this.serviceablePins.includes(pin);
  }


}
