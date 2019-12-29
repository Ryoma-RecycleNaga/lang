import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'content-page',
  styleUrl: 'page.css',
  shadow: true
})
export class Page {

  render() {
    let PART_PARENT= 0;
    return (
      <Host>
      <p><strong>Parent</strong> : {PART_PARENT}</p>
      <p><strong>Name</strong> : ((PARTNAME)) </p>
      <p><strong>Version</strong> : </p>
      </Host >
    );
  }

}
