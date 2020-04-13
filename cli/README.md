# Precious Plastic Command Line Tools

## Requirments

- Please install [NodeJS](https://nodejs.org/en/download/)

## Optional requirements

- [GhostScript](https://www.ghostscript.com/download/gsdnld.html) (needed for converting PDF to JPG)
- [Imagick](https://imagemagick.org/script/download.php) (needed for resizing images)
- [PP Open Factory](https://github.com/plastic-hub/factory) (needed for templates)
- [Your product folder](https://github.com/plastic-hub/products) (needed to generate documentation and creating Bazar descriptions)

<hr/>

## Commands

- [bazar-vendor-html](./docs/commands/bazar)
- [bazar-product-html](./docs/commands/bazar)
- [markdown](./docs/commands/markdown)
- [pdf2jpg](./docs/commands/pdf2jpg)

## Todos

## conversions

- academy 2 local MD
- local MD to github.io
- local MD to forum
- v3 forum to local MD
- local MD to v4 forum
- onearmy to local MD
- BOM to pretty local MD

### bazar commands

- factory needs to provide component pages (sub assemblies)
- electric stuff needs a standard protocol in place, show certification and sourcing
- custom pp-search links for tutorials, how-tos
- collect machine issues (pros / cons)
- link common academy/how-to material

### Infrastructure

- cs-cart docker image for previews via API
- github issue collector
- onarmy crawler (->manuals,..)
- video converter & publisher for assembly animations (mark snapshots for manuals)

### Discord

- scraper  
- chat to local MD

### NPM Commands

*watch*     : ```yarn dev```

*help*      : ```npm run help``` //see all commands

*summary*   : ```yarn summary``` //run example command, uses google.co.uk as test URL

## Usage

### See available command
    ./build/main.js --help

### See specific command parameters
    ./build/main.js summary --help
