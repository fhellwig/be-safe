var frisby = require("frisby");
var config = require("config");
//Continuous Integration Tests
var link = process.env.be_safe_host_name || config.be_safe_host_name+":"+config.server.port
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

/*
console.log('Testing Recalls GET')
frisby.create('Testing Recalls GET')
    .get(link+'/#/api/drugs?brand_name=ibuprofen&search_type=recalls')
       //.expectHeader('Content-Type', 'application/json')
       .expectStatus(200)
.toss();

console.log('Testing All Email Subscription and Unsubscription')
frisby.create('Testing All Email Subscription PUT')
    .put(link+'/api/subscribe/recalls/be-safe@buchanan-edwards.com', { 
        "max_age": 200,
        "min_age": 0,
        "skip": 0,
        "limit": 10,
        "search_type": "recalls",
        "brand_name": "aspirin"
        })
        .expectStatus(200)
.toss();
*/