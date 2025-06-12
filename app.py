import streamlit as st
import openai
import os
from dotenv import load_dotenv
import json
import pandas as pd

# Configure page - MUST BE THE FIRST STREAMLIT COMMAND
st.set_page_config(
    page_title="AI Product Description Generator",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load environment variables
load_dotenv()

# Custom CSS for modern UI
st.markdown("""
    <style>
    .main {
        background-color: #f5f7f9;
    }
    .stButton>button {
        background-color: #4CAF50;
        color: white;
        border-radius: 20px;
        padding: 10px 25px;
        font-weight: bold;
        border: none;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        background-color: #45a049;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .stTextInput>div>div>input {
        border-radius: 10px;
        border: 2px solid #e0e0e0;
    }
    .stTextArea>div>div>textarea {
        border-radius: 10px;
        border: 2px solid #e0e0e0;
    }
    .stSelectbox>div>div>select {
        border-radius: 10px;
        border: 2px solid #e0e0e0;
    }
    .stSlider>div>div>div>div {
        background-color: #4CAF50;
    }
    h1, h2, h3 {
        color: #2c3e50;
    }
    .stMarkdown {
        color: #34495e;
    }
    .reflection-box {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 20px 0;
    }
    .output-grid {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin: 20px 0;
    }
    </style>
    """, unsafe_allow_html=True)

# Initialize OpenAI client
@st.cache_resource
def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        st.error("⚠️ OpenAI API key not found! Please add your API key to the .env file.")
        st.stop()
    return openai.OpenAI(api_key=api_key)

def generate_response(client, model, system_prompt, user_prompt, temperature, max_tokens, 
                     presence_penalty, frequency_penalty, stop_sequences):
    """Generate response from OpenAI API"""
    try:
        messages = []
        
        if system_prompt.strip():
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": user_prompt})
        
        # Prepare stop sequences
        stop = None
        if stop_sequences and stop_sequences.strip():
            stop = [seq.strip() for seq in stop_sequences.split(',') if seq.strip()]
            if not stop:
                stop = None
        
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            presence_penalty=presence_penalty,
            frequency_penalty=frequency_penalty,
            stop=stop
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        return f"Error: {str(e)}"

def generate_comparison_grid(client, model, system_prompt, user_prompt, product_name):
    """Generate a grid of outputs with different parameter combinations"""
    results = []
    
    # Define parameter combinations to test
    param_combinations = [
        {"temp": 0.0, "tokens": 50, "presence": 0.0, "frequency": 0.0},
        {"temp": 0.7, "tokens": 150, "presence": 0.0, "frequency": 0.0},
        {"temp": 1.2, "tokens": 300, "presence": 0.0, "frequency": 0.0},
        {"temp": 0.7, "tokens": 150, "presence": 1.5, "frequency": 0.0},
        {"temp": 0.7, "tokens": 150, "presence": 0.0, "frequency": 1.5},
    ]
    
    for params in param_combinations:
        response = generate_response(
            client=client,
            model=model,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=params["temp"],
            max_tokens=params["tokens"],
            presence_penalty=params["presence"],
            frequency_penalty=params["frequency"],
            stop_sequences=""
        )
        
        results.append({
            "Temperature": params["temp"],
            "Max Tokens": params["tokens"],
            "Presence Penalty": params["presence"],
            "Frequency Penalty": params["frequency"],
            "Output": response
        })
    
    return pd.DataFrame(results)

def main():
    # Header with gradient background
    st.markdown("""
        <div style='background: linear-gradient(45deg, #4CAF50, #2196F3); padding: 20px; border-radius: 10px; margin-bottom: 20px;'>
            <h1 style='color: white; text-align: center; margin: 0;'>✨ AI Product Description Generator</h1>
            <p style='color: white; text-align: center; margin: 5px 0 0 0;'>Create compelling product descriptions with AI</p>
        </div>
    """, unsafe_allow_html=True)
    
    # Create two columns for the main layout
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 🎯 Product Details")
        product_name = st.text_input(
            "Product Name",
            value="iPhone 15 Pro",
            help="Enter the product you want to describe"
        )
        
        st.markdown("### 🎨 Style Settings")
        system_prompt = st.text_area(
            "Writing Style",
            value="You are a creative marketing expert specializing in writing compelling product descriptions. Create engaging, informative, and persuasive descriptions that highlight key features and benefits.",
            height=100,
            help="Set the writing style and tone"
        )
        
        user_prompt_template = st.text_area(
            "Description Template",
            value="Write a compelling product description for: {product}",
            height=80,
            help="Use {product} as placeholder for the product name"
        )
    
    with col2:
        st.markdown("### ⚙️ AI Configuration")
        
        # Model Selection with custom styling
        model = st.selectbox(
            "AI Model",
            ["gpt-3.5-turbo", "gpt-4"],
            index=0,
            help="Choose the OpenAI model to use"
        )
        
        # Create three columns for sliders
        col_temp, col_tokens, col_penalty = st.columns(3)
        
        with col_temp:
            temperature = st.select_slider(
                "Creativity",
                options=[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2],
                value=0.7,
                help="Controls randomness (0.0 = deterministic, 1.2 = very creative)"
            )
        
        with col_tokens:
            max_tokens = st.select_slider(
                "Length",
                options=[50, 100, 150, 200, 250, 300, 400, 500],
                value=150,
                help="Maximum length of the response"
            )
        
        with col_penalty:
            presence_penalty = st.select_slider(
                "Topic Focus",
                options=[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
                value=0.0,
                help="Penalizes new topics (0.0 = no penalty, 1.5 = strong penalty)"
            )
        
        frequency_penalty = st.select_slider(
            "Repetition Control",
            options=[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
            value=0.0,
            help="Penalizes repetition (0.0 = no penalty, 1.5 = strong penalty)"
        )
        
        stop_sequences = st.text_input(
            "Stop Words",
            value="",
            help="Comma-separated list of words where generation should stop"
        )
    
    # Generate buttons
    col_gen1, col_gen2 = st.columns(2)
    with col_gen1:
        generate_single = st.button("🚀 Generate Single Description", type="primary", use_container_width=True)
    with col_gen2:
        generate_grid = st.button("📊 Generate Comparison Grid", type="primary", use_container_width=True)
    
    # Single Response section
    if generate_single:
        if not product_name.strip():
            st.error("Please enter a product name!")
            return
        
        with st.spinner("✨ Crafting your product description..."):
            client = get_openai_client()
            final_user_prompt = user_prompt_template.format(product=product_name)
            
            response = generate_response(
                client=client,
                model=model,
                system_prompt=system_prompt,
                user_prompt=final_user_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
                presence_penalty=presence_penalty,
                frequency_penalty=frequency_penalty,
                stop_sequences=stop_sequences
            )
            
            st.markdown("""
                <div style='background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                    <h3 style='color: #2c3e50; margin-bottom: 10px;'>✨ Generated Description</h3>
                    <p style='color: #34495e; font-size: 16px; line-height: 1.6;'>{}</p>
                </div>
            """.format(response), unsafe_allow_html=True)
            
            # Copy button
            st.code(response, language="text")
    
    # Grid Output section
    if generate_grid:
        if not product_name.strip():
            st.error("Please enter a product name!")
            return
        
        with st.spinner("📊 Generating comparison grid..."):
            client = get_openai_client()
            final_user_prompt = user_prompt_template.format(product=product_name)
            
            # Generate grid of outputs
            df = generate_comparison_grid(
                client=client,
                model=model,
                system_prompt=system_prompt,
                user_prompt=final_user_prompt,
                product_name=product_name
            )
            
            st.markdown("### 📊 Parameter Comparison Grid")
            st.dataframe(df, use_container_width=True)
            
            # Reflection section
            st.markdown("### 📝 Reflection")
            st.markdown("""
                <div class='reflection-box'>
                    <h4>Parameter Effects Analysis</h4>
                    <p>1. Temperature (0.0 vs 0.7 vs 1.2):</p>
                    <ul>
                        <li>0.0: More deterministic, focused outputs</li>
                        <li>0.7: Balanced creativity and coherence</li>
                        <li>1.2: More creative and varied outputs</li>
                    </ul>
                    
                    <p>2. Token Length (50 vs 150 vs 300):</p>
                    <ul>
                        <li>50: Concise, focused descriptions</li>
                        <li>150: Balanced detail and length</li>
                        <li>300: More detailed, comprehensive descriptions</li>
                    </ul>
                    
                    <p>3. Penalty Effects:</p>
                    <ul>
                        <li>Presence Penalty (1.5): Reduces topic repetition</li>
                        <li>Frequency Penalty (1.5): Reduces word repetition</li>
                    </ul>
                </div>
            """, unsafe_allow_html=True)
    
    # Initial state message
    if not generate_single and not generate_grid:
        st.markdown("""
            <div style='text-align: center; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                <h3 style='color: #2c3e50;'>🎯 Ready to Generate</h3>
                <p style='color: #7f8c8d;'>Choose between generating a single description or a comparison grid of different parameter combinations!</p>
            </div>
        """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
