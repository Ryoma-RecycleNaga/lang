import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'content-page',
  styleUrl: 'page.css',
  shadow: true
})
export class Page {
  render() {
    return (
      <Host>
        inside:
        <pp-tools val="ppvalval">pp-toolsss</pp-tools>
      </Host>
    );
  }
}
