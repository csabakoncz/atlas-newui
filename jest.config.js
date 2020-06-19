module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  transform: {
    "^.+\\.[tj]s$": "babel-jest",
    "^.*\/templates\/.*\.html$": "handlebars-jest"
  },
  moduleNameMapper: {
    "^hbs!tmpl\/(.*)$": "<rootDir>/src/templates/$1.html",
    "jquery-ui": "<rootDir>/atlas/dashboardv2/public/js/external_lib/jquery-ui/jquery-ui.min.js"
  },
  setupFiles:[
    "./setup-jest.js"
  ]
};
