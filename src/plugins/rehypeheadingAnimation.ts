import { visit } from 'unist-util-visit';

export default function rehypeHeadingAnimation() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (['h1', 'h2', 'h3', 'h4'].includes(node.tagName)) {
        node.properties = node.properties || {};
        node.properties['scroll-animation'] = 'slide-inline-start';
      }

      if (['img', 'iframe', 'pre', 'blockquote'].includes(node.tagName)) {
        node.properties = node.properties || {};
        node.properties['scroll-animation'] = 'scale';
      }
    });
  };
}
