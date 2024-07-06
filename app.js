const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { selectDimension } = require("./database/queries/select_dimension");

const routes = require("./routes");

const app = express();
const PORT = 5000;
const HOST = "192.168.0.5";

app.use(cors());
app.use(bodyParser.json());

app.use("/", routes);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
