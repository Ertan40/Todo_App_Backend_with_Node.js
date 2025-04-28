// The address of this server connected to the network is:
// URL => http://localhost:5003
// IP  -> 127.0.0.1:5003

const express = require("express");
const app = express();
const PORT = 5003;

let data = ["Ertan"];

// Middleware
app.use(express.json()); // This parses JSON bodies
// ENDPOINT - HTTP verbs(method) && routes (or paths)
// The method informs the nature of request and the route is a further subdirectory (basically we direct the request
// to the body of code to respond appropriately, and these locations or routes are called endpoints )

// Type 1 - Website endpoints (these endpoints are for sending back html and they typically come when a user enters a url in a browser)
app.get("/test", (req, res) => {
  // this is endpoint number 1 - /
  res.send("Hello world!");
});

app.get("/", (req, res) => {
  res.send(`
        <body style="background: pink; color: green;">
        
           <h1>DATA:</h1>
             <p>${JSON.stringify(data)}</p>
             <a href="/dashboard">Dashboard</a>
        </body>
        <script>console.log('This is my script')</script>
        `);
});

app.get("/home", (req, res) => {
  res.send("<h2>this is actually a web site(html code)</h2>");
});

app.get("/dashboard", (req, res) => {
  console.log("I hit the /dashboard endpoint");
  res.send(`
    <body>
        <h1>dashboard</h1>
        <a href="/">home</a>
    </body>
    `);
});

// Type 2 - API endpoints (non visual)
//CRUD-method create-post read-get update-put and delete-delete
app.get("/api/data", (req, res) => {
  res.send(data);
});

app.post("/api/data", (req, res) => {
  // someone wants to create a user (for example when they click a sign up button)
  // the user clicks the sign up button after entering their credentials, and their browser is wired up to send out a network request to the server to handle that action
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name);
  res.sendStatus(201);
});

app.delete("/api/data", (req, res) => {
  data.pop();
  console.log("We deleted the element off the end of the array");
  res.sendStatus(203).send("name has been deleted");
});

app.listen(PORT, () => console.log(`Server has started on part: ${PORT}`));
