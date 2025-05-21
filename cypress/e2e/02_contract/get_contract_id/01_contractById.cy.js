describe("api/v1/contracts/{id} - Get contract By a valid id", () => {
  before(function () {
    cy.fetchContractById();
    cy.fixture("getContractById.json").as("contractsData");
    cy.fixture("GetContractByIdSchema.json").as("contractsDataSchema");
    cy.getToken();
  });

  

  it("TC124 | should return 200 and valid contract data for a valid contract ID", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "124");
      const contractId = testCase.queryParams.id;
      const url = `/api/v1/contracts/${contractId}`;

      cy.request({
        method: testCase.method,
        url: `${url}?client=abt`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Access the wrapper object
        const responseWrapper = response.body.ResponseWrapperContractSubscriptionInstanceDto;
        expect(responseWrapper).to.exist;

        // Validate HTTP status code and response metadata
        validateResponseMetadata(response, testCase);

        // Access and validate main data sections
        const data = responseWrapper.data;
        expect(data).to.exist;

        // Validate contract instance
        validateContractInstance(data.contractInstance, testCase);

        // Validate signature matrices
        validateSignatureMatrices(data.signatureMatrices);

        // Validate threshold limits
        validateThresholdLimits(data.thresholdLimitsDto);

        // Store the response for later review if needed
        if (Cypress.env("saveResponses")) {
          testCase.actualResponse = response.body;
          cy.task("writeFile", {
            filePath: "results/getContractById_responses.json",
            content: JSON.stringify(this.contractsData, null, 2),
          });
        }
      });
    });
  });
});

// Helper functions for validation
function validateResponseMetadata(response, testCase) {
  const responseWrapper = response.body.ResponseWrapperContractSubscriptionInstanceDto;
  
  // Verify HTTP status code
  expect(response.status).to.eq(testCase.statusCode);
  
  // Verify metadata fields
  expect(responseWrapper).to.have.property("status").to.eq(testCase.status);
  expect(responseWrapper).to.have.property("message").to.eq(testCase.message);
  expect(responseWrapper).to.have.property("codeMessage").to.eq(testCase.codeMessage);
  expect(responseWrapper).to.have.property("data").to.be.an("object");
}

function validateContractInstance(contractInstance, testCase) {
  // Verify all main contract instance fields
  expect(contractInstance).to.exist;
  expect(contractInstance).to.have.property("id").to.eq(parseInt(testCase.queryParams.id));
  
  // Boolean fields
  expect(contractInstance).to.have.property("createdByAdmin").to.be.a("boolean");
  expect(contractInstance).to.have.property("encryption").to.be.a("boolean");
  expect(contractInstance).to.have.property("sealing").to.be.a("boolean");
  expect(contractInstance).to.have.property("groupConventionBoolean").to.be.a("boolean");
  
  // String fields
  const stringFields = [
    "createdByUser", "clientType", "clientTypeLabel", "city", "address", 
    "address1", "address2", "radical", "postalCode", "enableForSubscribers", 
    "enableForSubscribersLabel", "agencyCode", "agencyName", "subscriptionDate", 
    "creationDate", "implementationDate", "billingAccount", "billingAccountNumber", 
    "billingAccountRib", "groupConvention", "contractIdentifier", "emailAlert", 
    "emailAlertLabel", "smsAlert", "smsAlertLabel", "state", "stateLabel", 
    "commercialRelationIdentifier", "agencyCommercialAssignment", "titleRCS", 
    "userFullName"
  ];
  
  stringFields.forEach(field => {
    if (contractInstance[field] !== null) {
      expect(contractInstance).to.have.property(field).to.be.a("string");
    } else {
      expect(contractInstance).to.have.property(field).to.be.null;
    }
  });
  
  // Nullable fields (may be null)
  const nullableFields = [
    "publicKey", "address3", "country", "nationalIdentifier", "reason", 
    "userIdentityCardNumber", "commercialGroup", "subscriber"
  ];
  
  nullableFields.forEach(field => {
    expect(contractInstance).to.have.property(field);
  });
  
  // Number fields
  expect(contractInstance).to.have.property("initialContractId").to.be.a("number");
  expect(contractInstance).to.have.property("version").to.be.a("number");
  
  // Array fields
  expect(contractInstance).to.have.property("commercialOfferCodes").to.be.an("array");
  expect(contractInstance).to.have.property("commercialOfferTariffCodes").to.be.an("array");
  
  // Validate product subscriptions
  expect(contractInstance).to.have.property("productSubscriptions").to.be.an("array");
  if (contractInstance.productSubscriptions.length > 0) {
    contractInstance.productSubscriptions.forEach(product => {
      expect(product).to.have.property("productCode").to.be.a("string");
      expect(product).to.have.property("offerCode").to.be.a("string");
      expect(product).to.have.property("offerLabel").to.be.a("string");
      expect(product).to.have.property("encryption").to.be.a("boolean");
      expect(product).to.have.property("sealing").to.be.a("boolean");
    });
  }
}

