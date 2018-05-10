require('chai').should()
const slashCommands = require('../core/slash-commands')
const shopify = require('../services/shopify')
const travie = require('../services/travie')
const rp = require('request-promise')

const TEST_COUNT = 1000

describe('test', () => {
  describe('transform EKE to Travie format', () => {
    it.skip('should transform EKE to Travie format and post into Travie', async () => {
      let url = 'http://kepersona-lb.eastasia.cloudapp.azure.com/php-mongo-poi/api.php'

      let options = {
        uri: url,
        headers: {
          'Accept': 'application/json'
        },
        json: true // Automatically parses the JSON string in the response
      }

      let ekeObject = await rp.get(options)
      await travie.transformEKEPOIToTravieObjectAndThenUpload(ekeObject)
    })

    it.skip('should update the tags of a specific POI_ID with new tags array - First lot', async () => {
      await travie.updateEKETags(1, ['SCIENCE/TECHNOLOGY', 'CULTURE', 'BUSINESS', 'INNOVATIVE', 'SUSTAINABLE']) // Energizing Kowloon East office
      await travie.updateEKETags(2, ['FAMILY', 'LEISURE/PARK']) // Sensory Garden
      await travie.updateEKETags(3, ['FAMILY', 'LEISURE/PARK', 'ROMANCE']) // Kai Tak Runway Park
      await travie.updateEKETags(4, ['HISTORY']) // Kwun Tong Public Pier
      await travie.updateEKETags(5, ['FAMILY', 'LEISURE/PARK', 'FOOD/DRINKS', 'NEW ESTABLISHMENT']) // Kai Tak Cruise Terminal
      await travie.updateEKETags(6, ['SPORTS', 'HISTORY']) // Kwun Tong Typhoon Shelter
      await travie.updateEKETags(7, ['NEW ESTABLISHMENT', 'SCIENCE/TECHNOLOGY', 'INNOVATIVE', 'SUSTAINABLE']) // Zero Carbon Building
      await travie.updateEKETags(8, ['NEW ESTABLISHMENT']) // Hong Kong Children’s Hospital
    })

    it.skip('should update the tags of a specific POI_ID with new tags array - 2nd lot because of max timeout', async () => {
      await travie.updateEKETags(9, ['FAMILY', 'LEISURE/PARK', 'NEW ESTABLISHMENT', 'ROMANCE']) // Tsun Yip Playround
      await travie.updateEKETags(10, ['LEISURE/PARK', 'SPORTS', 'NEW ESTABLISHMENT', 'ROMANCE']) // Shing Fung Road
      await travie.updateEKETags(11, ['LEISURE/PARK', 'FOOD/DRINKS', 'ENTERTAINMENT']) // FF01
      await travie.updateEKETags(12, ['HISTORY']) // Kowloon Flour Mills Building
      await travie.updateEKETags(13, ['HISTORY', 'NEW ESTABLISHMENT', 'ART/DESIGN']) // Sui Bing Lane
      await travie.updateEKETags(14, ['FAMILY', 'LEISURE/PARK', 'SPORTS', 'NEW ESTABLISHMENT']) // Kowloon Cycling Park
      await travie.updateEKETags(15, ['HISTORY', 'ART/DESIGN']) // Switch Boxes as Urban Design Installations
      await travie.updateEKETags(16, ['FAMILY', 'LEISURE/PARK', 'ROMANCE', 'NIGHTLIFE']) // Kwun Tong Promenade Light Show
    })

    it.skip('should submit questionnaire score', async () => {
      await travie.submitEKEQuestionnaireScore(1)
    })

    it.skip('should generate a single journey based on deviceID of 12345', async () => {
      let loopNumber = 1000

      let tallyMap = {}
      for (let i = 0; i < loopNumber; i++) {
        // let response = await travie.generateJourney('111')
        // let response = await travie.generateJourney('222')
        // let response = await travie.generateJourney('abcdefgh12345')
        let response = await travie.generateJourney('104868739980307')
        travie.tallyPlan(response, tallyMap)
      }
      // tallyMap = tallyMap.sort((l, r) => { return tally[r] > tallyMap[l]})

      const keysMap = Object.keys(tallyMap).sort(function (a, b) { return tallyMap[b] - tallyMap[a] })
      keysMap.forEach((title) => {
        console.log(`${title} - ${tallyMap[title]}`)
      })
    })

    it.skip('should generate 1000 journeys based on low energy', async () => {
      let loopNumber = TEST_COUNT

      let tallyMap = {}
      for (let i = 0; i < loopNumber; i++) {
        let response = await travie.generateJourney('LOW_ENERGY')
        // let response = await travie.generateJourney('104868739980307')
        travie.tallyPlan(response, tallyMap)
      }
      // tallyMap = tallyMap.sort((l, r) => { return tally[r] > tallyMap[l]})

      const keysMap = Object.keys(tallyMap).sort(function (a, b) { return tallyMap[b] - tallyMap[a] })
      keysMap.forEach((title) => {
        console.log(`${title} - ${tallyMap[title]}`)
      })
    })

    it.skip('should generate 1000 journeys based on medium energy', async () => {
      let loopNumber = TEST_COUNT

      let tallyMap = {}
      for (let i = 0; i < loopNumber; i++) {
        let response = await travie.generateJourney('MEDIUM_ENERGY')
        travie.tallyPlan(response, tallyMap)
      }
      // tallyMap = tallyMap.sort((l, r) => { return tally[r] > tallyMap[l]})

      const keysMap = Object.keys(tallyMap).sort(function (a, b) { return tallyMap[b] - tallyMap[a] })
      keysMap.forEach((title) => {
        console.log(`${title} - ${tallyMap[title]}`)
      })
    })

    it.skip('should generate 1000 journeys based on high energy', async () => {
      let loopNumber = TEST_COUNT

      let tallyMap = {}
      for (let i = 0; i < loopNumber; i++) {
        let response = await travie.generateJourney('HIGH_ENERGY')
        travie.tallyPlan(response, tallyMap)
      }

      const keysMap = Object.keys(tallyMap).sort(function (a, b) { return tallyMap[b] - tallyMap[a] })
      keysMap.forEach((title) => {
        console.log(`${title} - ${tallyMap[title]}`)
      })
    })
  })

  describe('Command execution', () => {
    // 20170320: Skipping as Shopify is breaking at the moment
    it.skip('should show shopify object successfully', async () => {
      const result = await slashCommands.interpretCommand('/show shopify 9245647181')
      result.textResult.should.equal('Yikai 1st product')
    })
  })

  describe('Travie', () => {
    describe.skip('Locations', () => {
      it('should add a new location of name="yikai new location"', async () => {
        let newTravieAttraction = {
          title: 'yikai new location',
          address: 'yikai new address',
          imageURL: 'https://cdn2.gbot.me/photos/Uy/H8/1439907677/-Postcard_of_Sushi_wagocor-20000000009180373-240x180.jpg'
        }
        try {
          await travie.addNewTravieAttraction(newTravieAttraction)
          let response = await travie.getTravieAttractionByName('yikai new location')
          response.title.should.equal('yikai new location')
          response.address.should.equal('yikai new address')
        } catch (err) {
          console.log('error is: ', err)
        }
      })

      it('should get "yikai new location" when an ID of 58cfb30107ce80428eb2343b is entered into the Get function',
        async function () {
          const returnBody = await travie.getTravieAttractionByID('58cfb30107ce80428eb2343b')
          returnBody.title.should.equal('yikai new location')
        })

      it('should fail when an ID of 5888a820f66c8c6c515e4026invalid is entered', function (done) {
        travie.getTravieAttractionByID('5888a820f66c8c6c515e4026invalid').then(function (returnBody) {
          throw new Error('unexpected pass')
        }).catch(function (e) {
          e.message.should.not.equal('unexpected pass')
          e.error.error.statusCode.should.equal(404)
          e.error.error.message.should.equal('Unknown "Location" id "5888a820f66c8c6c515e4026invalid".')
          done()
        })
      })

      it('should return true when trying to find a location ID of 58cfb30107ce80428eb2343b', function (done) {
        travie.checkIfTravieAttractionExists('58cfb30107ce80428eb2343b').then(function (returnBody) {
          returnBody.exists.should.equal(true)
          done()
        })
      })

      it('should return false when trying to find a location ID of 5888a820f66c8c6c515e4026abcdefg', (done) => {
        travie.checkIfTravieAttractionExists('5888a820f66c8c6c515e4026abcdefg').then(function (returnBody) {
          returnBody.exists.should.equal(false)
          done()
        })
      })
      it('should update the name property of attraction ID <58cfb30107ce80428eb2343b> to Ocean Park - new name', (done) => {
        travie.updateTravieAttractionName('58cfb30107ce80428eb2343b', 'Ocean Park - new name').then(function (returnBody) {
          returnBody.title.should.equal('Ocean Park - new name')
          // returnBody.longitude.should.equal(114.17436)
          // returnBody.city.should.equal('hongkong')
          done()
        })
      })
      it('should update the name property of attraction ID <58cfb30107ce80428eb2343b> back to "yikai new location', (done) => {
        travie.updateTravieAttractionName('58cfb30107ce80428eb2343b', 'yikai new location').then(function (returnBody) {
          returnBody.title.should.equal('yikai new location')
          // returnBody.longitude.should.equal(114.17436)
          // returnBody.city.should.equal('hongkong')
          done()
        })
      })
    })

    describe.skip('Hotels/Flights', () => {
      it('should query hotels successfully', (done) => {
        travie.fetchHotels('巴黎', '2017-07-03', '2017-07-20').then((results) => {
          results.should.not.be.empty
          results[0].should.have.any.keys(['property_name', 'address', 'total_price', 'images', 'min_daily_rate'])
          done()
        })
      })

      it('should query flights successfully', (done) => {
        travie.fetchFlights('香港', '東京', '2017-07-03', '2017-07-20').then((results) => {
          results.should.not.be.empty
          results[0].itineraries.should.exist
          results[0].itineraries[0].outbound.should.exist
          results[0].itineraries[0].outbound.flights.should.exist
          results[0].itineraries[0].outbound.flights[0].departs_at.should.exist
          results[0].itineraries[0].outbound.flights[0].arrives_at.should.exist
          results[0].itineraries[0].outbound.flights[0].origin.should.exist
          results[0].itineraries[0].outbound.flights[0].destination.should.exist
          results[0].itineraries[0].outbound.flights[0].operating_airline.should.exist
          results[0].itineraries[0].outbound.flights[0].flight_number.should.exist
          results[0].itineraries[0].outbound.flights[0].booking_info.should.exist
          results[0].itineraries[0].outbound.flights[0].booking_info.travel_class.should.exist
          results[0].itineraries[0].outbound.flights[0].booking_info.seats_remaining.should.exist
          results[0].itineraries[0].inbound.should.exist
          results[0].itineraries[0].inbound.flights.should.exist
          results[0].itineraries[0].inbound.flights[0].departs_at.should.exist
          results[0].itineraries[0].inbound.flights[0].arrives_at.should.exist
          results[0].itineraries[0].inbound.flights[0].origin.should.exist
          results[0].itineraries[0].inbound.flights[0].destination.should.exist
          results[0].itineraries[0].inbound.flights[0].operating_airline.should.exist
          results[0].itineraries[0].inbound.flights[0].flight_number.should.exist
          results[0].itineraries[0].inbound.flights[0].booking_info.should.exist
          results[0].itineraries[0].inbound.flights[0].booking_info.travel_class.should.exist
          results[0].itineraries[0].inbound.flights[0].booking_info.seats_remaining.should.exist
          results[0].fare.should.exist
          results[0].fare.total_price.should.exist
          results[0].fare.price_per_adult.should.exist
          results[0].fare.price_per_adult.total_fare.should.exist
          results[0].fare.price_per_adult.tax.should.exist
          results[0].fare.restrictions.should.exist
          results[0].fare.restrictions.refundable.should.exist
          results[0].fare.restrictions.change_penalties.should.exist
          done()
        })
      })
    })
  })

  // 20170320: Skipping as Shopify is breaking at the moment
  describe('Shopify', () => {
    describe('Products', () => {
      it.only('should get "Yikai 1st product" product name when an ID of 9245647181 is entered', (done) => {
        shopify.getShopifyProductNameByID(9245647181).then(function (returnBody) {
          returnBody.title.should.equal('Yikai 1st product')
          done()
        })
      })
      it('should fail with 400 bad request upon retrieving invalid ID', (done) => {
        let invalidID = 'invalidID'
        shopify.getShopifyProductNameByID(invalidID).then(function (returnBody) {
          throw new Error('unexpected pass')
        }).catch(function (e) {
          e.message.should.not.equal('unexpected pass')
          e.message.should.equal('Response code 400 (Bad Request)')
          e.statusMessage.should.equal('Bad Request')
          done()
        })
      })
      it('should succeed to update product quantity to 2 when an ID of 9245647181 and quantity of 2 is entered', (done) => {
        shopify.updateShopifyProductQuantityByID(9245647181, 2).then(function (returnBody) {
          returnBody.variants[0].inventory_quantity.should.equal(2)
          done()
        }).catch(function (e) {
          throw e
        })
      })
      it('should update product quantity to 1 when an ID of 9245647181 and quantity of 1 is entered', (done) => {
        shopify.updateShopifyProductQuantityByID(9245647181, 1).then(function (returnBody) {
          returnBody.variants[0].inventory_quantity.should.equal(1)
          done()
        }).catch(function (e) {
          throw e
        })
      })
    })
  })
})
