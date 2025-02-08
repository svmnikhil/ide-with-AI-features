class ChatComponent {
    constructor(container, state) {
        this.container = container;
        this.themeColors = state.themeColors || this.getDefaultColors();
        this.init();
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
            ">
                <div id="chat-output" style="
                    flex-grow: 1; 
                    overflow-y: auto; 
                    padding: 1rem; 
                    background: ${colors.outputBackground}; 
                    border-bottom: 1px solid ${colors.border};
                "></div>
                <div style="
                    padding: 0.5rem;
                    display: flex;
                    position: relative;
                    min-height: 6rem;
                ">
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
    }

    handleSubmit() {
        const $container = this.container.getElement();
        const $input = $container.find('#chat-input');
        const message = $input.val().trim();

        if (message) {
            // Add message to chat
            $container.find('#chat-output').append(`
                <div style="margin: 0.5rem 0; padding: 0.5rem; background: #e3f2fd; border-radius: 4px;">
                    ${message}
                </div>
            `);

            // Clear input
            $input.val('');

            // Scroll to bottom
            const chatOutput = $container.find('#chat-output')[0];
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }
    }
}

export default ChatComponent; 