import { llmService } from './LLMService.js';

class ChatComponent {
    constructor(container, state) {
        this.container = container;
        this.themeColors = state.themeColors || this.getDefaultColors();
        this.sourceCode = state.sourceCode || '';
        this.init();

        // Listen for tab changes
        window.addEventListener('tabChanged', (e) => {
            const tab = e.detail.tab;
            // Handle different tab states
            switch(tab) {
                case 'chat':
                    // Normal chat mode
                    break;
                case 'bugs':
                    // Bug finder mode
                    break;
                case 'explain':
                    // Code explanation mode
                    break;
                case 'settings':
                    // Settings mode
                    break;
            }
        });
    }

    getDefaultColors() {
        return {
            background: 'white',
            outputBackground: '#f8f9fa',
            text: '#212529',
            border: '#dee2e6',
            buttonBg: '#0d6efd',
            buttonText: 'white',
            messageBackground: '#e3f2fd'
        };
    }

    init() {
        const colors = this.themeColors;
        const chatHTML = `
            <div style="
                display: flex; 
                flex-direction: column; 
                height: 100%; 
                background: ${colors.background};
                color: ${colors.text};
                position: relative;
                overflow: hidden;
            ">
                <div id="chat-output" style="
                    flex-grow: 1; 
                    overflow-y: auto; 
                    padding: 1rem; 
                    background: ${colors.outputBackground}; 
                    border-bottom: 1px solid ${colors.border};
                    max-height: calc(100% - 8rem);
                "></div>
                
                <div style="
                    padding: 0.5rem;
                    position: relative;
                    min-height: 6rem;
                    background: ${colors.background};
                    flex-shrink: 0;
                ">
                    <select 
                        id="model-selector"
                        style="
                            position: absolute;
                            left: 0.5rem;
                            bottom: 1rem;
                            background: ${colors.outputBackground};
                            color: ${colors.text};
                            border: 1px solid ${colors.border};
                            border-radius: 4px;
                            padding: 0.25rem 0.5rem;
                            cursor: pointer;
                            z-index: 10;
                            outline: none;
                            transition: border-color 0.2s, box-shadow 0.2s;
                        "
                        onmouseover="this.style.borderColor='${colors.buttonBg}'"
                        onmouseout="this.style.borderColor='${colors.border}'"
                        onfocus="this.style.boxShadow='0 0 0 2px ${colors.buttonBg}40'"
                        onblur="this.style.boxShadow='none'"
                    >
                        ${llmService.getModels().map(model => `
                            <option 
                                value="${model.id}" 
                                ${model.id === llmService.defaultModel ? 'selected' : ''}
                                style="
                                    background: ${colors.outputBackground};
                                    color: ${colors.text};
                                "
                            >
                                ${model.name}
                            </option>
                        `).join('')}
                    </select>
                    <textarea 
                        id="chat-input" 
                        placeholder="Type your message here..." 
                        style="
                            width: 100%; 
                            padding: 0.5rem; 
                            border: 1px solid ${colors.border}; 
                            border-radius: 4px;
                            height: 5rem;
                            background: ${colors.outputBackground};
                            color: ${colors.text};
                            padding-right: 5rem;
                            resize: none;
                            vertical-align: top;
                        "
                    ></textarea>
                    <button 
                        id="chat-submit"
                        style="
                            position: absolute;
                            bottom: 1rem;
                            right: 1rem;
                            padding: 0.5rem 1rem; 
                            background: ${colors.buttonBg}; 
                            color: ${colors.buttonText}; 
                            border: none; 
                            border-radius: 4px; 
                            cursor: pointer;
                        "
                    >
                        Send
                    </button>
                </div>
            </div>
        `;

        this.container.getElement().html(chatHTML);
        this.bindEvents();
    }

    bindEvents() {
        const $container = this.container.getElement();
        
        $container.find('#chat-submit').on('click', () => this.handleSubmit());
        
        // Handle enter key
        $container.find('#chat-input').on('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        });

        // Add model selector change handler
        $container.find('#model-selector').on('change', (e) => {
            llmService.changeModel(e.target.value);
        });
    }

    parseMarkdown(text) {
        // Handle code blocks with language specification
        text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
            return `
                <div class="code-block">
                    ${language ? 
                        `<div class="code-language" style="
                            font-family: monospace;
                            font-size: 0.8em;
                            color: #666;
                            padding: 4px 16px;
                            background: #f6f8fa;
                            border: 1px solid #e1e4e8;
                            border-bottom: none;
                            border-radius: 6px 6px 0 0;
                        ">${language}</div>` 
                        : ''
                    }
                    <pre style="
                        background: #f6f8fa;
                        border: 1px solid #e1e4e8;
                        border-radius: ${language ? '0 0 6px 6px' : '6px'};
                        padding: 16px;
                        overflow-x: auto;
                        font-family: monospace;
                        font-size: 0.9em;
                        margin: 0;
                    "><code>${code.trim()}</code></pre>
                </div>
            `;
        });

        // Handle inline code
        text = text.replace(/`([^`]+)`/g, (match, code) => {
            return `<code style="
                background: #f6f8fa;
                border: 1px solid #e1e4e8;
                border-radius: 3px;
                padding: 0.2em 0.4em;
                font-family: monospace;
                font-size: 0.9em;
            ">${code}</code>`;
        });

        return text;
    }

    async handleSubmit() {
        const $container = this.container.getElement();
        const $input = $container.find('#chat-input');
        const message = $input.val().trim();

        if (message) {
            const $chatOutput = $container.find('#chat-output');
            
            // Always include source code context
            const fullMessage = `Here's the source code I want to discuss:\n\`\`\`\n${this.sourceCode}\n\`\`\`\n\nMy question: ${message}`;

            // Add user message to chat (show original message, not the full one)
            $chatOutput.append(`
                <div style="margin: 0.5rem 0; padding: 0.5rem; background: ${this.themeColors.messageBackground}; border-radius: 4px;">
                    <strong>You:</strong> ${message}
                </div>
            `);

            // Clear input and disable button while processing
            $input.val('');
            const $button = $container.find('#chat-submit');
            $button.prop('disabled', true);
            $button.css('opacity', '0.5');

            try {
                // Show loading indicator
                $chatOutput.append(`
                    <div id="loading-message" style="margin: 0.5rem 0; padding: 0.5rem; background: ${this.themeColors.outputBackground}; border-radius: 4px;">
                        <em>AI is thinking...</em>
                    </div>
                `);

                // Get AI response using the full message
                const response = await llmService.sendMessage(fullMessage);

                // Remove loading indicator
                $chatOutput.find('#loading-message').remove();

                // Add AI response with markdown parsing
                $chatOutput.append(`
                    <div style="margin: 0.5rem 0; padding: 0.5rem; background: ${this.themeColors.outputBackground}; border-radius: 4px;">
                        <strong>AI:</strong> ${this.parseMarkdown(response)}
                    </div>
                `);
            } catch (error) {
                // Remove loading indicator
                $chatOutput.find('#loading-message').remove();

                // Show error message
                $chatOutput.append(`
                    <div style="margin: 0.5rem 0; padding: 0.5rem; background: #fee; border-radius: 4px; color: #c00;">
                        Error: Failed to get AI response. Please try again.
                    </div>
                `);
            } finally {
                // Re-enable button
                $button.prop('disabled', false);
                $button.css('opacity', '1');

                // Scroll to bottom
                const chatOutput = $chatOutput[0];
                chatOutput.scrollTop = chatOutput.scrollHeight;
            }
        }
    }
}

export default ChatComponent; 