const express = require("express");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// CREATE CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Au7ed0VVciJC5iBq",
  database: "employeedb",
  multipleStatements: true,
});

// CONNECT TO DATABASE
db.connect((err) => {
  if (err) console.log("DB Connection Failed \n Error: " + JSON.stringify(err, undefined, 2));
  else console.log("DB Connection Success");
});

// GET ALL EMPLOYEES
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employee", (err, rows, field) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

// GET AN EMPLOYEE BY ID
app.get("/employee/:id", (req, res) => {
  db.query("SELECT * FROM employee WHERE EmpID = ?", [req.params.id], (err, rows, field) => {
    if (!err) res.send(rows);
    console.log(err);
  });
});

// DELETE AN EMPLOYEE BY ID
app.delete("/deleteEmployee/:id", (req, res) => {
  db.query("DELETE FROM employee WHERE EmpID = ?", [req.params.id], (err, rows, field) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Delete Successfuly!");
    }
  });
});

// ADD NEW EMPLOYEE
app.post("/addEmployee", (req, res) => {
  const emp = req.body;
  const sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
  db.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, field) => {
    if (err) {
      console.log(err);
    } else {
      rows.forEach((element) => {
        if (element.constructor == Array) res.send("Inserted Employee Id : " + element[0].EmpID);
      });
    }
  });
});

// UPDATE NEW EMPLOYEE
app.put("/updateEmployee", (req, res) => {
  const emp = req.body;
  const sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
      CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
  db.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, field) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Update Succesfuly");
    }
  });
});

app.listen("3000", () => {
  console.log("Express Server is running on port 3000...");
});
