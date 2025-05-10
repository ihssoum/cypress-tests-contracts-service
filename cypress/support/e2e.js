import './commands';
import '@shelex/cypress-allure-plugin';


var chaiJsonSchema = require('chai-json-schema');
var chaiEach = require('chai-each');
chai.use(chaiJsonSchema);
chai.use(chaiEach);