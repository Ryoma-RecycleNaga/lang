import { Component, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'pp-tools',
  shadow: true,
  styleUrl: 'tools.css',
})
export class Tools {
  @Element() host: HTMLDivElement;
  render() {
    return (
      <Host>
        <ul class="pp-tools-container">
          {Array.from(this.host.children)
            .map(child =>
              <li innerHTML={child.outerHTML}
              />
            )}
        </ul>
      </Host>
    );
  }

}
