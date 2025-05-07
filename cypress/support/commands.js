Cypress.Commands.add("updateOtpData", (otpData, response, testCaseId) => {
  const updatedOtpData = otpData.map((tc) =>
    tc.testCaseId === testCaseId
      ? {
          ...tc,
          responseBody: {
            ...tc.responseBody,
            data: {
              ...tc.responseBody.data,
              identifier: response,
            },
          },
        }
      : tc
  );

  cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
});
