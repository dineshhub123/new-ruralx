import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLi'
})
export class FirstLiPipe implements PipeTransform {

 transform(html: string): string {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const firstLi = div.querySelector('li');
  if (!firstLi) return '';

  // Get the text content and replace non-breaking spaces with normal spaces
  const text = (firstLi.textContent || '').replace(/\u00A0/g, ' ').trim();

  // Split the text into words
  const words = text.split(/\s+/);

  // Take the first 3 words
  const firstThreeWords = words.slice(0, 2).join(' ');

  // Append "..." only if there are more than 3 words
  return words.length > 1 ? `${firstThreeWords}...` : firstThreeWords;
}

}
