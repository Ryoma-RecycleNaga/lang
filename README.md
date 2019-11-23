# lang
PP Cross language, utilized in academy, one-army, help-desk &amp; factory

## tech

obseleted by *Monarch* : uses [Jison](http://zaa.ch/jison/docs/#specifying-a-language) - based on Bison.

## Editor remarks

- the backend is wired via [VSCode language protocol](https://code.visualstudio.com/blogs/2016/06/27/common-language-protocol). See [specs](https://github.com/Microsoft/language-server-protocol).

- the editor itself will be based on [Monaco, VSCode's editor](https://microsoft.github.io/monaco-editor/monarch.html) and will be extended via autocomplete protocols
and visuals aids.

- the language also needs a VSCode extension based on markdown, enabling previews.

##  Model remarks

- [custom elements, aka *web components*](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) will be accessed via [markdown-it](https://github.com/markdown-it/markdown-it) and rendered as ordinary 'custom-elements' (shadow-dom), see [@ibm/delite](https://github.com/ibm-js/delite)

