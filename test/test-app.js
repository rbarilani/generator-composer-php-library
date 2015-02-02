'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('composer-php-library:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt({
        packageName: 'hal9087/my-library',
        packageDescription : 'my library',
        ps4Namespace :'Hal9087\\MyLibrary'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'composer.json',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      'README.md',
      'phpunit.xml.dist',
      'phpmd.xml',
      'bin/ci.sh',
      'src/HelloWorld.php',
      'tests/bootstrap.php',
      'tests/Unit/HelloWorldTest.php'
    ]);
  });
});
