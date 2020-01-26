# Command 'bazar-product-html'

This command will compose HTML to be used in the Precious-Plastic Bazar. 

### How does this work ? 

It loads templates or 'fragments' from various locations.
The templates can be HTML or Markdown. In particular it loads
templates from 2 different locations:

- products/bazar/fragments (global templates & content)
- products/myproduct/bazar/fragments (product related templates & content)

It will also load variables from 2 different locations which then can be used inside the templates :

- products/myproduct/config.json (product specific variables like name)
- products/bazar/config.json (vendor specific variables like email, website,...)


Once this templates are loaded, it replaces variable place holders with the content found by the same name. The variable can be a file or a variable value in the config.json files.

To generate the HTML for your product, there is a root template in [products/bazar/fragments/product.html]() :

```html
${breadcrumb} -> <span>${product_name}</span>

<hr/>

${header}
${body}
<hr/>
${others}
<hr/>
${vendor_links}
<hr/>
${footer}
```

As you can see, there are lot of variables, for instance we 
reference a variable ***breadcrumb***, written as follows :

```html
 ${breadcrumb}
```

This tool now looks for a file *breadcrumb.html|md* in the global and product template folders and replaces ${breadcrumb} with the content of this file whereby Markdown will be converted to HTML.

When this file doesn't exists, it tries the global or product config.json files.


