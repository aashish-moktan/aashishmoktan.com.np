import {markdownLib} from '../plugins/markdown.js';

export const aside = children => {
  if (!children) {
    throw new Error('You must provide a non-empty string for an aside.');
  }
  const content = markdownLib.renderInline(children);
  return `<aside class="note">${content}</aside>`;
};
