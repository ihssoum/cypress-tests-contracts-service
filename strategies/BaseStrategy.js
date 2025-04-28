class BaseStrategy {
    constructor(clientData) {
      this.clientData = clientData;
    }
  
    mapDataToSchema(schema) {
      throw new Error('Method mapDataToSchema() must be implemented.');
    }
  }
  
  module.exports = BaseStrategy;
  