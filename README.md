<div align="center">
  <div>
    <img width="500" src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1532274184/Dimer_Readme_Banner_lyy7wv.svg" alt="Dimer App">
  </div>
  <br>
  <p>
    <a href="https://dimerapp.com/what-is-dimer">
      Dimer is an open source project and CMS to help you publish your documentation online.
    </a>
  </p>
  <br>
  <p>
    <sub>We believe every project/product is incomplete without documentation. <br /> We want to help you publish user facing documentation, without worrying <code>about tools or code</code> to write.</sub>
  </p>
  <br>
</div>

# Dimer
> Dimer command line to write and publish docs with style.

[![oclif-image]][oclif-url]
[![travis-image]][travis-url]
[![appveyor-image]][appveyor-url]
[![npm-image]][npm-url]
![](https://img.shields.io/badge/Uses-Typescript-294E80.svg?style=flat-square&colorA=ddd)

Here we discuss technical aspects of Dimer along with `Why it was created`. We recommend reading the official docs to get started with Dimer.

### 💁 [Official docs ➞](https://guides.dimerapp.org)

## Why Dimer was created?
There are a handful of **static site generators** ranging from Jekyll to VuePress. They all work well in what they do but are too generic and flexible in what they output. On the other hand, Dimer is very strict with its use cases (you can only create documentation websites with it).

In brief, I wanted a tool, which needs almost zero configuration and outputs a website tailored for technical documentation. It must have:

1. Inbuilt search.
2. Option to create multiple versions of docs.
3. Easy to build/integrate custom website design (since I want my sites to have their own identity).

## Do you think React or Vue would have become as powerful as they are, without the existence of REST API or JSON?

One of the best things happened to web/app development was the introduction of JSON. By separating **backend** and **frontend**, we can focus on one thing at a time and create these modern looking web apps.

Dimer takes the same approach and acts as a JSON API server for your Docs. When you run `dimer serve,` it compiles your markdown files and serves them as an API over HTTP.

You can consume this API to create:

1. Documentation websites.
2. Or a book (as PDF).

## Features
All of the following features are supported out of the box by Dimer and requires minimal or no configuration.

1.[Language agnostic CLI](#language-agnostic-cli). You can use dimer on any major operating system, without installing any specific programming language.
2. Inbuilt search built on top of [lunrjs](https://lunrjs.com/).
3. Support for multiple [versions of documentation](#multiple-versions-of-documentation).
4. [Image detection](#image-detection).
5. [Extended markdown](#extended-markdown).
6. 100% [JAM stack](https://jamstack.org/).

Here's a zoomed out view of Dimer

![](https://res.cloudinary.com/adonisjs/image/upload/v1533132137/dimer-zoomed-out-view_jdarwr.svg)

## Language agnostic CLI

It doesn't matter, whether you are Rubyist or write code in Php or Python. Dimer works with no additional dependencies on **Windows**, **Mac** and **Linux**.

## Multiple versions of documentation

Projects that supports older versions like [Ember](https://www.emberjs.com/), [AdonisJs](https://adonisjs.com) or [Laravel](http://laravel.com/) do need documentation for these versions.

Dimer supports multiple versions as a first-class citizen. You can define a directory for each version of docs inside the `config.`

## Image detection

When writing documentation, you can reference images from anywhere on your computer. Dimer will detect them inside your markdown and will store them to be served by the API server. It is how it works under the hood.

1. Dimer detects the image reference in Markdown.
2. If the reference is not an absolute HTTP URL, then it will be processed.
3. When processing the file, a thumbnail will be generated for progressive image loading.
4. Files are saved inside `dist/__assets` directory.
5. Image references are updated inside the generated JSON files.

## Extended Markdown

Markdown is an excellent language for writing docs. Its simplicity comes the tremendous speed at which you can write. However, the kind of elements markdown can create limited. 

Dimer enhances markdown with the help of **macros** to add new vocabulary to markdown. For example:

```md
[note]
This is a note
[/note]
```

```md
[tip]
This is a tip
[/tip]
```


```md
[youtube url="https://youtu.be/dWO9uP_VJV8"]
```

```md
[codepen url="https://codepen.io/eduardosada/pen/MbNZLX"]
```

Here's the complete [syntax guide](https://dimerapp.com/syntax-guide)

## Packages
The following are the first party packages used to build dimer.

| Package | Purpose |
|----------|----------|
| [@dimerapp/markdown](https://github.com/dimerapp/markdown)  | Compiles markdown to JSON or HTML |
| [@dimerapp/dfile](https://github.com/dimerapp/dfile) | File sandbox to compile it down to JSON and also report errors (if any).|
| [@dimerapp/datastore](https://github.com/dimerapp/datastore)   | Creates the JSON files to act as a database |
| [@dimerapp/fs-client](https://github.com/dimerapp/fs-client)  | Compiles a tree of documents for all the versions defined inside the config file. Comes with an opinionated watcher too.|
| [@dimerapp/context](https://github.com/dimerapp/context) | Context passed to all other packages to reduce the number of arguments |
| [@dimerapp/config-parser](https://github.com/dimerapp/config-parser) | Parses `dimer.json` file and report errors (if any)
| [@dimerapp/utils](https://github.com/dimerapp/utils) | Handy utils to keep all packages DRY. |
| [@dimerapp/cli-utils](https://github.com/dimerapp/cli-utils) | Utilities for command line styles. |
| [@dimerapp/http-server](https://github.com/dimerapp/http-server) | HTTP server to serve files generated by `@dimerapp/datastore` as JSON API. |
| [@dimerapp/image](https://github.com/dimerapp/image) | Processes images detected inside markdown files via image detection feature. |

Also special thanks to following packages. Creating Dimer was impossible without them.

1. [unified](https://github.com/unifiedjs/unified)
2. [chokidar](https://github.com/paulmillr/chokidar)
3. [fs-extra](https://www.npmjs.com/package/fs-extra)
4. [oclif](https://oclif.io/)


[travis-image]: https://img.shields.io/travis/dimerapp/cli/master.svg?style=flat-square&logo=travis
[travis-url]: https://travis-ci.org/dimerapp/cli "travis"

[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/cli/master.svg?style=flat-square&logo=appveyor
[appveyor-url]: https://ci.appveyor.com/project/thetutlage/cli "appveyor"

[npm-image]: https://img.shields.io/npm/v/@dimerapp/cli.svg?style=flat-square&logo=npm
[npm-url]: https://npmjs.org/package/@dimerapp/cli "npm"

[oclif-image]: https://img.shields.io/badge/cli-oclif-brightgreen.svg?style=flat-square
[oclif-url]: https://oclif.io
