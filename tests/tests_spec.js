var frisby = require("frisby");
var config = require("config");

//FDA Tests
var link = process.env.be_safe_host_name || config.be_safe_host_name+":"+config.server.port;

console.log('Testing Open FDA Recalls GET')
frisby.create('Testing Recalls GET')
   .get('https://api.fda.gov/drug/enforcement.json?')
      //.expectHeader('Content-Type', 'application/json; charset=utf-8')
      .expectStatus(200)
.toss();

console.log('Testing Open FDA Adverse Reaction Events GET')
frisby.create('Testing Adverse Reaction Events GET')
    .get('https://api.fda.gov/drug/event.json?')
    //.expectHeader('Content-Type', 'application/json; charset=utf-8')
    .expectStatus(200)
.toss();

//Events and Recall Tests
console.log('Testing Events GET')
frisby.create('Testing Events GET')
   .get(link+'/api/drugs?brand_name=ibuprofen&search_type=events')
      //.expectHeader('Content-Type', 'application/json')
      .expectStatus(200)
.toss();

console.log('Testing Recalls GET')
frisby.create('Testing Recalls GET')
    .get(link+'/api/drugs?brand_name=ibuprofen&search_type=recalls')
       //.expectHeader('Content-Type', 'application/json')
       .expectStatus(200)
.toss();

console.log('Testing Events GET With Valid Min Date')
frisby.create('Testing Events GET With Valid Min Date')
   .get(link+'/api/drugs?brand_name=ibuprofen&search_type=events&min_date=2014-01-01&max_date=2015-01-01')
      //.expectHeader('Content-Type', 'application/json')
      .expectStatus(200)
.toss();

console.log('Testing Recalls GET With Valid Min Date')
frisby.create('Testing Recalls GET With Valid Min Date')
    .get(link+'/api/drugs?brand_name=ibuprofen&search_type=recalls&min_date=2014-01-01&max_date=2015-01-01')
       //.expectHeader('Content-Type', 'application/json')
       .expectStatus(200)
.toss();

console.log('Testing Events GET With Valid Max Date')
frisby.create('Testing Events GET With Valid Min Date')
   .get(link+'/api/drugs?brand_name=ibuprofen&search_type=events&min_date=2014-01-01&max_date=2015-01-01')
      //.expectHeader('Content-Type', 'application/json')
      .expectStatus(200)
.toss();

console.log('Testing Recalls GET With Valid Max Date')
frisby.create('Testing Recalls GET With Valid Min Date')
    .get(link+'/api/drugs?brand_name=ibuprofen&search_type=recalls&min_date=2014-01-01&max_date=2015-01-01clear')
       //.expectHeader('Content-Type', 'application/json')
       .expectStatus(200)
.toss();

console.log('Testing Events GET With Valid Gender')
frisby.create('Testing Events GET With Valid Gender')
   .get(link+'/api/drugs?brand_name=ibuprofen&search_type=events&gender=M')
      //.expectHeader('Content-Type', 'application/json')
      .expectStatus(200)
.toss();

console.log('Testing Events GET With Valid Min Age')
frisby.create('Testing Events GET With Valid Min Age')
   .get(link+'/api/drugs?brand_name=ibuprofen&search_type=events&min_age=18&max_age=99')
      //.expectHeader('Content-Type', 'application/json')
      .expectStatus(200)
.toss();

console.log('Testing Events GET With Valid Max Age')
frisby.create('Testing Events GET With Valid Max Age')
   .get(link+'/api/drugs?brand_name=ibuprofen&search_type=events&max_age=40')
      //.expectHeader('Content-Type', 'application/json')
      .expectStatus(200)
.toss();

console.log('Testing All Email Subscription and Unsubscription')
frisby.create('Testing All Email Subscription PUT')
    .put(link+'/api/subscribe/jefferson.baker@buchanan-edwards.com', {
        brand_name: "asprin",
        min_date: 20140621,
        max_date: null,
        min_age: 39,
        max_age: 44,
        gender: 1
    })
        .expectHeader('Content-Type', 'application/json')
        .expectStatus(200)
        .afterJSON(function (api) {
          var email = api.response; //Need to know what part of the response contains the email
            frisby.create('Testing All Email Subscription DELETE')
               .delete(link+'/api/drug/subscribe/all?jefferson.baker@buchanan-edwards.com')
                   .expectStatus(200)
                   .toss();
        })
.toss();

//Subscription Tests

console.log('Testing Recall Email Subscription and Unsubscription')
frisby.create('Testing Recall Email Subscription POST')
    .put(link+'/api/drug/subscribe/recalls?jefferson.baker@buchanan-edwards.com', {
        brand_name: "asprin",
        min_date: 20140621,
        max_date: null,
        min_age: 39,
        max_age: 44,
        gender: 1
    })
        .expectHeader('Content-Type', 'application/json')
        .expectStatus(200)
        .afterJSON(function (api) {
          var email = api.response; //Need to know what part of the response contains the email
            frisby.create('Testing Recall Email Subscription DELETE')
               .delete(link+'/api/drug/subscribe/recalls?jefferson.baker@buchanan-edwards.com')
                   .expectStatus(200)
                   .toss();
        })
.toss();

