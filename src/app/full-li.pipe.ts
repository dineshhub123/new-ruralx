import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullLi'
})
export class FullLiPipe implements PipeTransform {

 transform(html: string): string {
  if (!html) return '';

  const div = document.createElement('div');
 // 👈 Add your custom class here
  div.innerHTML = html;

  // Function to recursively clean &nbsp; (non-breaking space) chars in text nodes
  function cleanNbsp(node: Node) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent = child.textContent?.replace(/\u00A0/g, ' ') || '';
      } else {
        cleanNbsp(child);
      }
    });
  }

  cleanNbsp(div);

  // Replace <li> with their text + newline
  const lis = div.querySelectorAll('li');
  lis.forEach(li => {
    const text = li.textContent || '';
    const textNode = document.createTextNode(text + '\n');
    li.parentNode?.replaceChild(textNode, li);
  });

  // Remove <ul> but keep inner content
  const uls = div.querySelectorAll('ul');
  uls.forEach(ul => {
    while (ul.firstChild) {
      ul.parentNode?.insertBefore(ul.firstChild, ul);
    }
    ul.remove();
  });

  return div.innerHTML;
}


}
