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

## explorer

### templates

1. dir listing
2. project
3. product
4. people
5. team
6. component
7. howto - mini
8. howto - fancy

## conversions

- academy 2 local MD
- local MD to github.io
- v3 forum to local MD
- local MD to v4 forum
- onearmy to local MD
- BOM to pretty local MD
- local MD to reddit
- local MD to plain

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

### OEM

- implement service or at least non PH factory

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
