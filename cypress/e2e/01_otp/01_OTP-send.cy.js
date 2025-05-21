const toPrettyYaml = require('json-to-pretty-yaml');

describe("/api/v1/otp/send test suite", () => {
  before(() => {
    cy.task("clearOtpData", {
      query:
        "DELETE FROM OTP WHERE TRUNC(CREATEDON) = TO_DATE('2025-05-07', 'YYYY-MM-DD')",
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

  it("TC-58 | Send a request for OTP with valid data", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "58");
    
    

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property(
        "status",
        "SUCCESS"
      );
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property("data");
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "email",
        testCase.responseBody.data.email
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "identifier"
      );

      const updatedOtpData = this.otpData.map((tc) =>
        tc.testCaseId === "58"
          ? {
              ...tc,
              responseBody: {
                ...tc.responseBody,
                data: {
                  ...tc.responseBody.data,
                  identifier:
                    response.body.ResponseWrapperSendOtpDto.data.identifier,
                },
              },
            }
          : tc
      );
      Cypress.env("updatedOtpData", updatedOtpData);

      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-59 | Send another request with same number/email", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "59");
    let updatedOtpData;

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property(
        "status",
        "SUCCESS"
      );
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property("data");
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "email",
        testCase.responseBody.data.email
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "identifier"
      );
      const updatedOtpData = this.otpData.map((tc) =>
        tc.testCaseId === "59"
          ? {
              ...tc,
              responseBody: {
                ...tc.responseBody,
                data: {
                  ...tc.responseBody.data,
                  identifier:
                    response.body.ResponseWrapperSendOtpDto.data.identifier,
                },
              },
            }
          : tc
      );
      Cypress.env("updatedOtpData", updatedOtpData);
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-60 | Sending empty request", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "60");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-61 | Sending OTP without phone number, email", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "61");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-62 | Sending OTP without phone number", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "62");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-63 | Sending OTP w/ Local Phone Number w/o mail", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "63");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property(
        "status",
        "SUCCESS"
      );
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property("data");
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "email",
        null
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "identifier"
      );
      const updatedOtpData = this.otpData.map((tc) =>
        tc.testCaseId === "63"
          ? {
              ...tc,
              responseBody: {
                ...tc.responseBody,
                data: {
                  ...tc.responseBody.data,
                  identifier:
                    response.body.ResponseWrapperSendOtpDto.data.identifier,
                },
              },
            }
          : tc
      );
      Cypress.env("updatedOtpData", updatedOtpData);
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-64 | Sending OTP w/ Non-Local Phone Number w/o mail", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "64");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-65 | Sending OTP w/ Non-Local Phone Number w/ mail", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "65");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property(
        "status",
        "SUCCESS"
      );
      expect(response.body.ResponseWrapperSendOtpDto).to.have.property("data");
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "email",
        testCase.responseBody.data.email
      );
      expect(response.body.ResponseWrapperSendOtpDto.data).to.have.property(
        "identifier"
      );
      const updatedOtpData = this.otpData.map((tc) =>
        tc.testCaseId === "65"
          ? {
              ...tc,
              responseBody: {
                ...tc.responseBody,
                data: {
                  ...tc.responseBody.data,
                  identifier:
                    response.body.ResponseWrapperSendOtpDto.data.identifier,
                },
              },
            }
          : tc
      );
      Cypress.env("updatedOtpData", updatedOtpData);
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-66 | Sending OTP w/ Phone Number not respecting form w/ email", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "66");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n"
        + "Request Body: " + toPrettyYaml.stringify(testCase.requestBody) + "\n"
        + "Expected Response Body: " + toPrettyYaml.stringify(testCase.responseBody) + "\n"
        + "Actual Response Body: " + toPrettyYaml.stringify(response.body.ResponseWrapper)

      );
    });
  });

  it("TC-67 | Phone number with special characters", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "67");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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
      Cypress.Allure.reporter
      .getInterface()
      .description(
        testCase.description + "\n\n"
        + "<b>Request Body:</b> \n" + toPrettyYaml.stringify(testCase.requestBody) + "\n\n"
        + "<b>Expected Response Body:</b> \n" + toPrettyYaml.stringify(testCase.responseBody) + "\n\n"
        + "<b>Actual Response Body:</b> \n" + toPrettyYaml.stringify(response.body.ResponseWrapperSendOtpDto)

      );
    });
  });

  it("TC-68 | Long phone number", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "68");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-69 | Short phone number", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "69");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-70 | Alphanumeric phone number", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "70");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-71 | Phone number not string", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "71");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-72 | Email without @", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "72");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-73 | Email w/ more @", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "73");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-74 | Long email", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "74");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-75 | Email not string", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "75");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-76 | Email with special characters", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "76");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-77 | Sending OTP with missing bank code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "77");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-78 | Sending OTP with inexistant bank code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "78");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-79 | Bank code w/ special characters", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "79");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-80 | Bank code not string", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "80");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-81 | Long bank code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "81");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-82 | Sending OTP with missing language code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "82");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-83 | Language code w/ special characters", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "83");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-84 | Language code not a string", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "84");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-85 | Inexistant language code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "85");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-86 | Missing customerId", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "86");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  it("TC-87 | Long language code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "87");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
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

  afterEach(() => {
    const updatedOtpData = Cypress.env("updatedOtpData");
    if (updatedOtpData) {
      cy.log("Writing updated OTP data to file");
      cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
    }
  });
});
