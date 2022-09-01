///<reference types="cypress" />

describe('Collection_Details & Events count validation', () => {

  let supportInfo

  beforeEach(() => {
    cy.Get_Iq_Details()
    cy.fixture("data_repo.json").then((data_repo => {
      supportInfo = data_repo
    }))
    cy.login()
  })

  it('Verify collection details', () => {

    cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

    //Collections details
    cy.get('h2').should('contain', supportInfo.CollectionName)
    cy.get('div').should('contain', supportInfo.Tenant)
    cy.get('div').should('contain', supportInfo.Country)
    cy.dataCy('hardware-iqs').should('exist').should('contain', '1 IQ')
    cy.dataCy('hardware-repeaters').should('exist').should('contain', '1 Repeater')
    cy.dataCy('hardware-locks').should('exist').should('contain', '1 Lock')
    cy.dataCy('hardware-master-key').should('exist').should('contain', 'Master Key (UID: ' + supportInfo.TagNumber + ')')
    cy.get('p>a').should('have.attr', 'href').and("contain", '/tag-analysis/' + supportInfo.TagNumber + '/sites')

  })

  it('Generate average IQ reconnect event counts on the progress bar', () => {

    cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

    //Check the progress bar visibility
    cy.contains('div>span', 'Average IQ reconnects').should('exist')
      .get('[role="progressbar"]').should('be.visible')

    //Get the average IQ reconnect count
    cy.Average_Iq_reconnect_Events()

    //Check the counts in collection progress bar
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
    cy.get('span').should('contain', 'Last 24 hours - ' + supportInfo.iq_reconnect_events24h + ' times')
    cy.get('span').should('contain', 'Last 7 days - ' + supportInfo.iq_reconnect_events7d + ' times')
    })

  })

  it('Generate online and offline event counts on the progress bar', () => {

    cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

    //Check the progress bar visibility
    cy.contains('div>span', 'Offline events vs online events').should('exist')
      .get('[role="progressbar"]').should('be.visible')

    //Get the online & offline event count
    cy.Get_Iq_Online_Offline_Events()

    //Check the counts in collection progress bar
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
    cy.get('span').should('contain', 'Last 24 hours - ' + supportInfo.offline_access_count24h + ' vs ' + supportInfo.online_access_count24h)
    cy.get('span').should('contain', 'Last 7 days - ' + supportInfo.offline_access_count7d + ' vs ' + supportInfo.online_access_count7d)
    })

  })

  it('Generate rejected tag offline counts on the progress bar', () => {

    cy.visit('/collections/' + supportInfo.CollectionId + '/hardware?page=1')

    //Check the progress bar visibility
    cy.contains('div>span', 'Rejected tag offline stats').should('exist')
      .get('[role="progressbar"]').should('be.visible')

    //Get the rejected tag offline event count
    cy.Rejected_Tag_Access_Events()

    //Check the count in collection progress bar
    cy.readFile('cypress/fixtures/data_repo.json').then((supportInfo) => {
    cy.get('span').should('contain', 'Last 24 hours - ' + supportInfo.rejected_tag_offline_events24h + ' times')
    cy.get('span').should('contain', 'Last 7 days - ' + supportInfo.rejected_tag_offline_events7d + ' times')
    })
  })

})
