export class LLMService {

    // OpenRouter API Key
    constructor() {
        this.API_KEY = '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';
        this.BASE_URL = 'https://openrouter.ai/api/v1';
        // Map OpenRouter model IDs to display names
        this.models = {
            'mistralai/mistral-7b-instruct': 'Mistral 7B',
            'openai/gpt-4o': 'GPT-4',
            'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
            'gryphe/mythomax-l2-13b': 'MythoMax 13B',
            
        }
        this.defaultModel = 'mistralai/mistral-7b-instruct';
    }
    
    async changeModel(modelId) {
        // modelId should be the OpenRouter compatible ID
        if (this.models[modelId]) {
            this.defaultModel = modelId;
        } else {
            console.error(`Model ${modelId} not found`);
        }
    }
    // Send a message to the LLM
    async sendMessage(message) {
        try {
            const response = await fetch(`${this.BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Judge0 IDE'
                },
                body: JSON.stringify({
                    model: this.defaultModel,
                    messages: [{ role: 'user', content: message }]
                })
            });

            const data = await response.json();
            
            // Log the response for debugging
            console.log('API Response:', data);

            // Check if the response is successful and has the expected structure
            if (!response.ok) {
                throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
            }

            if (!data.choices || !data.choices[0]?.message?.content) {
                throw new Error('Invalid response format from API');
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('LLM Service Error:', error);
            throw error;
        }
    }

    setApiKey(key) {
        this.API_KEY = key;
    }

    getModels() {
        // Return array of objects with id (OpenRouter ID) and name (display name)
        return Object.entries(this.models).map(([id, name]) => ({
            id,    // OpenRouter compatible ID
            name   // Display name
        }));
    }
}

export const llmService = new LLMService();
