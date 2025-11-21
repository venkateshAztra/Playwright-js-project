
require('dotenv').config();
const fetch = require('node-fetch');

async function generatePlaywrightCode(instruction) {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: `Convert the following instruction into Playwright test code: ${instruction}`,
            max_tokens: 150
        })
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

// Sample usage
(async () => {
    const instruction = "Click on the More information link";
    const code = await generatePlaywrightCode(instruction);
    console.log(code);
})();
