const { log } = require('console');
const path = require('path');

class StrategyContext {
  constructor(clientName, clientData) {
    this.clientName = clientName;
    this.clientData = clientData;
  }

  loadStrategy() {
    const strategyPath = path.join(__dirname, `../strategies/${this.clientName.toUpperCase()}Strategy.js`);
    log(`Loading strategy for client ${this.clientName} from ${strategyPath}`);
    const testing = require(strategyPath);
    log(testing)


    try {
      const StrategyClass = require(strategyPath);
      return new StrategyClass(this.clientData);
    } catch (error) {
      throw new Error(`Strategy for client ${this.clientName} not found`);
    }
  }

  executeMapping(schema) {
    const strategy = this.loadStrategy();
    return strategy.mapDataToSchema(schema);
  }
}

module.exports = StrategyContext;
