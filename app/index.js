'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');
_.str = require('underscore.string');

_.mixin(_.str.exports());

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        // determine theme name from cwd and form a theme name according to Drupal standards
        this.dirName = path.basename(process.cwd());
        this.themeName = _(_.slugify(this.dirName)).underscored();


        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the superior' + chalk.red('DrupalGulp') + ' generator!'
        ));

        this.themeDesc = 'nameless theme description';
        this.themeMachineName = 'nameless';

        var prompts = [
            {
                type: 'input',
                name: 'themeName',
                message: 'Name your theme:',
                default: this.themeName // Default to current folder name
            },
            {
                type: 'input',
                name: 'themeDesc',
                message: 'Describe your theme:',
                default: 'No description'
            },
            {
                type: 'input',
                name: 'browserSyncProxy',
                message: 'What is the URL of your local drupal dev setup:',
                default: 'http://localhost:8888'
            },
            {
                type: 'confirm',
                name: 'TypeScript',
                message: 'Would you like to enable TypeScript to JavaScript compilation instead of just using JavaScript?',
                default: true
            }
        ];

        this.prompt(prompts, function (props) {
            this.TypeScript = props.TypeScript;
            this.themeName = props.themeName;
            this.themeDesc = props.themeDesc;
            this.browserSyncProxy = props.browserSyncProxy;
            this.themeMachineName = _.underscored((_.slugify(this.themeName)));
            // set destination path according to destination path + theme name
           // this.destinationRoot(this.themeMachineName);

            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            this.packageInfo = {
                "name": this.themeMachineName,
                "version": "1.1.0"
            };
            this.template('_package.json', 'package.json');
            this.fs.copy(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json')
            );

            this.template('_theme.info', this.themeMachineName + '.info');
            this.template('template.php', 'template.php');
            this.template('gulpfile.js', 'gulpfile.js');
            this.template('theme-settings.php', 'theme-settings.php');
            this.fs.copy(
                this.templatePath('src'),
                this.destinationPath('src')
            );
            this.log("Typescript: "+this.TypeScript);
            if (!this.TypeScript) {
                this.fs.copy(
                    this.templatePath('_js'),
                    this.destinationPath('src/scripts/js')
                );
            } else {
                this.fs.copy(
                    this.templatePath('_ts'),
                    this.destinationPath('src/scripts/ts')
                );
            }
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );
            this.fs.copy(
                this.templatePath('browserconfig.xml'),
                this.destinationPath('browserconfig.xml')
            );
            this.fs.copy(
                this.templatePath('crossdomain.xml'),
                this.destinationPath('crossdomain.xml')
            );
            this.fs.copy(
                this.templatePath('screenshot.png'),
                this.destinationPath('screenshot.png')
            );
            this.directory('templates', 'templates');

        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
        this.on('end', function () {
            this.spawnCommand('gulp').on('close', function (code) {
                var succesMessage =
                    '----------------------------------------------------' +
                    chalk.green.bold('\nYay it worked, now try running:\n') +
                    chalk.yellow.bold('gulp watch') +
                    '\nand open the BrowserSync url provided in the' +
                    '\nterminal output, in your preferred browser.'+
                    '\n----------------------------------------------------';
                if (code === 0) {
                    this.log(succesMessage);
                } else {
                    this.log(chalk.red.bold('Ooops, something went wrong, please check for specific errors above.'));
                    this.log(chalk.red.bold('If you see errors above like: ENOENT LSTAT NPM, try running:'));
                    this.log(chalk.yellow.bold('npm cache clean'));
                }

            }.bind(this));
        }.bind(this));
    }

});
