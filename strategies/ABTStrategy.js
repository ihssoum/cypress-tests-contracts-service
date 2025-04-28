const BaseStrategy = require('./BaseStrategy.js');

class ABTStrategy extends BaseStrategy {
  mapDataToSchema(schema) {
    const clientDataArray = Array.isArray(this.clientData) ? this.clientData : [this.clientData];

    const mappedContracts = clientDataArray.map(contract => {
      const filledSchema = JSON.parse(JSON.stringify(schema)); // deep copy

      filledSchema.contractId = contract.contractNumber;
      filledSchema.contractName = contract.contractTitle;
      filledSchema.startDate = contract.contractStart;
      filledSchema.endDate = contract.contractEnd;
      filledSchema.radical = contract.clientName;
      filledSchema.status = contract.contractStatus;

      return filledSchema;
    });

    return mappedContracts.length === 1 ? mappedContracts[0] : mappedContracts;
  }
}

module.exports = ABTStrategy;