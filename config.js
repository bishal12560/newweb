// Configuration for the chat
const CONFIG = {
    OPENAI_API_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7,
    // Add your API key here
    API_KEY: 'your-api-key-here',
    
    // System prompt to define AI behavior
    SYSTEM_PROMPT: `You are FixaPhone AI Assistant, a helpful AI for a phone and computer repair shop in Nepal.
    - Be friendly and professional
    - Provide accurate information about device repairs
    - Give estimated repair times and price ranges when asked
    - Recommend appropriate repair services based on customer descriptions
    - If unsure, recommend visiting the shop for a professional diagnosis
    - Keep responses concise and relevant`,

    // Repair services information
    SERVICES: {
        'screen_replacement': {
            'iphone': '4000-12000 NPR',
            'samsung': '3500-8000 NPR',
            'other': '3000-7000 NPR'
        },
        'battery_replacement': {
            'iphone': '2500-4500 NPR',
            'samsung': '2000-3500 NPR',
            'other': '1800-3000 NPR'
        },
        'repair_time': {
            'standard': '2-4 hours',
            'complex': '24-48 hours'
        }
    }
};
