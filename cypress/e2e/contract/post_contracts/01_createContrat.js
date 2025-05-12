describe("/api/v1/contracts test suite", () => {
  beforeEach(function () {
    cy.fixture("contracts.json").then(function (contracts) {
      const data = contracts.map(function (tc) {
        if (
          ["94", "95", "96"].includes(
            tc.testCaseId
          )
        ) {
          tc.requestBody.contractRequest.customerId =
            contracts[0].customerId++ + "";
        }
        return tc;
      });
      Cypress.env("contractData", data);
      cy.writeFile(
        "cypress/fixtures/contracts.json",
        Cypress.env("contractData")
      );
    });
  });

  //   it.only("testing insertion in database", ()=>{
  //     const UUID = crypto.randomUUID();
  //     const randomId = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 999999
  //     const query = `
  //     INSERT INTO otp (
  //       PHONE_NUMBER, ID_CLIENT, EMAIL, ID, IDENTIFIANT, OTP_CODE, EXPIRES_AT,
  //       USED, CREATEDBYUSER, UPDATEDBYUSER, CREATEDON, UPDATEDON,
  //       VERSION, CODE_BANQUE_ASSOCIE, CODE_PAYS_ASSOCIE
  //     ) VALUES (
  //       '+21612345678', '123456', 'example@email.com', ${randomId}, '${UUID}', 555555,
  //       CURRENT_TIMESTAMP + INTERVAL '5' MINUTE, 1, 'abtbo', 'abtbo',
  //       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '00004', 'TN'
  //     )
  //   `;
  //     cy.task("verifyContractDetailsOtp", { query })
  //   })

  //   it("TC-94 | Valid contract with beneficiaries", () => {
  //     const testCase = Cypress.env("contractData").find(
  //       (tc) => tc.testCaseId === "94"
  //     );
  //     const UUID = crypto.randomUUID();
  //     const randomId = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 999999
  //     const query = `
  //     INSERT INTO otp (
  //       PHONE_NUMBER, ID_CLIENT, EMAIL, ID, IDENTIFIANT, OTP_CODE, EXPIRES_AT,
  //       USED, CREATEDBYUSER, UPDATEDBYUSER, CREATEDON, UPDATEDON,
  //       VERSION, CODE_BANQUE_ASSOCIE, CODE_PAYS_ASSOCIE
  //     ) VALUES (
  //       '+21612345678', ${testCase.requestBody.contractRequest.customerId}, 'example@email.com', ${randomId}, '${UUID}', 555555,
  //       CURRENT_TIMESTAMP + INTERVAL '5' MINUTE, 1, 'abtbo', 'abtbo',
  //       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '00004', 'TN'
  //     )
  //   `;
  //     cy.task("verifyContractDetailsOtp", { query });

  //     cy.request({
  //       method: "POST",
  //       url: "/api/v1/contracts?action=CREATE",
  //       body: testCase.requestBody,
  //       failOnStatusCode: false,
  //     }).then((response) => {
  //       expect(response.status).to.eq(201);
  //       expect(response.body.ResponseWrapperCreateContractDto).to.have.property(
  //         "status",
  //         "SUCCESS"
  //       );
  //       expect(
  //         response.body.ResponseWrapperCreateContractDto.data
  //       ).to.have.property("success", true);
  //       expect(
  //         response.body.ResponseWrapperCreateContractDto.data
  //       ).to.have.property("token");
  //     });
  //   });

  //   it("TC-95 | Create a contract with valid data w/o beneficiaries", () => {
  //     const testCase = Cypress.env("contractData").find(
  //       (tc) => tc.testCaseId === "95"
  //     );

  //     const UUID = crypto.randomUUID();
  //     const randomId = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 999999
  //     const query = `
  //     INSERT INTO otp (
  //       PHONE_NUMBER, ID_CLIENT, EMAIL, ID, IDENTIFIANT, OTP_CODE, EXPIRES_AT,
  //       USED, CREATEDBYUSER, UPDATEDBYUSER, CREATEDON, UPDATEDON,
  //       VERSION, CODE_BANQUE_ASSOCIE, CODE_PAYS_ASSOCIE
  //     ) VALUES (
  //       '+21612345678', ${testCase.requestBody.contractRequest.customerId}, 'example@email.com', ${randomId}, '${UUID}', 555555,
  //       CURRENT_TIMESTAMP + INTERVAL '5' MINUTE, 1, 'abtbo', 'abtbo',
  //       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '00004', 'TN'
  //     )
  //   `;
  //     cy.task("verifyContractDetailsOtp", { query });

  //     cy.request({
  //       method: "POST",
  //       url: "/api/v1/contracts?action=CREATE",
  //       body: testCase.requestBody,
  //       failOnStatusCode: false,
  //     }).then((response) => {
  //       expect(response.status).to.eq(201);
  //       expect(response.body.ResponseWrapperCreateContractDto).to.have.property(
  //         "status",
  //         "SUCCESS"
  //       );
  //       expect(
  //         response.body.ResponseWrapperCreateContractDto.data
  //       ).to.have.property("success", true);
  //       expect(
  //         response.body.ResponseWrapperCreateContractDto.data
  //       ).to.have.property("token");
  //     });
  //   });

  it("TC-96 | Create contract with a client that have an entreprise segment", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "96"
    );

    const UUID = crypto.randomUUID();
    const randomId = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 999999
    const query = `
    INSERT INTO otp (
      PHONE_NUMBER, ID_CLIENT, EMAIL, ID, IDENTIFIANT, OTP_CODE, EXPIRES_AT,
      USED, CREATEDBYUSER, UPDATEDBYUSER, CREATEDON, UPDATEDON,
      VERSION, CODE_BANQUE_ASSOCIE, CODE_PAYS_ASSOCIE
    ) VALUES (
      '+21612345678', ${testCase.requestBody.contractRequest.customerId}, 'example@email.com', ${randomId}, '${UUID}', 555555,
      CURRENT_TIMESTAMP + INTERVAL '5' MINUTE, 1, 'abtbo', 'abtbo',
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '00004', 'TN'
    )
  `;
    cy.task("verifyContractDetailsOtp", { query }).then(() => {
      cy.request({
        method: "GET",
        url: "http://localhost:3000/changeSegment",
      });

      cy.request({
        method: "POST",
        url: "/api/v1/contracts?action=CREATE",
        body: testCase.requestBody,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(500);
        expect(response.body.ResponseWrapper).to.have.property(
          "status",
          "ERROR"
        );
        expect(response.body.ResponseWrapper.error).to.have.property(
          "code",
          testCase.responseBody.error.code
        );
        expect(response.body.ResponseWrapper.error).to.have.property(
          "message",
          testCase.responseBody.error.message
        );

        cy.request({
          method: "GET",
          url: "http://localhost:3000/changeSegment",
        });
      });
    });
  });

  it("TC-97 | Create contract with a client that already has a contract", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "97"
    );

    const UUID = crypto.randomUUID();
    const randomId = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 999999
    const query = `
    INSERT INTO otp (
      PHONE_NUMBER, ID_CLIENT, EMAIL, ID, IDENTIFIANT, OTP_CODE, EXPIRES_AT,
      USED, CREATEDBYUSER, UPDATEDBYUSER, CREATEDON, UPDATEDON,
      VERSION, CODE_BANQUE_ASSOCIE, CODE_PAYS_ASSOCIE
    ) VALUES (
      '+21612345678', ${testCase.requestBody.contractRequest.customerId}, 'example@email.com', ${randomId}, '${UUID}', 555555,
      CURRENT_TIMESTAMP + INTERVAL '5' MINUTE, 1, 'abtbo', 'abtbo',
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '00004', 'TN'
    )
  `;
    cy.task("verifyContractDetailsOtp", { query });

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
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

