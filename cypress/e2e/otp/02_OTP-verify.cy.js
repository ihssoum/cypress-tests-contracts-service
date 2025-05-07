describe("/api/v1/otp/verify test suite", () => {
  before(() => {

    cy.fixture("otp.json").then((otpData) => {
      let updatedOtpData = [...otpData]; // Create a copy to modify throughout the chain

      // TC 81 - expired otp
      cy.task("fetchReceivedOtpFromDb", {
        query: "SELECT identifiant, otp_code FROM OTP WHERE ID = 1025688",
      })
        .then((result) => {
          updatedOtpData = updatedOtpData.map((tc) =>
            tc.testCaseId === "81"
              ? {
                  ...tc,
                  requestBody: {
                    ...tc.requestBody,
                    verifyOtpRequest: {
                      ...tc.requestBody.verifyOtpRequest,
                      identifier: result[0], // Assign identifier from query result
                      receivedOtp: result[1], // Assign receivedOtp from query result
                    },
                  },
                }
              : tc
          );

          // TC 80 - valid otp
          const tcValidIdentifier = otpData.find((tc) => tc.testCaseId === "51")
            .responseBody.data.identifier;

          return cy
            .task("fetchReceivedOtpFromDb", {
              query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcValidIdentifier}'`,
            })
            .then((result) => {
              updatedOtpData = updatedOtpData.map((tc) =>
                tc.testCaseId === "80"
                  ? {
                      ...tc,
                      requestBody: {
                        ...tc.requestBody,
                        verifyOtpRequest: {
                          ...tc.requestBody.verifyOtpRequest,
                          identifier: result[0],
                          receivedOtp: result[1],
                        },
                      },
                    }
                  : tc
              );
              return result; // Return result for chaining
            });
        })
        .then(() => {
          // TC 82: - old otp
          const tcOldIdentifier = otpData.find((tc) => tc.testCaseId === "50")
            .responseBody.data.identifier;

          return cy
            .task("fetchReceivedOtpFromDb", {
              query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcOldIdentifier}'`,
            })
            .then((result) => {
              updatedOtpData = updatedOtpData.map((tc) =>
                tc.testCaseId === "82"
                  ? {
                      ...tc,
                      requestBody: {
                        ...tc.requestBody,
                        verifyOtpRequest: {
                          ...tc.requestBody.verifyOtpRequest,
                          identifier: result[0],
                          receivedOtp: result[1],
                        },
                      },
                    }
                  : tc
              );
              return result; // Return result for chaining
            });
        })
        .then(() => {
          // TC 83, 86, 87, 88, 89: edge cases on identifier w/ valid otp
          const tcEdgeIdentifier = otpData.find((tc) => tc.testCaseId === "55")
            .responseBody.data.identifier;

          return cy
            .task("fetchReceivedOtpFromDb", {
              query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcEdgeIdentifier}'`,
            })
            .then((result) => {
              updatedOtpData = updatedOtpData.map((tc) =>
                ["83", "86", "87", "88", "89"].includes(tc.testCaseId)
                  ? {
                      ...tc,
                      requestBody: {
                        ...tc.requestBody,
                        verifyOtpRequest: {
                          ...tc.requestBody.verifyOtpRequest,
                          receivedOtp: result[1],
                        },
                      },
                    }
                  : tc
              );
              return result; // Return result for chaining
            });
        })
        .then(() => {
          // TC 84, 90, 91, 92, 93: edge cases on otp w/ valid identifier
          const tcEdgeOtp = otpData.find((tc) => tc.testCaseId === "57")
            .responseBody.data.identifier;

          updatedOtpData = updatedOtpData.map((tc) =>
            ["84", "90", "91", "92", "93"].includes(tc.testCaseId)
              ? {
                  ...tc,
                  requestBody: {
                    ...tc.requestBody,
                    verifyOtpRequest: {
                      ...tc.requestBody.verifyOtpRequest,
                      identifier: tcEdgeOtp,
                    },
                  },
                }
              : tc
          );

          // Set the final updated data to Cypress environment
          Cypress.env("updatedOtpData", updatedOtpData);
        });
    });
  });

  beforeEach(function () {
    // First check if there's updated data in Cypress.env
    if (Cypress.env("updatedOtpData")) {
      // Use the updated data from previous tests
      this.otpData = Cypress.env("updatedOtpData");
      cy.log("Using updated OTP data from environment");
    } else {
      // If no updated data exists yet, load from fixture
      cy.fixture("otp.json").then((otpData) => {
        this.otpData = otpData;
        cy.log("Loaded original OTP data from fixture");
      });
    }
  });

  it("TC-80 | Verify OTP with valid data", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "80");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
        "status",
        "SUCCESS"
      );
      expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
        "data"
      );
      expect(response.body.ResponseWrapperVerifyOtpDto.data).to.have.property(
        "valid",
        true
      );
      expect(response.body.ResponseWrapperVerifyOtpDto.data).to.have.property(
        "message",
        testCase.responseBody.data.message
      );
    });
  });

  it("TC-81 | Verify OTP with expired OTP", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "81");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
        "codeMessage",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-82 | Verify an old OTP after creating a new one", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "82");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-83 | Verify OTP with nonexistent identifier", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "83");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-84 | Verify OTP with incorrect password", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "84");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-85 | Verify an empty OTP request", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "85");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-86 | Verify OTP with missing identifier", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "86");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-87 | Identifier w/ special characters", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "87");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-88 | Long identifier", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "88");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-89 | Numbered identifier (not string)", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "89");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-90 | Verify OTP with missing OTP", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "90");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-91 | Long OTP", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "91");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });
  });

  it("TC-92 | Invalid OTP format", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "92");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/verify",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
    });

    it("TC-93 | Numbered OTP (not string)", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "93");

      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
        body: testCase.requestBody,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property("status", "ERROR");
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "codeMessage",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapperVerifyOtpDto).to.have.property(
          "message",
          testCase.responseBody.error.message
        );
      });
    });
  });

  afterEach(() => {
    const updatedOtpData = Cypress.env("updatedOtpData");
    if (updatedOtpData) {
      cy.log("Writing updated OTP data to file");
      cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
    }
  });
});
