///<reference types="cypress" />

describe('Installer Companies', () => {

    let supportInfo

    beforeEach(() => {
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    after(() => {
        cy.Transfer_Installations()
    })

    it('Create Installer company', () => {

        cy.visit('/')

        //Navigate to installer companies page
        cy.contains('span', 'Menu').click()
        cy.contains('h2', 'Installer companies').click()
        cy.url().should('include', '/installer-companies')

        //Create installer company

        //Company details
        cy.contains('button', 'Create installer company').should('exist').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Company communication details').should('exist')
        cy.get('#name').click().type(supportInfo.CompanyName)
        cy.get('#ModalButton').should('be.enabled')
        cy.get('#phone').click().type(supportInfo.CompanyPhoneNumber)
        cy.get('#email').click().type(supportInfo.CompanyEmail + Date.now() + "@my-clay.com")
        cy.get('#website').click().type(supportInfo.CompanyWebsite)
        cy.get('#ModalButton').click()

        //Address details
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Company address details')
        cy.get('#street').click().type(supportInfo.CompanyStreet)
        cy.get('#postCode').click().type(supportInfo.CompanyPostCode)
        cy.get('[placeholder="Country"]').click().type(supportInfo.CompanyCountry).wait(3000).type('{downArrow}').type('{enter}')
        cy.get('#city').click().type(supportInfo.CompanyCity)
        cy.get('#ModalButton').click()

        //Allowed tenants
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Allowed tenants')
        cy.get('[placeholder="Search by tenant name"]').click().type(supportInfo.CompanyTenant1)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', '1')
        cy.get('[title="Clay HAP"]').should('exist').click()

        cy.get('[data-testid="clear-icon"]').click()
        cy.get('#ModalButton').click()

        //Allowed countries
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Allowed countries')
        cy.get('[placeholder="Search countries"]').click().type(supportInfo.CompanyCountry)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', '1')
        cy.get('[title="Japan"]').should('exist').click()

        cy.get('[data-testid="clear-icon"]').click()
        cy.get('#ModalButton').click()

        //Installer admin
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Installer admin')
        cy.get('#admin').click().type(supportInfo.CompanyInstallerAdmin + Date.now() + "@my-clay.com")
        cy.get('#ModalButton').click()

        //Overview
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Company overview')

        cy.get('#CommunicationDetailsSummaryItemContent').find('li').should('contain', supportInfo.CompanyName)
            .should('contain', supportInfo.CompanyPhoneNumber)
            .should('contain', supportInfo.CompanyEmail)
            .should('contain', supportInfo.CompanyWebsite)

        cy.get('#AddressDetailsSummaryItemContent').should('exist')
            .should('contain', supportInfo.AddressOverview)

        cy.get('#AllowedTenantsItemContent').should('exist').should('contain', supportInfo.TenantNamesOverview1)

        cy.get('#AllowedCountriesItemContent').should('exist').should('contain', supportInfo.CompanyCountry)

        cy.get('#InstallerAdminItemContent').should('exist').should('contain', supportInfo.CompanyInstallerAdmin)

        //Edit
        cy.contains('div', 'Allowed tenants').find('[type="button"]').click()

        cy.get('[placeholder="Search by tenant name"]').click().type(supportInfo.CompanyTenant2)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', '1')
        cy.get('[title="Salto Key as a Service"]').should('exist').click()

        cy.get('#ModalButton').click()

        //Create
        cy.get('#AllowedTenantsItemContent').should('exist').should('contain', supportInfo.TenantNamesOverview2)

        cy.contains('#ModalButton', 'Create').should('be.enabled').click({force:true})

        cy.get('#client-snackbar').should('exist').should('have.text', 'Company is created, installers are invited.')

    })

    it('Installer company level actions', () => {

        cy.visit('/' + 'installer-companies')

        //Search installer company name
        cy.get('[placeholder="Search by company name"]').click().type(supportInfo.CompanyName)
        cy.get('td p').should('exist')
        //Navigate to company overview page
        cy.get('tr').should('contain', supportInfo.CompanyName)
            .find('td').eq(0).click()

        //Company overview
        cy.url().should('include', '/overview')

        //Edit communication details
        cy.contains('button', 'Edit details').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Edit company communication details')
        cy.get('#customerReference').click().type(supportInfo.InstallerCompanyName)
        cy.contains('button', 'Save changes').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Installer company successfully updated.')

        //Edit tenants
        cy.contains('button', 'Edit allowed tenants').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Edit allowed tenants')
        cy.get('[placeholder="Search by tenant name"]').click().type(supportInfo.CompanyTenant3)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', '1')
        cy.get('[title="Prosegur"]').should('exist').click()
        cy.contains('button', 'Save changes').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Allowed tenants successfully updated')

        //Edit countries
        cy.contains('button', 'Edit allowed countries').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Edit allowed countries')
        cy.get('[placeholder="Search countries"]').click().type(supportInfo.InstallerCompany)
        cy.get('[data-testid="list-item-checkbox"]').should('have.length', '1')
        cy.get('[title="Egypt"]').should('exist').click()
        cy.contains('button', 'Save changes').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Allowed countries successfully updated.')

        cy.contains('span', 'Menu').click()
        cy.contains('h2', 'Installer companies').click()

        //Search installer company name
        cy.get('[placeholder="Search by company name"]').click().type(supportInfo.TransferInstallationCompanyA)
        cy.get('tr').should('have.length', '2')
        cy.get('td').eq(0).should('contain', supportInfo.TransferInstallationCompanyA).click()

        cy.url().should('include', '/overview')

        //Change contact
        cy.contains('button', 'Change').should('exist').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Edit main contact person')
        cy.get('[placeholder="Select the main contact person"]').click().wait(3000).type('{downArrow}').type('{enter}')
        cy.contains('button', 'Save changes').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Main contact person updated.')

        //Transfer installations to another installer company

        cy.contains('button', 'Transfer installations').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Transfer installations')
        cy.get('[placeholder="Select company from the list"]').click().type(supportInfo.TransferInstallationCompanyB).wait(3000).type('{downArrow}').type('{enter}')
        cy.get('[placeholder="Select installer from the list"]').click().type(supportInfo.TransferInstallationCompanyBInstaller).wait(3000).type('{downArrow}').type('{enter}')
        cy.contains('#ModalButton', 'Continue').should('be.enabled').click()
        cy.get('[data-cy="generic-modal-subtitle"]').should('contain', 'Step 2 / 2')
        cy.contains('#ModalButton', 'Yes, transfer').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('exist')
        cy.contains('button', 'Transfer installations').should('be.disabled')

    })

    it('Installer company - Installer level actions', () => {

        cy.visit('/' + 'installer-companies')

        //Search installer company name

        cy.get('[placeholder="Search by company name"]').click().type(supportInfo.TransferInstallationCompanyB)
        cy.get('tr').should('have.length', '2')
        //Navigate to company overview page
        cy.get('td').eq(0).should('contain', supportInfo.TransferInstallationCompanyB).click()

        cy.url().should('include', '/overview')
        //Navigate to installers page
        cy.get('[role="tab"]').contains('span', 'Installers').click()

        //Search installer
        cy.get('[placeholder="Search a name or e-mail address"]').click().type(supportInfo.InstallerSearch)
        cy.get('tbody tr').should('have.length', '1')
        cy.get('td').eq(0).should('contain', supportInfo.TransferInstallationCompanyBEmail)
        cy.get('[title="Clear"]').click({force:true})

        //Delete installer admin
        cy.get('td').should('exist').find('button').click({force:true})
        cy.get('li').eq(11).focus().click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Delete Installer')
        cy.get('p').should('contain', "You can't delete the one and only installer admin.")
        cy.contains('#ModalButton', 'Delete installer').should('be.disabled')
        cy.get('[data-cy="modal-close-button-x"]').click()

        //Invite Installer
        cy.contains('button', 'Invite installer').should('exist').click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Invite installer')
        cy.get('[name="email"]').click().type(supportInfo.InviteInstallerEmail)
        cy.get('div').should('contain', 'Installer basic').find('[role="radiogroup"]').click()
        cy.contains('#ModalButton', 'Invite').click()
        cy.get('#client-snackbar').should('exist').should('have.text', "Installer '" + supportInfo.InviteInstallerEmail + "' invited.")
        cy.contains('tr', supportInfo.InviteInstallerEmail).should('exist')

        //Reinvite installer
        cy.contains('tr', supportInfo.InviteInstallerEmail).find('button').click({force:true})
        cy.get('li').eq(10).focus().click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Email has been sent to ' + supportInfo.InviteInstallerEmail)

        //Change role
        cy.contains('tr', supportInfo.InviteInstallerEmail).find('button').click({force:true})
        cy.get('li').eq(11).focus().click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Installer information')
        cy.contains('span', 'Installer admin').click({force:true})
        cy.contains('button', 'Save').should('be.enabled').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'Installer updated.')

        //Transfer installations to another installer
        cy.contains('tr', supportInfo.TransferInstallationCompanyBEmail).find('button').click({force:true})
        cy.get('li').eq(12).focus().click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Transfer installations')
        cy.contains('div', 'None selected').click()
        cy.contains('li', supportInfo.InviteInstallerEmail).click()
        cy.contains('#ModalButton', 'Continue').click()
        cy.get('[data-cy="generic-modal-subtitle"]').should('contain', 'Step 2 / 2')
        cy.contains('#ModalButton', 'Yes, transfer').click()
        cy.get('#client-snackbar').should('exist').should('have.text', "All '" + supportInfo.TransferInstallerName +
            "' installations have been transferred successfully to the installer '" + supportInfo.InviteInstallerEmail + "'.")

        cy.contains('tr', supportInfo.TransferInstallationCompanyBEmail).should('contain', '0').find('button').click({force:true})
        cy.get('li').eq(12).focus().click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Transfer installations')
        cy.get('p').should('contain', 'The selected installer has no installations assigned to them and no transfer is possible.')
        cy.get('[data-cy="modal-close-button-x"]').click({force:true})

        //Delete installer with installations, transfer & delete
        cy.contains('tr', supportInfo.InviteInstallerEmail).find('button').click({force:true})
        cy.get('li').eq(12).focus().click()
        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Delete Installer')
        cy.get('p').should('contain', "To transfer the installer’s installations you can click on the button below. Once the transfer is completed, you will be able to delete the installer.")
        cy.contains('#ModalButton', 'Continue to transfer').should('be.enabled').click()

        cy.get('[data-cy="generic-modal-title"]').should('contain', 'Transfer installations')
        cy.contains('div', 'None selected').click()
        cy.contains('li', supportInfo.TransferInstallerName).click()
        cy.contains('#ModalButton', 'Continue').click()
        cy.get('[data-cy="generic-modal-subtitle"]').should('contain', 'Step 2 / 2')
        cy.contains('#ModalButton', 'Yes, transfer and delete').click()
        cy.get('#client-snackbar').should('exist').should('have.text', "All '" + supportInfo.InviteInstallerEmail +
            "' installations have been transferred successfully to the installer '" + supportInfo.TransferInstallerName + "' and the installer '" + supportInfo.InviteInstallerEmail + "' has been deleted successfully.")

    })

})
