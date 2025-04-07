describe("/api/v1/otp/verify test suite", () => {
    beforeEach(() => {
      cy.fixture("otp.json").as("otpData");
    });
  
    it("TC-71 | Verify OTP with valid data", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "71");
  
      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
        body: testCase.requestBody,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("status", "SUCCESS");
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.have.property("valid", true);
        expect(response.body.data).to.have.property(
          "message",
          testCase.responseBody.data.message
        );
      });
    });
  
    it("TC-72 | Verify OTP with expired OTP", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "72");
  
      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
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
  
    it("TC-73 | Verify an old OTP after creating a new one", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "73");
  
      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
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
  
    it("TC-74 | Verify OTP with nonexistent identifier", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "74");
  
      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
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
  
    it("TC-75 | Verify OTP with incorrect password", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "75");
  
      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
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
  
    it("TC-77 | Verify OTP with missing identifier", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "77");
  
      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
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
  
    it("TC-81 | Verify OTP with missing OTP", function () {
      const testCase = this.otpData.find((tc) => tc.testCaseId === "81");
  
      cy.request({
        method: "POST",
        url: "/api/v1/otp/verify",
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