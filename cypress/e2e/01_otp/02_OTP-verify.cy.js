describe("/api/v1/otp/verify test suite", () => {
  before(() => {

    cy.fixture("otp.json").then((otpData) => {
      let updatedOtpData = [...otpData]; // Create a copy to modify throughout the chain

      // TC 89 - expired otp
      cy.task("fetchReceivedOtpFromDb", {
        query: "SELECT identifiant, otp_code FROM OTP WHERE ID = 1025688",
      })
        .then((result) => {
          updatedOtpData = updatedOtpData.map((tc) =>
            tc.testCaseId === "89"
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

          // TC 88 - valid otp
          const tcValidIdentifier = otpData.find((tc) => tc.testCaseId === "59")
            .responseBody.data.identifier;

          return cy
            .task("fetchReceivedOtpFromDb", {
              query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcValidIdentifier}'`,
            })
            .then((result) => {
              updatedOtpData = updatedOtpData.map((tc) =>
                tc.testCaseId === "88"
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
          // TC 90: - old otp
          const tcOldIdentifier = otpData.find((tc) => tc.testCaseId === "58")
            .responseBody.data.identifier;

          return cy
            .task("fetchReceivedOtpFromDb", {
              query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcOldIdentifier}'`,
            })
            .then((result) => {
              updatedOtpData = updatedOtpData.map((tc) =>
                tc.testCaseId === "90"
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
          // TC 90, 93, 94, 95, 96: edge cases on identifier w/ valid otp
          const tcEdgeIdentifier = otpData.find((tc) => tc.testCaseId === "63")
            .responseBody.data.identifier;

          return cy
            .task("fetchReceivedOtpFromDb", {
              query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcEdgeIdentifier}'`,
            })
            .then((result) => {
              updatedOtpData = updatedOtpData.map((tc) =>
                ["90", "93", "94", "95", "96"].includes(tc.testCaseId)
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
          // TC 91, 97, 98, 99, 100: edge cases on otp w/ valid identifier
          const tcEdgeOtp = otpData.find((tc) => tc.testCaseId === "65")
            .responseBody.data.identifier;

          updatedOtpData = updatedOtpData.map((tc) =>
            ["91", "97", "98", "99", "100"].includes(tc.testCaseId)
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

  it("TC-88 | Verify OTP with valid data", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "88");

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

  it("TC-89 | Verify OTP with expired OTP", function () {
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

  it("TC-90 | Verify an old OTP after creating a new one", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "90");

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

  it("TC-91 | Verify OTP with nonexistent identifier", function () {
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

  it("TC-92 | Verify OTP with incorrect password", function () {
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
  });

  it("TC-93 | Verify an empty OTP request", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "93");

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

  it("TC-94 | Verify OTP with missing identifier", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "94");

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

  it("TC-95 | Identifier w/ special characters", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "95");

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

  it("TC-96 | Long identifier", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "96");

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

  it("TC-97 | Numbered identifier (not string)", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "97");

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

  it("TC-98 | Verify OTP with missing OTP", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "98");

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

  it("TC-99 | Long OTP", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "99");

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

  it("TC-100 | Invalid OTP format", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "100");

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

  it("TC-101 | Numbered OTP (not string)", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "101");

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
