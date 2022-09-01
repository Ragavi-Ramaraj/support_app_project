Cypress.Commands.add('login', () => {
    cy.clearCookies()
    cy.session('my_session', () => {
        cy.visit('/')
        cy.get('#Email').type(Cypress.env('USEREMAIL'))
        cy.get('#Password').type(Cypress.env('PASSWORD'))
        cy.get('[type=submit]').click().wait(10000)
        cy.get("body").then($body => {
            if ($body.find("button#onetrust-accept-btn-handler").length == 0) {
                cy.log("Logged In")
            }
            else if ($body.find("button#onetrust-accept-btn-handler").length > 0) {   
                cy.contains('button','Accept All Cookies').click()
                cy.log("Accepted cookies and Logged In")
            }
        })
    })
  })
