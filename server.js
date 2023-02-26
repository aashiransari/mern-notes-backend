const express = require('express');
const app = express();
const db = require('./backend/config/db');
const userRoute = require('./backend/routes/userRoute');
const noteRoute = require('./backend/routes/noteRoutes');
const path = require("path");

app.use(express.json());

app.use('/api/user/', userRoute);
app.use('/api/notes/', noteRoute);

// ------------- Development --------------
__dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    })
} else {
    app.get('/', (req, res) => {
        res.send('API running...')
    })
}


// ------------- Development --------------

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});