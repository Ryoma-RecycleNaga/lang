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
      <p />
<p><strong>Parent</strong> : my parent 2</p>
<p><strong>Name</strong> : Front Shield | <a href="/?,">Edit</a></p>
<p><strong>Version</strong> : 1 | 1 2</p>
<p><strong>ID</strong> : Z_4_FRONT_SHIELD | <a href="&lt;%PART_INVENTORY%">Inventory</a></p>
<p><strong>Drawing</strong> : <a href="https://a360.co/37pDdVD">Fusion360 public link</a></p>
<p><strong>Preview</strong></p>
<p><img width="20%" src="" /></p>
<hr />
<p><strong>Comaptible with</strong> : </p>
<p><strong>Capabilities</strong> : </p>
<hr />
<p><strong>Assembly</strong> : <a href="">Fusion360 public link</a></p>
<p><strong>Tools</strong></p>
<p>
  <pp-tools>
    <div>tools - data </div>
  </pp-tools>
</p>
<p><strong>Templates / Gauges</strong></p>
<p>
  <pp-templates />
</p>
<p>
  <pp-templates />
</p>
<p><strong>Stock</strong></p>
<p>
  <pp-stock />
</p>
<p />
<p><strong>Machines</strong></p>
<p>
  <pp-machines />
</p>
<p />
<hr />
<p><strong>Steps</strong> :</p>
<p>
  <pp-steps />
</p>
<p />
<p />
      </Host>
    );
  }
}