console.log('Testing Events Email Subscription and Unsubscription')
frisby.create('Testing Events Email Subscription POST')
    .put(link+'/api/drug/subscribe/recalls?jefferson.baker@buchanan-edwards.com', {
        brand_name: "asprin",
        min_date: 20140621,
        max_date: null,
        min_age: 39,
        max_age: 44,
        gender: 1
    })
        .expectHeader('Content-Type', 'application/json')
        .expectStatus(200)
        .afterJSON(function (api) {
          var email = api.response; //Need to know what part of the response contains the email
            frisby.create('Testing Events Email Subscription DELETE')
               .delete(link+'/api/drug/subscribe/recalls?jefferson.baker@buchanan-edwards.com')
                   .expectStatus(200)
                   .toss();
        })
.toss();

//Tests Intended to Fail

console.log('Testing Events GET With Invalid Min Date')
frisby.create('Testing Events GET With Invalid Min Date')
   .get(link+'/api/drug/recalls?min_date=2050-01-01')      
      .expectStatus(404)
.toss();

console.log('Testing Recalls GET With Invalid Min Date')
frisby.create('Testing Recalls GET With Invalid Min Date')
    .get(link+'/api/drug/events?min_date=2014-01-01')       
       .expectStatus(404)
.toss();

console.log('Testing Events GET With Invalid Max Date')
frisby.create('Testing Events GET With Invalid Min Date')
   .get(link+'/api/drug/recalls?min_date=2014-12-01')      
      .expectStatus(404)
.toss();

console.log('Testing Recalls GET With Invalid Max Date')
frisby.create('Testing Recalls GET With Invalid Min Date')
    .get(link+'/api/drug/events?min_date=2014-12-01')       
       .expectStatus(404)
.toss();

console.log('Testing Events GET With Invalid Gender')
frisby.create('Testing Events GET With Invalid Gender')
   .get(link+'/api/drug/recalls?gender=7')      
      .expectStatus(404)
.toss();

console.log('Testing Events GET With Invalid Min Age')
frisby.create('Testing Events GET With Invalid Min Age')
   .get(link+'/api/drug/recalls?min_age=young')      
      .expectStatus(404)
.toss();

console.log('Testing Events GET With Invalid Max Age')
frisby.create('Testing Events GET With Invalid Max Age')
   .get(link+'/api/drug/recalls?max_age=old')      
      .expectStatus(404)
.toss();

//Subscription Tests Intended to Fail

console.log('Testing Invalid All Email Address Subscription and Unsubscription')
frisby.create('Testing Invalid All Email Subscription POST')
    .put(link+'/api/drug/subscribe/all?notavalidemail', {
        brand_name: "asprin",
        min_date: 20140621,
        max_date: null,
        min_age: 39,
        max_age: 44,
        gender: 1
    })
        .expectStatus(404)
.toss();

console.log('Testing Invalid Recall Email Address Subscription and Unsubscription')
frisby.create('Testing Invalid Recall Email Subscription POST')
    .put(link+'/api/drug/subscribe/recalls?notavalidemail', {
        brand_name: "asprin",
        min_date: 20140621,
        max_date: null,
        min_age: 39,
        max_age: 44,
        gender: 1
    })
        .expectStatus(404)
.toss();

console.log('Testing Invalid Events Email Address Subscription and Unsubscription')
frisby.create('Testing Invalid Events Email Subscription POST')
    .put(link+'/api/drug/subscribe/recalls?notavalidemail', {
        brand_name: "asprin",
        min_date: 20140621,
        max_date: null,
        min_age: 39,
        max_age: 44,
        gender: 1
    })
        .expectStatus(404)
.toss();

console.log('Testing All Email Address Subscription With No Query')
frisby.create('Testing All Email Subscription With No Query POST')
    .put(link+'/api/drug/subscribe/all?jefferson.baker@buchanan-edwards.com')
        .expectStatus(404)
.toss();

console.log('Testing Invalid Recall Email Address Subscription and Unsubscription')
frisby.create('Testing Recall Email Subscription POST')
    .put(link+'/api/drug/subscribe/recalls?jefferson.baker@buchanan-edwards.com')
        .expectStatus(404)
.toss();

console.log('Testing Invalid Events Email Address Subscription and Unsubscription')
frisby.create('Testing Events Email Subscription POST')
    .put(link+'/api/drug/subscribe/recalls?jefferson.baker@buchanan-edwards.com')
        .expectStatus(404)
.toss();

//Tests Intended to Fail w/ Multiple Params

console.log('Testing Recalls GET With Invalid Min and Max Date Combo')
frisby.create('Testing Recalls GET With Invalid Min and Max Date Combo')
    .get(link+'/api/drug/events?min_date=2014-06-01&max_date=2014-01-01')
       .expectStatus(404)
.toss();

console.log('Testing Events GET With Invalid Min and Max Date Combo')
frisby.create('Testing Events GET With Invalid Min and Max Date Combo')
   .get(link+'/api/drug/recalls?min_date=2014-06-01&max_date=2014-01-01')
      .expectStatus(404)
.toss();

console.log('Testing Events GET With Invalid Min and Max Age Combo')
frisby.create('Testing Events GET With Invalid Min and Max Age Combo')
   .get(link+'/api/drug/recalls?min_age=30&max_age=20')      
      .expectStatus(404)
.toss();
