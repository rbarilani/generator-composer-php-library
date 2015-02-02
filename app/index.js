'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var spawn = require('child_process').spawn;


function validateNotBlank(input) {
  input = this._.str.trim(input);

  if(this._.str.isBlank(input)) {
    return 'This value can not be blank. Please insert a valid value';
  }
  return true;
}

function doubleBackslashNamespace(input) {
  var backSlashed = input.split('\\');
  backSlashed = backSlashed.join('\\\\');
  backSlashed = backSlashed + '\\\\';
  return backSlashed;
}

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to ' + chalk.red('ComposerPhpLibrary') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'packageName',
      message: 'What\'s package name for your library? (ex. company/your-library-name)',
      validate : validateNotBlank.bind(this)
    },{
      type: 'input',
      name: 'packageDescription',
      message: 'What\'s package description?',
      default: '...'
    },{
      type: 'input',
      name: 'ps4Namespace',
      message: 'What\'s ps4 namespace for your library?',
      default : function (props) {
        return this._.map(props.packageName.split('/'), function (part) {
          return this._.str.classify(part);
        }.bind(this)).join('\\');
      }.bind(this),
      validate : validateNotBlank.bind(this)
    }];

    this.prompt(prompts, function (props) {

      this.packageName  = props.packageName;
      this.packageDescription = props.packageDescription;
      this.ps4Namespace = props.ps4Namespace;
      this.ps4TestNamespace = props.ps4Namespace + '\\Tests';
      this._ps4Namespace     = doubleBackslashNamespace(this.ps4Namespace);
      this._ps4TestNamespace = doubleBackslashNamespace(this.ps4TestNamespace);

      done();
    }.bind(this));
  },

  writing: function () {

    this.mkdir('src');
    this.mkdir('tests/Unit');
    this.mkdir('bin');

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copy(
      this.templatePath('phpmd.xml'),
      this.destinationPath('phpmd.xml')
    );

    this.fs.copy(
      this.templatePath('bin/ci.sh'),
      this.destinationPath('bin/ci.sh')
    );

    this.template('tests/bootstrap.php', 'tests/bootstrap.php');
    this.template('phpunit.xml.dist', 'phpunit.xml.dist');
    this.template('README.md', 'README.md');
    this.template('composer.json', 'composer.json');

    this.template('src/HelloWorld.php', 'src/HelloWorld.php');
    this.template('tests/Unit/HelloWorldTest.php', 'tests/Unit/HelloWorldTest.php');

  },
  install : function () {
    if(this.options['skip-install']) {
      return false;
    }

    this.log.writeln('[' + chalk.yellow("Composer") + '] run composer update!');

    var done = this.async();
    var composerInstall = spawn('composer',['update']);

    composerInstall.stdout.on('data', function (data) {
      this.log.write('stdout: ' + chalk.green(data))
    }.bind(this));

    composerInstall.stderr.on('data', function (data) {
      this.log.error('stderr:' + chalk.red(data));
    }.bind(this));

    composerInstall.on('exit', function (code) {
      this.log.writeln('child process exited with code :' + code);

      if(code === 0) {
        this.log.writeln('[' + chalk.yellow("Composer") + '] dependencies installed!');
      }else{
        this.log.error('[' + chalk.yellow("Composer") + '] ' + chalk.red('There was a problem. Try run composer install yourself.'));
      }

      done();
    }.bind(this));
  }
});
