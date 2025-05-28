# Interactive Prompt Playground

An interactive web application for experimenting with AI text generation, specifically designed for creating product descriptions. This playground allows you to fine-tune various parameters and see the results in real-time.

## Features

### Parameter Controls
- **Temperature**: Adjust the creativity/randomness of the output (0.0 to 2.0)
- **Max Tokens**: Control the maximum length of the generated text
- **Presence Penalty**: Reduce repetition of topics (-2.0 to 2.0)
- **Frequency Penalty**: Reduce repetition of specific words (-2.0 to 2.0)

### Model Selection
Choose from different OpenAI models:
- GPT-4 Turbo
- GPT-4
- GPT-3.5 Turbo
- GPT-3.5 Turbo 16K

### Prompt Management
- Pre-configured system and user prompts for product descriptions
- Real-time prompt editing
- Clear separation between system and user instructions

### Real-time Generation
- Progressive display of generated text
- Immediate feedback on generation progress
- Clear error handling and status updates

## How to Run

1. Clone the repository:
```bash
git clone <your-repository-url>
cd interactive-prompt-playground
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Select your desired model from the dropdown menu
2. Adjust the generation parameters using the sliders
3. Review and modify the system and user prompts if needed
4. Click "Generate" to start the text generation
5. Watch the results appear progressively in the output area
