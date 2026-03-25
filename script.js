// Show section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Convert Markdown to HTML (simple converter)
function markdownToHtml(markdown) {
    let html = markdown;

    // Preserve iframes (extract them first)
    const iframes = [];
    html = html.replace(/<iframe[^>]*>.*?<\/iframe>/gs, (match) => {
        iframes.push(match);
        return `__IFRAME_${iframes.length - 1}__`;
    });

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Code blocks
    html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');

    // Unordered lists (multi-line)
    html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

    // Split into paragraphs by double newlines
    let paragraphs = html.split(/\n\n+/);
    paragraphs = paragraphs.map(para => {
        para = para.trim();
        if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<pre') || para.startsWith('__IFRAME')) {
            return para;
        }
        if (para) {
            return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
        }
        return '';
    });
    html = paragraphs.join('\n');

    // Restore iframes
    iframes.forEach((iframe, index) => {
        html = html.replace(`<p>__IFRAME_${index}__</p>`, iframe);
    });

    return html;
}

// Load week content
function loadWeek(type, weekNum) {
    const weekPad = String(weekNum).padStart(2, '0');
    let filePath = `${type}/week${weekPad}.md`;
    const contentId = type === 'makes' ? 'makes-content' : 'reflections-content';
    
    // Handle cases where week doesn't exist
    const validWeeks = {
        makes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        reflections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    };

    if (!validWeeks[type] || !validWeeks[type].includes(weekNum)) {
        document.getElementById(contentId).innerHTML = '<p>Content not available for this week.</p>';
        return;
    }

    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const htmlContent = markdownToHtml(data);
            document.getElementById(contentId).innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error loading file:', error);
            document.getElementById(contentId).innerHTML = '<p>Error loading content. Please try again.</p>';
        });
}

// Load page content
function loadPage(pageName) {
    const filePath = `pages/${pageName}.md`;

    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const htmlContent = markdownToHtml(data);
            document.getElementById('page-content').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error loading file:', error);
            document.getElementById('page-content').innerHTML = '<p>Error loading content. Please try again.</p>';
        });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
});

// Open week in new tab
function openWeekInNewTab(type, weekNum) {
    window.open(`week.html?type=${type}&week=${weekNum}`, '_blank');
}
