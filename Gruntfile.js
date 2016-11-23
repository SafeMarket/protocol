const glob = require('glob-fs')()

module.exports = function gruntfile(grunt) {
  grunt.loadNpmTasks('grunt-solc')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-compile-handlebars')
  grunt.loadNpmTasks('grunt-contrib-clean')

  const templateData = {
    schemas: require('./modules/schemas')
  }
  templateData.solidityVersion = grunt.file.readJSON('package.json').devDependencies.solc

  const templateFiles = glob.readdirSync('contracts/*.sol.handlebars').map((template) => {
    return {
      src: template,
      dest: `generated/contracts/${template.split('/').pop().replace('.handlebars', '')}`
    }
  })

  grunt.initConfig({
    watch: {
      contracts: {
        files: ['contracts/*', 'partials/*', 'modules/handlebarHelpers/*', 'modules/contractData'],
        tasks: ['build', 'mochaTest']
      },
      tests: {
        files: ['test/*'],
        tasks: ['mochaTest']
      },
    },
    'compile-handlebars': {
      contracts: {
        files: templateFiles,
        templateData: templateData,
        helpers: ['modules/handlebarHelpers/*'],
        partials: ['partials/*']
      }
    },
    clean: {
      generated: ['generated/*']
    },
    solc: {
      default: {
        options: {
          files: ['generated/contracts/*'],
          solc: require('solc'),
          output: 'generated/contracts.json',
          doOptimize: true
        }
      }
    },
    mochaTest: {
      test: {
        src: ['test/**/*.js']
      },
      options: {
        bail: true,
        noFail: true,
        timeout: 10000
      }
    },
  })

  grunt.registerTask('build', [
    'clean',
    'compile-handlebars',
    'solc',
  ])

  grunt.registerTask('init', [
    'build',
    'mochaTest',
    'watch'
  ])
}
