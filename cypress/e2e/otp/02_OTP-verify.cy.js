describe("/api/v1/otp/verify test suite", () => {
  before(() => {
    cy.fixture("otp.json").then((otpData) => {
      // TC 81 - expired otp
      cy.task("fetchReceivedOtpFromDb", {
        query: "SELECT identifiant, otp_code FROM OTP WHERE ID = 1025688",
      }).then((result) => {
        const updatedOtpData = otpData.map((tc) =>
          tc.testCaseId === 81
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
        cy.log(updatedOtpData, result[0], result[1]);
        cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
      });

      // TC 80 - valid otp
      cy.fixture("otp.json").as("otpData");
      const tcValidIdentifier = otpData.find(
        (tc) => tc.testCaseId === "51"
      ).responseBody.data.identifier;
      cy.task("fetchReceivedOtpFromDb", {
        query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcValidIdentifier}'`,
      }).then((result) => {
        const updatedOtpData = otpData.map((tc) =>
          tc.testCaseId === 80
            ? {
                ...tc,
                requestBody: {
                  ...tc.requestBody,
                  identifier: result[0],
                  receivedOtp: result[1],
                },
              }
            : tc
        );
        cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
      });

      // TC 82: - old otp
      cy.fixture("otp.json").as("otpData");
      const tcOldIdentifier = otpData.find((tc) => tc.testCaseId === "50")
        .responseBody.data.identifier;
      cy.task("fetchReceivedOtpFromDb", {
        query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcOldIdentifier}'`,
      }).then((result) => {
        const updatedOtpData = otpData.map((tc) =>
          tc.testCaseId === 82
            ? {
                ...tc,
                requestBody: {
                  ...tc.requestBody,
                  identifier: result[0],
                  receivedOtp: result[1],
                },
              }
            : tc
        );
        cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
      });

      // TC 83, 86, 87, 88, 89: edge cases on identifier w/ valid otp
      cy.fixture("otp.json").as("otpData");
      const tcEdgeIdentifier = otpData.find((tc) => tc.testCaseId === "55")
        .responseBody.data.identifier;
      cy.task("fetchReceivedOtpFromDb", {
        query: `SELECT identifiant, otp_code FROM OTP WHERE identifiant = '${tcEdgeIdentifier}'`,
      }).then((result) => {
        const updatedOtpData = otpData.map((tc) =>
          [83, 86, 87, 88, 89].includes(tc.testCaseId)
            ? {
                ...tc,
                requestBody: {
                  ...tc.requestBody,
                  receivedOtp: result[1],
                },
              }
            : tc
        );
        cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
      });

      // TC 84, 90, 91, 92, 93: edge cases on otp w/ valid identifier
      cy.fixture("otp.json").as("otpData");
      const tcEdgeOtp = otpData.find((tc) => tc.testCaseId === "57")
        .responseBody.data.identifier;
      const updatedOtpData = otpData.map((tc) =>
        [84, 90, 91, 92, 93].includes(tc.testCaseId)
          ? {
              ...tc,
              requestBody: {
                ...tc.requestBody,
                identifier: tcEdgeOtp,
              },
            }
          : tc
      );
      cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
    });
  });

  beforeEach(() => {
    cy.fixture("otp.json").as("otpData");
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
      expect(response.body.ResponseWrapperVerifyOtpData).to.have.property(
        "status",
        "SUCCESS"
      );
      expect(response.body.ResponseWrapperVerifyOtpData).to.have.property(
        "data"
      );
      expect(response.body.ResponseWrapperVerifyOtpData.data).to.have.property(
        "valid",
        true
      );
      expect(response.body.ResponseWrapperVerifyOtpData.data).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      expect(response.body.ResponseWrapper.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.ResponseWrapper.error).to.have.property(
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
        expect(response.status).to.eq(500);
        expect(response.body.ResponseWrapper).to.have.property(
          "status",
          "ERROR"
        );
        expect(response.body.ResponseWrapper).to.have.property("error");
        expect(response.body.ResponseWrapper.error).to.have.property(
          "code",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapper.error).to.have.property(
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
