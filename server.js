const port = process.env.PORT || 3001;
const express = require('express');
const cors = require('cors');
const path = require('path')
const app = express();
const buildPath = path.join(__dirname, 'build');
require('dotenv').config();
const API_KEY = process.env.REACT_APP_API_KEY;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.static(buildPath))
app.use(cors());
app.use(express.json());

app.post('/images', async (req, res) => {
    try {
        const response = await openai.createImage({
            prompt: req.body.message,
            n: 3,
            size: "1024x1024",
        });
        res.send(response.data);
    } catch (error) {
        res.sendStatus(error.response.status)
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
})

app.listen(port, () => console.log('Your Server is running on Port: ' + port));