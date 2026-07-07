console.log("NEW SERVER FILE RUNNING");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Expense Tracker Running");
});


// TEST ROUTE
app.get("/test", (req, res) => {
    res.send("Test Route Working");
});


// ADD EXPENSE ROUTE
app.post("/add-expense", (req, res) => {

    console.log(req.body);

    const { trip, category, amount } = req.body;

    const sql = `
        INSERT INTO expenses
        (trip_name, category, amount)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [trip, category, amount], (err, result) => {

        if(err){
            console.log(err);
            res.send("Error adding expense");
        }
        else{
            console.log("Inserted Successfully");
            res.send("Expense added successfully");
        }

    });

});


// GET ALL EXPENSES
app.get("/expenses", (req, res) => {

    const sql = "SELECT * FROM expenses";

    db.query(sql, (err, result) => {

        if(err){
            console.log(err);
            res.send("Error fetching expenses");
        }
        else{
            res.json(result);
        }

    });

});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});