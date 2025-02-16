import ChatComponent from './ChatComponent.js';

class ChatRibbonComponent {
    constructor(container, state) {
        this.container = container;
        this.themeColors = state.themeColors || this.getDefaultColors();
        console.log('ChatRibbon Constructor Theme Colors:', this.themeColors);
        this.activeTab = 'chat';
        this.chatComponent = null; // Will hold the ChatComponent instance
        this.init();

        // Listen for theme changes using the custom event emitter
        if (window.themeChangeEmitter) {
            window.themeChangeEmitter.event(newThemeColors => {
                console.log('Theme change detected in ChatRibbonComponent');
                this.updateTheme(newThemeColors);
            });
        }
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

    createTab(id, label, icon) {
        const colors = this.themeColors;
        const isActive = this.activeTab === id;
        return `
            <button 
                id="tab-${id}"
                class="ribbon-tab"
                style="
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: 1px solid ${isActive ? colors.buttonBg : colors.border};
                    border-radius: 4px;
                    background: ${isActive ? colors.buttonBg : colors.background};
                    color: ${isActive ? colors.buttonText : colors.text};
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    outline: none;
                "
                onmouseover="this.style.borderColor='${colors.buttonBg}'"
                onmouseout="this.style.borderColor='${isActive ? colors.buttonBg : colors.border}'"
            >
                <span>${icon}</span>
                <span>${label}</span>
            </button>
        `;
    }

    showActiveTab() {
        const $tabContent = this.container.getElement().find('#tab-content');
        $tabContent.empty();

        if (this.activeTab === 'chat') {
            // Initialize ChatComponent if not already done
            if (!this.chatComponent) {
                this.chatComponent = new ChatComponent({
                    getElement: () => $tabContent,
                }, {
                    themeColors: this.themeColors,
                    sourceCode: window.sourceEditor?.getValue() || ''
                });
            }
            // Update theme colors in case they changed
            this.chatComponent.themeColors = this.themeColors;
            this.chatComponent.init();
        } else {
            // Handle other tabs
            $tabContent.html(`
                <div style="
                    padding: 1rem;
                    color: ${this.themeColors.text};
                    background: ${this.themeColors.background};
                    height: 100%;
                ">
                    ${this.activeTab} content coming soon...
                </div>
            `);
        }
    }

    bindEvents() {
        const $container = this.container.getElement();
        
        // Handle tab clicks
        $container.find('.ribbon-tab').on('click', (e) => {
            const tabId = e.currentTarget.id.replace('tab-', '');
            this.setActiveTab(tabId);
        });
    }

    setActiveTab(tabId) {
        this.activeTab = tabId;
        this.showActiveTab();
        
        // Emit event for parent components
        const event = new CustomEvent('tabChanged', {
            detail: { tab: tabId }
        });
        window.dispatchEvent(event);
    }

    updateTheme(newThemeColors) {
        console.log('ChatRibbon updateTheme - Old Colors:', this.themeColors);
        this.themeColors = newThemeColors;
        console.log('ChatRibbon updateTheme - New Colors:', this.themeColors);
        this.init();
    }

    init() {
        console.log('ChatRibbon init - Current Theme Colors:', this.themeColors);
        const colors = this.themeColors;
        const ribbonHTML = `
            <div class="chat-container" style="display: flex; flex-direction: column; height: 100%;">
                <div style="
                    display: flex;
                    align-items: center;
                    background: ${colors.background};
                    border-bottom: 1px solid ${colors.border};
                    padding: 0.5rem;
                    height: 2.5rem;
                ">
                    <div style="display: flex; gap: 0.5rem;">
                        ${this.createTab('chat', 'Chat', '💬')}
                        ${this.createTab('bugs', 'Bug Finder', '🐛')}
                        ${this.createTab('settings', 'Settings', '⚙️')}
                    </div>
                </div>
                <div id="tab-content" style="flex-grow: 1; overflow: hidden;"></div>
            </div>
        `;

        this.container.getElement().html(ribbonHTML);
        this.bindEvents();
        this.showActiveTab();
    }
}

export default ChatRibbonComponent; 