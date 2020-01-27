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

### bazar commands

- factory needs to provide component pages (sub assemblies)
- sub assemblies should show certification | warrenty notes
- sub assemblies should output drawings & renderings (for dimensions)
- electric stuff needs a standard protocol in place, show certification and sourcing
- custom pp-search links for tutorials, how-tos
- translate all create language pages
- wrap links in colored containers (bazar bug)
- collect machine issues (pros / cons)
- link common academy/how-to material
- resize pictures in {my_product/media} (bazar wont) -> see common naming (@2x,...)
- add related machines
- add related projects
- add reviews


### NPM Commands

*watch*     : ```yarn dev```

*help*      : ```npm run help``` //see all commands

*summary*   : ```yarn summary``` //run example command, uses google.co.uk as test URL

## Usage

### See available command
    ./build/main.js --help

### See specific command parameters
    ./build/main.js summary --help
