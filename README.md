# generator-composer-php-library [![Build Status](https://secure.travis-ci.org/hal9087/generator-composer-php-library.png?branch=master)](https://travis-ci.org/hal9087/generator-composer-php-library)

> [Yeoman](http://yeoman.io) generator

It provides a basic boilerplate for a [Composer](http://getcomposer.org) php library project, which features:

* Phpunit with code coverage, phpcs, phpmd, phpcpd
* Ready for Jenkins
* A functional example

The generated PHP project does not rely on any other PHP dependency than Composer (e.g. no PEAR dependency).

The generated Composer project has the following tasks:

* [PHPUnit](http://phpunit.de/) to run tests ```composer phpunit```
* Phpcs to review quality of code (symfony2 standards) ```composer phpcs```
* Usage of [Php Copy/Paste Detector](https://github.com/sebastianbergmann/phpcpd) ```composer phpcpd```
* Usage of phpmd to detect ugly code ```composer phpmd```

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Requirements

* [Yeoman](http://yeoman.io/)
* [XDebug](http://xdebug.org/docs/install)
* [composer](https://getcomposer.org/download/) 

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-composer-php-library from npm, run:

```bash
npm install -g generator-composer-php-library
```

Finally, initiate the generator:

```bash
yo composer-php-library
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT
