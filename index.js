const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const configuration = new Configuration({
    apiKey: 'YOUR-TOKEN-HERE',
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 3080;

app.post('/', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${message}`,
            max_tokens: 150,
            temperature: 0.5,
        });

        return res.json({ message: response.data.choices[0].text });
    } catch (error) {
        return res.json({ message: 'Error' });
    }


});

app.listen(port, () => {
    console.log(`Listening port ${port}`);
});