//   it("TC-98 | Integration with CBS - Create contract with a client that doesn't exist in CBS", () => {
//     const testCase = Cypress.env("contractData").find(
//       (tc) => tc.testCaseId === "98"
//     );

//     const UUID = crypto.randomUUID();
//     const randomId = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 999999
//     const query = `
//     INSERT INTO otp (
//       PHONE_NUMBER, ID_CLIENT, EMAIL, ID, IDENTIFIANT, OTP_CODE, EXPIRES_AT,
//       USED, CREATEDBYUSER, UPDATEDBYUSER, CREATEDON, UPDATEDON,
//       VERSION, CODE_BANQUE_ASSOCIE, CODE_PAYS_ASSOCIE
//     ) VALUES (
//       '+21612345678', ${testCase.requestBody.contractRequest.customerId}, 'example@email.com', ${randomId}, '${UUID}', 555555,
//       CURRENT_TIMESTAMP + INTERVAL '5' MINUTE, 1, 'abtbo', 'abtbo',
//       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, '00004', 'TN'
//     )
//   `;
//     cy.task("verifyContractDetailsOtp", { query });

//     cy.request({
//       method: "POST",
//       url: "/api/v1/contracts?action=CREATE",
//       body: testCase.requestBody,
//       failOnStatusCode: false,
//     }).then((response) => {
//       expect(response.status).to.eq(400);
//       expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
//       expect(response.body.ResponseWrapper.error).to.have.property(
//         "code",
//         testCase.responseBody.error.code
//       );
//       expect(response.body.ResponseWrapper.error).to.have.property(
//         "status",
//         testCase.responseBody.ResponseWrapper.error
//       );
//     });
//   });

  it("TC-99 | Action parameter missing", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "99"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      //   expect(response.body.ResponseWrapper.error).to.have.property(
      //     "code",
      //     testCase.responseBody.ResponseWrapper.error
      //   );
      //   expect(response.body.ResponseWrapper.error).to.have.property(
      //     "message",
      //     testCase.responseBody.ResponseWrapper.error
      //   );
    });
  });

  it("TC-100 | Missing customerId", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "100"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      //   expect(response.body).to.have.property("error");
      //   expect(response.body.ResponseWrapper.error).to.have.property(
      //     "code",
      //     testCase.responseBody.ResponseWrapper.error
      //   );
      //   expect(response.body.ResponseWrapper.error).to.have.property(
      //     "message",
      //     testCase.responseBody.ResponseWrapper.error
      //   );
    });
  });

  it("TC-101 | Product code invalide", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "101"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
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

  it("TC-102 | Product code missing", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "102"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
    //   expect(response.body.ResponseWrapper.error).to.have.property(
    //     "code",
    //     testCase.responseBody.error.code
    //   );
    //   expect(response.body.ResponseWrapper.error).to.have.property(
    //     "message",
    //     testCase.responseBody.error.message
    //   );
    });
  });

  it("TC-103 | RIB Beneficiary Invalid", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "103"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
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

  it("TC-104 | Invalid action parameter", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "104"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE123",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.ResponseWrapper).to.have.property("status", "ERROR");
      expect(response.body.ResponseWrapper).to.have.property("error");
      //   expect(response.body.ResponseWrapper.error).to.have.property(
      //     "code",
      //     testCase.responseBody.ResponseWrapper.error
      //   );
      //   expect(response.body.ResponseWrapper.error).to.have.property(
      //     "message",
      //     testCase.responseBody.ResponseWrapper.error
      //   );
    });
  });

  it("TC-105 | Update with a customerId doesn't exist", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "105"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=UPDATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
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

  it("TC-106 | Invalid currency for beneficiary", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "106"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
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

  it("TC-107 | Create contract with an unverified customer", () => {
    const testCase = Cypress.env("contractData").find(
      (tc) => tc.testCaseId === "107"
    );

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
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
});
