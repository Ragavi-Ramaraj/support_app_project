///<reference types="cypress" />

describe('Users', () => {

    let supportInfo
  
    beforeEach(() => {
      cy.fixture("data_repo.json").then((data_repo => {
        supportInfo = data_repo
      }))
      cy.login()
    })
  
    it('Create Support User', () => {
  
      cy.visit('/')
  
      cy.contains('span', 'Menu').click()
      cy.contains('h2', 'Users').click()
      cy.url().should('include', '/users')

        //Create user

        //Enter support user email
        cy.contains('button','Create support user').should('exist').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-title"]').should('exist').should('contain','User email')
        cy.get('#email').should('exist').click().type(supportInfo.UnknownName)
        cy.get('#ModalButton').should('be.disabled')
        cy.get('#email').should('exist').click().clear().type(supportInfo.SupportUser)
        cy.get('#ModalButton').should('be.enabled').click()
        //Add roles
        cy.get('[data-cy="generic-modal-title"]').should('exist').should('contain','Allowed Roles')
        cy.get('[title="Lyric HAP - Clay Support"]').click()
        cy.contains('li','Lyric').find('button').contains('Clear').click()
        cy.get('[title="Lyric HAP - Support Finance"]').click()
        cy.get('[title="Dekra Test - Clay Support"]').click()
        cy.get('[title="Core Regression - Support finance"]').click()
        cy.get('#ModalButton').should('be.enabled').click()
        //Add countries
        cy.get('[data-cy="generic-modal-title"]').should('exist').should('contain','Allowed Countries')
        cy.get('[data-testid="list-item-checkbox"]').contains(supportInfo.SupportUserCountry1).click()
        cy.get('[placeholder="Search countries"]').should('exist').click().type(supportInfo.CollectionCountryCode)
        cy.get('[data-testid="list-item-checkbox"]').contains(supportInfo.SupportUserCountry2).click()
        cy.get('#ModalButton').should('be.enabled').click()
        //Create
        cy.get('[data-cy="generic-modal-title"]').should('exist').should('contain','User overview')
        cy.contains('#ModalButton','Create').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'User created')

    })

    it('Support User actions', () => {
  
        cy.visit('/')
    
        cy.contains('span', 'Menu').click()
        cy.contains('h2', 'Users').click()
        cy.url().should('include', '/users')

        //Search the newly created user
        cy.get('[placeholder="Search a name or e-mail address"]').should('exist').click().type(supportInfo.SupportUser)
        cy.get('tr').should('have.length','2')
        cy.get('td').should('contain','3 roles')
        cy.get('td').should('contain','AL, AU')
        cy.get('td').find('a').should('have.attr', 'href').and("contain", '/users')
        cy.contains('td',supportInfo.SupportUser).click()

        //Edit roles
        cy.contains('button','Change roles').should('exist').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-header"]').should('contain','Change roles').should('exist')
        cy.get('[title="Lyric HAP - Support View Only"]').click()
        cy.contains('#ModalButton','Save changes').click()
        cy.get('#client-snackbar').should('exist').should('include.text', 'Successfully changed the roles')
        
        //Edit countries
        cy.contains('button','Change countries').should('exist').should('be.enabled').click({force:true})
        cy.get('[data-cy="generic-modal-header"]').should('contain','Edit allowed countries').should('exist')
        cy.get('[placeholder="Search countries"]').should('exist').click().type(supportInfo.SupportUserCountry3)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length','1').should('contain',supportInfo.SupportUserCountry3).click()
        cy.contains('#ModalButton','Save changes').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Allowed countries successfully updated.')

        //Resend Invite
        cy.contains('button','Resend Invite').should('exist').should('be.enabled').click({force:true})
        cy.get('#client-snackbar').should('exist').should('have.text', 'Invite successfully sent')

        //Delete user
        cy.contains('button','Delete user').should('exist').should('be.enabled').click({force:true})
        cy.get('[data-cy="generic-modal-header"]').should('contain','Remove User').should('exist')
        cy.contains('#ModalButton','Yes, remove').should('exist').should('be.enabled').click()
})
})
