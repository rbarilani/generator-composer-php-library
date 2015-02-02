'use strict';
var path   = require('path');
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var spawn  = require('child_process').spawn;


function validateNotBlank(input) {
    input = this._.str.trim(input);

    if (!input || this._.str.isBlank(input)) {
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
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        this.option('folder-name', {type: String, desc: 'Generated code folder name destination (ex. your-library-name)', required: false });
        this.option('package-name', {type: String, desc: 'Composer package name (ex. company/your-library-name)', required: false });
        this.option('skip-desc', { desc: 'Skip provide description answer.', required: false, defaults: false });
        this.option('ps4-namespace', { desc: 'Ps4 base namespace for your library. (ex. Company\\YourLibraryName)', required: false });
    },
    prompting: function () {
        var done = this.async();
        this.log(yosay(
            'Welcome to ' + chalk.red('ComposerPhpLibrary') + ' generator!'
        ));
        var prompts = [{
            when: function () {
                if(validateNotBlank.apply(this, [this.options['folder-name']]) === true) {
                    this.log.writeln('destination folder name: ' + this.options['folder-name']);
                    return false;
                }
                return true;
            }.bind(this),
            type: 'input',
            name: 'folderName',
            message: 'Please, provide a destination folder for generated code. (default: current path)',
            validate: validateNotBlank.bind(this),
            default : function () {
                return this._.str.slugify(this.appname);
            }.bind(this)
        },{
            when: function () {
                if(validateNotBlank.apply(this, [this.options['package-name']]) === true) {
                    this.log.writeln('package name: ' + this.options['package-name']);
                    return false;
                }
                return true;
            }.bind(this),
            type: 'input',
            name: 'packageName',
            message: 'Please, provide a package name for your library. (ex. company/your-library-name)',
            validate: validateNotBlank.bind(this)
        },{
            when : function () {
                return !this.options['skip-desc'];
            }.bind(this),
            type: 'confirm',
            name: 'includePackageDescription',
            message: 'Do you want to provide a package description?',
            default: false
        },{
            when : function (answers) {
                return answers.includePackageDescription;
            },
            type: 'input',
            name: 'packageDescription',
            message: 'Please provide a package description.',
            validate : validateNotBlank.bind(this)
        }, {
            when: function () {
                if(validateNotBlank.apply(this, [this.options['ps4-namespace']]) === true) {
                    this.log.writeln('ps4 namespace: ' + this.options['ps4-namespace']);
                    return false;
                }
                return true;
            }.bind(this),
            type: 'input',
            name: 'ps4Namespace',
            message: 'Please, provide a ps4 namespace for your library.',
            default: function (props) {
                var packageNameParts = props.packageName ? props.packageName.split('/') : this.options['package-name'].split('/');

                return this._.map(packageNameParts, function (part) {
                    return this._.str.classify(part);
                }.bind(this)).join('\\');

            }.bind(this),
            validate: validateNotBlank.bind(this)
        }];

        this.prompt(prompts, function (props) {

            this.folderName  = props.folderName || this.options['folder-name']
            this.packageName = props.packageName || this.options['package-name'];
            this.packageDescription = props.packageDescription || 'TODO description';
            this.ps4Namespace = props.ps4Namespace || this.options['ps4-namespace'];
            this.ps4TestNamespace = props.ps4Namespace + '\\Tests';
            this._ps4Namespace = doubleBackslashNamespace(this.ps4Namespace);
            this._ps4TestNamespace = doubleBackslashNamespace(this.ps4TestNamespace);

            done();
        }.bind(this));
    },

    configuring: function () {
        if (this.folderName !== this._.last(this.destinationRoot().split(path.sep))) {
            this.destinationRoot(this.folderName);
        }
        this.config.save();
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
    install: function () {
        if (this.options['skip-install']) {
            return false;
        }

        this.log.writeln('[' + chalk.yellow("Composer") + '] run composer update!');

        var done = this.async();
        var composerInstall = spawn('composer', ['update']);

        composerInstall.stdout.on('data', function (data) {
            this.log.write('stdout: ' + chalk.green(data))
        }.bind(this));

        composerInstall.stderr.on('data', function (data) {
            this.log.error('stderr:' + chalk.red(data));
        }.bind(this));

        composerInstall.on('exit', function (code) {
            this.log.writeln('child process exited with code: ' + code);

            if (code === 0) {
                this.log.writeln('[' + chalk.yellow("Composer") + '] dependencies installed!');
            } else {
                this.log.error('[' + chalk.yellow("Composer") + '] ' + chalk.red('There was a problem. Try run composer install yourself.'));
            }

            done();
        }.bind(this));
    }
});
