require('dotenv').config()

const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3600


// Middleware for parsing JSON
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));



// Start the server
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
app.use("/api/patients", require("./routes/patientRout"))
app.use("/api/statistics", require("./routes/statisticsRout") )
app.use("/api/unvaccinated", require("./routes/unvaccinatedRout") )
app.use("/api/uploadImage", require("./routes/uploadImageRout") )
