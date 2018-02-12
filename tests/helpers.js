let supertest = require('supertest')
let chai = require('chai')
let mocha = require('mocha')
let app = require('../app.js')

global.app = app
global.expect = chai.expect
global.should = chai.should()
global.request = supertest(app)
