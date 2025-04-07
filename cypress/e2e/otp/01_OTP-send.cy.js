describe("/api/v1/otp/send test suite", () => {
  beforeEach(() => {
    cy.fixture("otp.json").as("otpData");
  });

  it("TC-41 | Send a request for OTP with valid data", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "41");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("status", "SUCCESS");
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property(
        "email",
        testCase.responseBody.data.email
      );
      expect(response.body.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.data).to.have.property("identifier");
    });
  });

  it("TC-42 | Send another request with same number/email", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "42");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("status", "SUCCESS");
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property(
        "email",
        testCase.responseBody.data.email
      );
      expect(response.body.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.data).to.have.property("identifier");
    });
  });

  it("TC-44 | Sending OTP without phone number, email", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "44");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-46 | Sending OTP w/ Local Phone Number w/o mail", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "46");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "SUCCESS");
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.data).to.have.property("identifier");
    });
  });

  it("TC-47 | Sending OTP w/ Non-Local Phone Number w/o mail", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "47");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-48 | Sending OTP w/ Non-Local Phone Number w/ mail", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "48");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "SUCCESS");
      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property(
        "phoneNumber",
        testCase.responseBody.data.phoneNumber
      );
      expect(response.body.data).to.have.property("identifier");
    });
  });

  it("TC-61 | Sending OTP with missing bank code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "61");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-62 | Sending OTP with inexistant bank code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "62");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-66 | Sending OTP with missing language code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "66");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-69 | Sending OTP with missing language code", function () {
    const testCase = this.otpData.find((tc) => tc.testCaseId === "69");

    cy.request({
      method: "POST",
      url: "/api/v1/otp/send",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });
});
