var raw = [
  {
    'begin': 'coffee-?(?:script)?',
    contentName: 'source.coffee'
  }, {
    'begin': '(?:javascript|js)',
    contentName: 'source.js'
  }, {
    'begin': '(?:rust|rs)',
    contentName: 'source.rust'
  }, {
    'begin': 'elm',
    contentName: 'source.elm'
  }, {
    'begin': 'julia',
    contentName: 'source.julia'
  }, {
    'begin': '(?:apib|apiblueprint)',
    'name': 'markup.code.gfm',
    'include': 'text.html.markdown.source.gfm.apib'
  }, {
    'begin': 'mson',
    'name': 'markup.code.gfm',
    'include': 'text.html.markdown.source.gfm.mson'
  }, {
    'begin': 'sql',
    'name': 'markup.code.sql.gfm',
    'include': 'source.sql'
  }, {
    'begin': 'clojure',
    'name': 'markup.code.clojure.gfm',
    'include': 'source.clojure'
  }, {
    'begin': '(?:markdown|mdown|md)',
    'name': 'markup.code.gfm',
    'include': '$self'
  }, {
    'begin': 'json',
    contentName: 'source.json'
  }, {
    'begin': 'css',
    contentName: 'source.css'
  }, {
    'begin': 'less',
    contentName: 'source.css.less'
  }, {
    'begin': 'xml',
    contentName: 'text.xml'
  }, {
    'begin': '(?:ruby|rb)',
    contentName: 'source.ruby'
  }, {
    'begin': 'java',
    contentName: 'source.java'
  }, {
    'begin': 'erlang',
    contentName: 'source.erlang'
  }, {
    'begin': 'go(?:lang)?',
    contentName: 'source.go'
  }, {
    'begin': 'cs(?:harp)?',
    contentName: 'source.cs'
  }, {
    'begin': 'php',
    contentName: 'source.php'
  }, {
    'begin': '(?:sh|bash)',
    contentName: 'source.shell'
  }, {
    'begin': 'py(?:thon)?',
    contentName: 'source.python'
  }, {
    'begin': 'swift',
    contentName: 'source.swift'
  }, {
    'begin': 'c',
    contentName: 'source.c'
  }, {
    'begin': 'c(?:pp|\\\\+\\\\+)',
    contentName: 'source.cpp'
  }, {
    'begin': '(?:objc|objective-c)',
    contentName: 'source.objc'
  }, {
    'begin': 'haskell',
    contentName: 'source.haskell'
  }, {
    'begin': 'html',
    'name': 'markup.code.html.gfm',
    contentName: 'source.html.basic',
    'include': 'text.html.basic'
  },
  {
    'begin': '(?:la)?tex',
    'name': 'markup.code.latex.gfm',
    'include': 'text.tex.latex'
  }, {
    'begin': 'ya?ml',
    contentName: 'source.yaml'
  }, {
    'begin': 'elixir',
    contentName: 'source.elixir'
  }, {
    'begin': '(?:diff|patch|rej)',
    contentName: 'source.diff'
  }
];

//"^\\s*(((`|~){3,})\\s*(?:(?:(?:sh|bash))|(\\{.*\\.(?:sh|bash)[^\\}]*\\})))\\s*$"

var _ = require('lodash');

var fencedTemplate = _.template('{"begin":"^\\\\s*(((`|~){3,})\\\\s*(?:(?i:<%= begin %>)|(\\\\{.*\\\\.(?i:<%= begin %>)[^\\\\}]*\\\\}))\\\\s*)$","beginCaptures":{"0":{"name":"support.gfm"},"4":{"patterns":[{"include":"source.css.less"}]}},"end":"^\\\\s*\\\\2\\\\3*\\\\s*$","endCaptures":{"0":{"name":"support.gfm"}},"name":"<%= name %>","patterns":[{"include":"<%= include %>"}]}');

var inlineTemplate = _.template('{"match":"(`+)(.+)\\\\1\\\\s*(\\\\{.*\\\\.(?i:<%= begin %>)[^\\\\}]*\\\\})","captures":{"2":{"patterns":[{"include":"<%= include %>"}]},"3":{"patterns":[{"include":"source.css.less"}]}},"name":"<%= name %>"}');


languages = _.map(raw, function(language) {
  if (!language.include) {
    language.include = language.contentName;
  }
  if (!language.name) {
    language.name = language.contentName.replace(/.+\./, '');
    language.name = 'markup.code.' + language.name + '.gfm'
  }

  var block = JSON.parse(fencedTemplate(language))
  var inline = JSON.parse(inlineTemplate(language))

  if (language.contentName) {
    block.contentName = language.contentName;
  }

  if (language.include === 'empty') {
    delete block.patterns;
    delete inline.patterns;
  }

  return {
    block: block,
    inline: inline
  };
})

raw = [
  {
    block: {
      begin: '^\\s*(((`|~){3,})\\s*(?:(?:r|knitr)|(\\{.*\\.(?:r|knitr)[^\\}]*\\})|(\\{r[^\\}]*\\}))\\s*)$',
      beginCaptures: {
        '1': {
          name: 'support.gfm'
        },
        '4': {
          patterns: [
            {
              include: 'source.css.less'
            }
          ]
        }
      },
      end: '^\\s*\\2\\3*$',
      endCaptures: {
        '0': {
          name: 'support.gfm'
        }
      },
      name: 'markup.code.yaml.gfm',
      patterns: [
        {
          include: 'source.r'
        }
      ],
      contentName: 'source.r'
    },
    inline: {
      name: 'markup.code.knitr.gfm',
      'match': '(`+)r\\s+(.+)\\1',
      captures: {
        '2': {
          patterns: [
            {
              include: 'source.r'
            }
          ]
        }
      }
    }
  },
  {
    block: {
      'begin': '^\\s*((`|~){3,})\\s*.*\\s*$',
      'beginCaptures': {
        '0': {
          'name': 'support.gfm'
        }
      },
      'end': '^\\s*(\\1\\2*\\s*)$',
      'endCaptures': {
        '0': {
          'name': 'support.gfm'
        }
      },
      order: 2000,
      'name': 'markup.raw.gfm'
    },
    inline: {
      'begin': '(`+)(?!$)',
      'end': '\\1',
      order: 2000,
      'name': 'markup.raw.gfm'
    }
  }
];

languages = _.union(languages, raw);

module.exports = {
  inline: _.pluck(languages, 'inline'),
  block: _.pluck(languages, 'block')
}
