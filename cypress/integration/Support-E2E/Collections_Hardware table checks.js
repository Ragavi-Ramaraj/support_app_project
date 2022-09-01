///<reference types="cypress" />

describe('Collections_Hardware table checks', () => {

    let supportInfo

    beforeEach(() => {
        cy.Get_Rf_Data()
        cy.Get_Iq_Tree()
        cy.fixture("data_repo.json").then((data_repo => {
            supportInfo = data_repo
        }))
        cy.login()
    })

    it('Online & Offline IQ filtering', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Filter the online & offline IQs
        cy.get('div').find('h1').should('have.text', 'Search for an IQ')
        cy.get('div').find('[aria-haspopup="listbox"]').should('contain', 'All')
        cy.get('table').contains('td', supportInfo.IqMac).should('exist')

        cy.get('div').find('[aria-haspopup="listbox"]').click()
        cy.contains('[data-value="0"]', 'Offline').click()
        cy.get('table').contains('td', 'No IQs found').should('exist')

        cy.get('div').find('[aria-haspopup="listbox"]').click()
        cy.contains('[data-value="1"]', 'Online').click()
        cy.get('table').contains('td', supportInfo.IqMac).should('exist')

    })

    it('Search field filtering', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        cy.get('[placeholder="Search mac address, customer reference"]').should('exist').should('be.enabled')

        cy.get('td').should('exist').should('contain', supportInfo.IqMac)

        //Search with valid & invalid IQ mac address
        cy.get('[placeholder="Search mac address, customer reference"]').click().type('0B.7')
        cy.get('td').should('exist').should('contain', supportInfo.IqMac)
        cy.get('button[title="Clear"]').click()

        cy.get('[placeholder="Search mac address, customer reference"]').click().type('.7E.')
        cy.get('td').should('exist').should('contain', supportInfo.IqMac)
        cy.get('button[title="Clear"]').click()

        cy.get('[placeholder="Search mac address, customer reference"]').click().type('904%')
        cy.get('td').should('exist').should('contain', 'No IQs found')
        cy.get('button[title="Clear"]').click()

        //Search with valid & invalid IQ customer reference
        cy.get('[placeholder="Search mac address, customer reference"]').click().type(supportInfo.UnknownName)
        cy.get('td').should('exist').should('contain', 'No IQs found')
        cy.get('button[title="Clear"]').click()

        cy.get('div').find('[aria-haspopup="listbox"]').click()
        cy.contains('[data-value="0"]', 'Offline').click()
        cy.get('td').should('exist').should('contain', 'No IQs found')
        cy.get('[placeholder="Search mac address, customer reference"]').click().type('Auto test').wait(1000)
        cy.get('td').should('exist').should('contain', 'No IQs found')
        cy.get('button[title="Clear"]').click()

        cy.get('div').find('[aria-haspopup="listbox"]').click()
        cy.contains('[data-value="1"]', 'Online').click()
        cy.contains('td', supportInfo.IqMac).should('exist')
        cy.get('[placeholder="Search mac address, customer reference"]').click().type(' test').wait(1000)
        cy.get('td').should('exist').should('contain', 'No IQs found')
        cy.get('button[title="Clear"]').click()

    })

    it('Hardware tree data check', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Check the IQ data
        cy.get('td p').should('exist').should('contain', supportInfo.IqName)
        cy.get('td>span').should('contain', supportInfo.IqMac)
        cy.get('td>span').should('contain', supportInfo.IqRfChannel)
        cy.get('td>span').should('contain', supportInfo.IqStatus)
        cy.get('td>p').should('contain', supportInfo.ConnectedTo)

        //Expand the tree and check the Lock data
        cy.scrollTo(0, 500)
        cy.wait(3000)
        cy.get('td svg').eq(1).click()
        cy.get('td p').should('exist').should('contain', supportInfo.LockName)
        cy.get('td>strong').should('contain', supportInfo.LockMac)
        cy.get('td>div').should('contain', supportInfo.IqName)

    })

    it('Hardware table icons and tool tip messages', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Expand the IQ tree
        cy.scrollTo(0, 500)
        cy.wait(3000)
        cy.get('td svg').eq(1).click()
        cy.get('td p').should('exist').should('contain', supportInfo.LockName)
        cy.get('td>strong').should('contain', supportInfo.LockMac)
        cy.get('td>div').should('contain', supportInfo.IqName)

        //Check the visibility of the hardware icons in table
        cy.get('div').find('[title="IQs"]').click().should('contain', '1')
        cy.get('div').find('[title="Locks"]').should('contain', '1')
        cy.get('div').find('[title="Repeaters"]').should('contain', '1')
        cy.get('div').find('[title="An IQ is in the installer mode when it needs modification by the installer. Installer mode can only be initiated by a site admin or a site owner. Installer mode ends when the installer releases the installation or the installer access on the IQ expires which happens 24 hours after the access has been granted."]').should('exist')
        cy.get('span').should('contain', 'Last 4 columns show: "Last 24 hours" vs "Last 7 days"')

        //Check the visibility of the tool tip messages
        cy.get('[title="The first number is last 24 hours, the second number is last 7 days. The last 24 hours is included in the last 7 days."]').should('have.length', 4)
        cy.contains('h4', 'Status').trigger('mouseover')
        cy.contains('h4', 'Connected to').trigger('mouseover')
        cy.contains('h4', 'RF').trigger('mouseover')
        cy.contains('h4', 'RTO').trigger('mouseover')
        cy.contains('h4', 'OA').trigger('mouseover')
        cy.contains('h4', 'LE').trigger('mouseover')
        cy.contains('h4', 'IQ reconn.').trigger('mouseover')
        cy.contains('p', supportInfo.LockName).trigger('mouseover')
        cy.reload()
        cy.contains('p', supportInfo.IqName).should('be.visible')

    })

    it('Add IQ to group', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        cy.get('td p').should('be.visible')

        //Open group screen
        cy.get('input[type="checkbox"]').eq(0).click()
        cy.get('div').find('p').should('contain', 'You can add these IQ’s to Group.')
            .should('contain', 'Groups are used for scheduling updates for IQs.')

        //Close group screen
        cy.get('input[type="checkbox"]').eq(0).click()
        cy.get('div').find('p').should('exist').should('not.contain', 'You can add these IQ’s to Group.')
            .should('not.contain', 'Groups are used for scheduling updates for IQs.')

        //Open again and add IQ
        cy.get('input[type="checkbox"]').eq(0).click()
        cy.get('div').find('p').should('exist').should('contain', 'You can add these IQ’s to Group.')
            .should('contain', 'Groups are used for scheduling updates for IQs.')
        cy.get('[placeholder="Search groups"]').type(supportInfo.IqMac)
        cy.get('ul>li[data-testid="list-item-checkbox"]').contains(supportInfo.IqMac).click()
        cy.contains('button', 'Add to selected groups').click()
        cy.get('#client-snackbar').should('exist').should('have.text', 'IQs successfully added.')

    })

    it('Verify the link to the IQ page', () => {

        cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

        //Click the IQ name link
        cy.get('td a').should('contain', supportInfo.IqName).click()
        cy.url().should('include', '/iqs/' + supportInfo.IqId + '/details')
    })
})
