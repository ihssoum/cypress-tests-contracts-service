describe("testing fixtures", ()=>{
    it("should update the mail in fixture", ()=>{
        cy.fixture("example").then((data)=>{
            data.email = "somethingssss@gmail.com"
            //cy.writeFile("cypress/fixtures/example.json", data)
        })
    })
})