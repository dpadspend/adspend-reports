/**
 * AdSpend AI Analysis Report - Tab Loader & Interactions
 */

// Track current tab to avoid redundant loads
let currentTab = null;

/**
 * Load tab content dynamically
 * @param {string} tabName - Name of the tab to load (recommendations, techstack, changelog)
 */
async function loadTab(tabName) {
    // Skip if already on this tab
    if (currentTab === tabName) return;

    const container = document.getElementById('tab-container');

    // Show loading state
    container.innerHTML = `
        <div class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#dc0f0f]"></div>
        </div>
    `;

    try {
        const response = await fetch(`tabs/${tabName}.html`);
        if (!response.ok) throw new Error(`Failed to load ${tabName}`);

        const html = await response.text();
        container.innerHTML = html;
        currentTab = tabName;

        // Update nav active state
        updateNavState(tabName);

        // Update URL hash for bookmarking
        history.replaceState(null, '', `#${tabName}`);

    } catch (error) {
        console.error('Tab load error:', error);
        container.innerHTML = `
            <div class="text-center py-20">
                <p class="text-red-500 text-lg font-medium">Failed to load tab content</p>
                <p class="text-gray-500 mt-2">Please refresh the page and try again</p>
            </div>
        `;
    }
}

/**
 * Update navigation active state
 * @param {string} activeTab - Name of the active tab
 */
function updateNavState(activeTab) {
    document.querySelectorAll('.nav-item').forEach(item => {
        const itemTab = item.getAttribute('data-tab');
        if (itemTab === activeTab) {
            item.classList.add('nav-item-active');
        } else {
            item.classList.remove('nav-item-active');
        }
    });
}

/**
 * Copy text to clipboard with visual feedback
 * @param {HTMLElement} button - The button that was clicked
 * @param {string} text - Text to copy
 */
function copyToClipboard(button, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-green-500');
        button.classList.remove('bg-blue-500');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-500');
            button.classList.add('bg-blue-500');
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Attach click handlers to nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            if (tab) loadTab(tab);
        });
    });

    // Load tab from URL hash or default to recommendations
    const hash = window.location.hash.slice(1);
    const validTabs = ['recommendations', 'techstack', 'changelog'];
    const initialTab = validTabs.includes(hash) ? hash : 'recommendations';

    loadTab(initialTab);
});

// Handle browser back/forward
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    const validTabs = ['recommendations', 'techstack', 'changelog'];
    if (validTabs.includes(hash)) {
        loadTab(hash);
    }
});
