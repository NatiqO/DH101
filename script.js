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

    // Unordered lists
    html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up multiple p tags
    html = html.replace(/<\/p><p>/g, '</p><p>');
    html = html.replace(/<p><\/p>/g, '');

    return html;
}

// Load week content
function loadWeek(type, weekNum) {
    const weekPad = String(weekNum).padStart(2, '0');
    let filePath = `${type}/week${weekPad}.md`;
    
    // Handle cases where week doesn't exist
    const validWeeks = {
        makes: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        reflections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    };

    if (!validWeeks[type] || !validWeeks[type].includes(weekNum)) {
        document.getElementById('week-content').innerHTML = '<p>Content not available for this week.</p>';
        return;
    }

    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const htmlContent = markdownToHtml(data);
            document.getElementById('week-content').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error loading file:', error);
            document.getElementById('week-content').innerHTML = '<p>Error loading content. Please try again.</p>';
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
