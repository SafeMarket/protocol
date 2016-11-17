const glob = require('glob-fs')()

module.exports = function gruntfile(grunt) {
  grunt.loadNpmTasks('grunt-solc')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-compile-handlebars')
  grunt.loadNpmTasks('grunt-contrib-clean')

  const templateData = {}
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
        files: ['contracts/*'],
        tasks: ['solc', 'mochaTest']
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
 //       helpers: ['modules/handlebarHelpers/*'],
 //       partials: ['partials/*.sol.handlebars']
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
      }
    },
  })

  grunt.registerTask('init', [
    'clean',
    'compile-handlebars',
    'solc',
    'mochaTest',
    'watch'
  ])
}
