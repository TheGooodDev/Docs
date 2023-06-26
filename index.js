const { default: Surreal } = require("surrealdb.js");
const db = new Surreal("http://localhost:8000/rpc");

const fs = require("fs");
const { parse } = require("csv-parse");

async function main() {
  try {
    // Signin to a scope from the browser
    await db.signin({
      user: "root",
      pass: "Admin12$",
    });
    // await db.query('REMOVE NAMESPACE nosql;');

    // Select a specific namespace / database
    await db.use("CoursSQL", "restaurants");

    // // Create a new person with a random id
    // let created = await db.create("person", {
    // 	title: 'Founder & CEO',
    // 	name: {
    // 		first: 'Tobie',
    // 		last: 'Morgan Hitchcock',
    // 	},
    // 	marketing: true,
    // 	identifier: Math.random().toString(36).substr(2, 10),
    // });

    let tab = ["title","name","adress","realAdress","departement","country","tel","email"]
    await fs.createReadStream("./contacts.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", async function (row) {
        let obj = {};
        row.forEach((element,i) => {
          obj[tab[i]] = element;
        });
        await db.create("restaurants", obj);
      });


    // Update a person record with a specific id
    let updated = await db.change("person:jaime", {
    	marketing: true,
    });

    // // Select all people records
    let people = await db.select("restaurants");
    console.log(people);

    // // Perform a custom advanced query
    // let groups = await db.query('SELECT * FROM type::table($tb)', {
    // 	tb: 'person',
    // });
    let namespace = await db.query("INFO FOR KV;");
    namespace.forEach((key) => {
      console.log(key);
    });
  } catch (e) {
    console.error("ERROR", e);
  }
  db.close().then(() => {
    console.log("Close");
  });
}

main();


// CREATE
// db.create("restaurants", obj);

// READ
// db.select("restaurants");
// db.select("restaurants:identifier");


// UPDATE
// db.update("restaurants:identifier", obj);

// REMOVE
// db.remove("restaurants");
// db.remove("restaurants:identifier");