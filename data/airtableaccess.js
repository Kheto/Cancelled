var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.API_KEY,
  requestTimeout: 3000
});
var base = Airtable.base(process.env.BASE_ID);
var people = [],
  cacheAge;

function fetchPeople(callback) {
  if (new Date() - cacheAge > 300000 || cacheAge === undefined) {
    console.log("Cache out of date, re-caching");
    people = [];
    base("Reasons")
      .select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 200,
        view: "Grid view"
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function handleRecord(record) {
            let person = record.fields;
            person.id = record.id;
            people.push(person);
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          callback(people);
        }
      );
    cacheAge = new Date();
  } else {
    callback(people);
  }
}

function fetchPerson(id, callback) {
  console.log("Fetching id", id);
  base("Reasons").find(id, function(err, record) {
    if (err) {
      throw err;
      return;
    }
    console.log("Found", record.fields.Name);
    callback(record.fields);
  });
}

function getCached(callback) {
  callback(people);
}

function getCachedByName(name, callback) {
  callback(people.filter(person => person.name == name));
}

function autoCompleteName(searchString, callback) {
  fetchPeople((people)=>{
    callback(
      people
        .filter(
          person =>
            person.Name.toLocaleLowerCase().indexOf(
              searchString.toLocaleLowerCase()
            ) > -1
        )
        .map(person => {
          let obj = { "Name": person.Name, "id": person.id, "blah": "non" }
          return obj;
        })
    );});
}

fetchPeople(function(result) {
  //Run fetch once to cache everything
  console.log(`Fetch complete, found ${result.length} records.`);
});

// setTimeout(()=>{
//   fetchPerson("recSjmNwngDf1moKc", function(result){
//     console.log(result)
//   })},5000)

exports.fetchPeople = fetchPeople;
exports.fetchPerson = fetchPerson;
exports.autoCompleteName = autoCompleteName;