function validateSignatureMatrices(signatureMatrices) {
  expect(signatureMatrices).to.be.an("array");
  
  signatureMatrices.forEach(matrix => {
    expect(matrix).to.have.property("id").to.be.a("number");
    expect(matrix).to.have.property("clientSegment").to.be.a("string");
    
    // Check for presence of common matrix fields (some may be null)
    const matrixFields = [
      "transferMatrixEnabled", "orderSubmissionMatrixEnabled", 
      "beneficiariesMatrixEnabled", "bankCheckMatrixEnabled", 
      "associatedBankCode", "tradeFinanceMatrixEnabled", 
      "contractMatrixEnabled", "checkRequestMatrixEnabled", 
      "invoicePaymentRequestMatrixEnabled"
    ];
    
    matrixFields.forEach(field => {
      expect(matrix).to.have.property(field);
    });
  });
}

function validateThresholdLimits(thresholdLimits) {
  expect(thresholdLimits).to.exist;
  
  // Check a sample of formatted and non-formatted fields
  // Since there are so many fields, we'll check a representative sample
  
  // Sample of numeric fields
  const sampleNumericFields = [
    "montantMinVirDevUnitWeb", "montantMaxVirDevUnitWeb", 
    "montantVirDevQuotWeb", "nbrMaxVirDevQuotWeb"
  ];
  
  sampleNumericFields.forEach(field => {
    if (thresholdLimits[field] !== null) {
      expect(thresholdLimits).to.have.property(field).to.be.a("number");
    }
  });
  
  // Sample of formatted fields (strings)
  const sampleFormattedFields = [
    "montantMaxVCCUnitMobileFormatted", "montantVCCQuotWebFormatted", 
    "nbrMaxVCCQuotTousFormatted", "montantVVBQuotTousFormatted"
  ];
  
  sampleFormattedFields.forEach(field => {
    if (thresholdLimits[field] !== null) {
      expect(thresholdLimits).to.have.property(field).to.be.a("string");
    }
  });
  
  // Check for presence of all fields without strict validation
  // This ensures the structure is correct without making the test too brittle
  
  // Sample selection of threshold limit keys to check existence
  const keysToCheck = [
    // Base amounts
    "montantMinVirUnitWeb", "montantMaxVirUnitWeb", "montantVirQuotWeb",
    // Formatted amounts
    "montantMinVirUnitWebFormatted", "montantMaxVirUnitWebFormatted",
    // Counts
    "nbrMaxVirQuotWeb", "nbrMaxVirQuotWebFormatted",
    // Device specific
    "montantMinVirUnitMobile", "montantMaxVirUnitMobile",
    // Aggregates
    "montantVirQuotTous", "montantMaxVirUnitTous"
  ];
  
  keysToCheck.forEach(key => {
    expect(thresholdLimits).to.have.property(key);
  });
}
describe("api/v1/contracts/{id} - Error Handling Tests", () => {
  beforeEach(function () {
    // Call getToken and make sure it aliases the token correctly
    cy.getToken().as('authToken');
    // Alternative: Define the getToken command directly if needed
    // cy.task('getAuthToken').then(token => {
    //   cy.wrap(token).as('authToken');
    // });
  });

  it("TC125 | should return ERROR_GENERAL when an unexpected error occurs", function () {
    cy.get("@authToken").then((token) => {
      cy.request({
        method: "GET",
        url: `/api/v1/contracts/`, // Missing ID causing server error
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Verify response structure for general error
        expect(response.body).to.have.property("ResponseWrapper");
        const responseWrapper = response.body.ResponseWrapper;
        
        expect(responseWrapper).to.have.property("status").to.eq("ERROR");
        expect(responseWrapper).to.have.property("error");
        expect(responseWrapper.error).to.have.property("code").to.eq("ERR_GENERAL_0005");
        expect(responseWrapper.error).to.have.property("message").to.eq("An unexpected error occurred. Please try again later.");
        expect(responseWrapper.error).to.have.property("suggestions").to.be.an("array");
        expect(responseWrapper.error).to.have.property("metaData");
        expect(responseWrapper.error.metaData).to.have.property("operationId");
        expect(responseWrapper.error.metaData).to.have.property("path");
        expect(responseWrapper.error.metaData).to.have.property("method").to.eq("GET");
        expect(responseWrapper.error.metaData).to.have.property("requestId");
      });
    });
  });

  it("TC126 | should return ERR_CTR_0016 when contract does not exist", function () {
    cy.get("@authToken").then((token) => {
      const nonExistentId = 1; // ID that doesn't exist
      
      cy.request({
        method: "GET",
        url: `/api/v1/contracts/${nonExistentId}?client=abt`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Verify response structure for not found error
        expect(response.body).to.have.property("ResponseWrapper");
        const responseWrapper = response.body.ResponseWrapper;
        
        expect(responseWrapper).to.have.property("status").to.eq("ERROR");
        expect(responseWrapper).to.have.property("error");
        expect(responseWrapper.error).to.have.property("code").to.eq("ERR_CTR_0016");
        expect(responseWrapper.error).to.have.property("message").to.eq("The specified contract could not be found.");
        expect(responseWrapper.error).to.have.property("metaData");
        expect(responseWrapper.error.metaData).to.have.property("operationId");
        expect(responseWrapper.error.metaData).to.have.property("path");
        expect(responseWrapper.error.metaData).to.have.property("method").to.eq("GET");
        expect(responseWrapper.error.metaData).to.have.property("requestId");
        expect(responseWrapper).to.have.property("timestamp").to.be.a("string");
      });
    });
  });

  it("TC127 | should return ERR_GENERAL_0003 when ID is too large", function () {
    cy.get("@authToken").then((token) => {
      const invalidLargeId = "1111111111111111111111111111"; // Too large ID
      
      cy.request({
        method: "GET",
        url: `/api/v1/contracts/${invalidLargeId}?client=abt`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Verify response structure for type mismatch error with large ID
        expect(response.body).to.have.property("ResponseWrapper");
        const responseWrapper = response.body.ResponseWrapper;
        
        expect(responseWrapper).to.have.property("status").to.eq("ERROR");
        expect(responseWrapper).to.have.property("error");
        expect(responseWrapper.error).to.have.property("code").to.eq("ERR_GENERAL_0003");
        expect(responseWrapper.error).to.have.property("message").to.eq("Argument type mismatch.");
        expect(responseWrapper.error).to.have.property("details").to.be.an("array");
        expect(responseWrapper.error.details[0]).to.have.property("message")
          .to.include("Parameter 'id' should be of type Long");
        expect(responseWrapper.error.details[0]).to.have.property("target").to.eq("id");
        expect(responseWrapper.error).to.have.property("suggestions").to.be.an("array");
        expect(responseWrapper.error).to.have.property("metaData");
        expect(responseWrapper.error.metaData).to.have.property("operationId");
        expect(responseWrapper.error.metaData).to.have.property("path");
        expect(responseWrapper.error.metaData).to.have.property("method").to.eq("GET");
        expect(responseWrapper.error.metaData).to.have.property("requestId");
        expect(responseWrapper).to.have.property("timestamp").to.be.a("string");
      });
    });
  });

  it("TC128 | should return ERR_GENERAL_0003 when ID is not a number", function () {
    cy.get("@authToken").then((token) => {
      const invalidAlphaId = "abc12"; // Non-numeric ID
      
      cy.request({
        method: "GET",
        url: `/api/v1/contracts/${invalidAlphaId}?client=abt`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Verify response structure for type mismatch error with non-numeric ID
        expect(response.body).to.have.property("ResponseWrapper");
        const responseWrapper = response.body.ResponseWrapper;
        
        expect(responseWrapper).to.have.property("status").to.eq("ERROR");
        expect(responseWrapper).to.have.property("error");
        expect(responseWrapper.error).to.have.property("code").to.eq("ERR_GENERAL_0003");
        expect(responseWrapper.error).to.have.property("message").to.eq("Argument type mismatch.");
        expect(responseWrapper.error).to.have.property("details").to.be.an("array");
        expect(responseWrapper.error.details[0]).to.have.property("message")
          .to.include("Parameter 'id' should be of type Long");
        expect(responseWrapper.error.details[0]).to.have.property("target").to.eq("id");
        expect(responseWrapper.error).to.have.property("suggestions").to.be.an("array");
        expect(responseWrapper.error).to.have.property("metaData");
        expect(responseWrapper.error.metaData).to.have.property("operationId");
        expect(responseWrapper.error.metaData).to.have.property("path");
        expect(responseWrapper.error.metaData).to.have.property("method").to.eq("GET");
        expect(responseWrapper.error.metaData).to.have.property("requestId");
        expect(responseWrapper).to.have.property("timestamp").to.be.a("string");
      });
    });
  });
});