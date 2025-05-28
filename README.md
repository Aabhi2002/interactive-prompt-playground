# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Interactive Prompt Playground

A web application that allows you to experiment with different parameters for generating product descriptions using OpenAI's GPT models.

## Features

- Select between GPT-3.5 Turbo and GPT-4 models
- Input custom system and user prompts
- Test different combinations of parameters:
  - Temperature (0.0, 0.7, 1.2)
  - Max Tokens (50, 150, 300)
  - Presence Penalty (0.0, 1.5)
  - Frequency Penalty (0.0, 1.5)
- View results in a table format
- Real-time API calls to OpenAI

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interactive-prompt-playground.git
cd interactive-prompt-playground
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
REACT_APP_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

## Usage

1. Select your preferred model (GPT-3.5 Turbo or GPT-4)
2. Enter your system prompt (e.g., "You are a product description generator")
3. Enter your user prompt (e.g., "Describe the iPhone")
4. Click "Generate Combinations" to run the tests
5. View the results in the table below

## How It Works

The application will generate all possible combinations of the parameters and make API calls to OpenAI for each combination. The results are displayed in a table showing:
- Temperature value used
- Max tokens value used
- Presence penalty value used
- Frequency penalty value used
- Stop sequence used (if any)
- The generated text result

## Parameter Effects and Reflection

### Temperature Impact
The temperature parameter significantly influences the creativity and randomness of the generated content. At 0.0, the responses are more deterministic and focused, often producing similar, straightforward product descriptions. As the temperature increases to 0.7 and 1.2, the responses become more creative and varied, introducing unique metaphors and engaging language. However, higher temperatures can sometimes lead to less focused or overly creative descriptions that might not be suitable for professional product listings.

### Other Parameters' Influence
The presence_penalty and frequency_penalty parameters work together to control repetition and topic diversity. A higher presence_penalty (1.5) encourages the model to discuss new aspects of the product, while a higher frequency_penalty reduces repetitive phrases. The max_tokens parameter effectively controls the length of the description, with 50 tokens producing concise summaries and 300 tokens allowing for detailed, comprehensive descriptions. The stop sequence parameter provides additional control over the output format, allowing for structured responses that can be easily parsed or formatted for different platforms.

## Notes

- Each combination will use the same system and user prompts
- The API calls are made sequentially to avoid rate limiting
- Error handling is implemented for failed API calls
- Loading state is shown during generation

## Technologies Used

- React
- Material-UI
- OpenAI API
- Axios for API calls
