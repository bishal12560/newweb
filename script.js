// Chat Widget Functionality
const chatWidget = document.getElementById('chatWidget');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const typingIndicator = document.getElementById('typingIndicator');
const sendButton = document.getElementById('sendButton');

let conversationHistory = [{
    role: 'system',
    content: CONFIG.SYSTEM_PROMPT
}];

function openChat() {
    chatWidget.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageInput.focus();
}

function closeChat() {
    chatWidget.style.display = 'none';
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatMessages.innerHTML = '';
        conversationHistory = [{
            role: 'system',
            content: CONFIG.SYSTEM_PROMPT
        }];
        addMessage('👋 Hello! I\'m FixaPhone AI Assistant. How can I help you with your device repair needs today?', 'support');
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Disable input and show sending state
    messageInput.value = '';
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Add user message
    addMessage(message, 'user');

    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Show typing indicator
    typingIndicator.style.display = 'flex';

    try {
        const response = await getAIResponse(message);
        addMessage(response, 'support');
        
        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: response
        });
    } catch (error) {
        console.error('Error:', error);
        addMessage('I apologize, but I\'m having trouble connecting right now. Please try again later or contact our support team directly.', 'support error');
    }

    // Re-enable input and hide typing indicator
    messageInput.disabled = false;
    sendButton.disabled = false;
    typingIndicator.style.display = 'none';
    messageInput.focus();
}

async function getAIResponse(message) {
    try {
        const response = await fetch(CONFIG.OPENAI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: conversationHistory,
                max_tokens: CONFIG.MAX_TOKENS,
                temperature: CONFIG.TEMPERATURE
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Parse markdown and sanitize HTML
    const sanitizedContent = DOMPurify.sanitize(marked.parse(content));
    messageContent.innerHTML = sanitizedContent;
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendSuggestedMessage(message) {
    messageInput.value = message;
    sendMessage();
}

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Enter to send (Shift+Enter for new line)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80; // Adjust based on header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Highlight
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-card, .service-card, .brand-card, .hero-content').forEach(element => {
    observer.observe(element);
});

// Booking Form Functionality
const bookingForm = document.getElementById('bookingForm');
const deviceType = document.getElementById('deviceType');
const mobileServices = document.getElementById('mobileServices');
const computerServices = document.getElementById('computerServices');
const successModal = document.getElementById('successModal');
const closeModal = document.querySelector('.close-modal');

// Handle device type change
deviceType.addEventListener('change', function() {
    // Hide all service divs first
    mobileServices.style.display = 'none';
    computerServices.style.display = 'none';
    
    // Show relevant service div based on selection
    if (this.value === 'mobile') {
        mobileServices.style.display = 'block';
        document.getElementById('mobileService').required = true;
        document.getElementById('computerService').required = false;
    } else if (this.value === 'computer') {
        computerServices.style.display = 'block';
        document.getElementById('computerService').required = true;
        document.getElementById('mobileService').required = false;
    }
});

// Set minimum date for service booking
const preferredDate = document.getElementById('preferredDate');
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
preferredDate.min = tomorrow.toISOString().split('T')[0];

// Form submission handler
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    const bookingData = Object.fromEntries(formData.entries());
    
    // Add timestamp
    bookingData.submittedAt = new Date().toISOString();
    
    // Store booking data (you can modify this to send to your backend)
    console.log('Booking Data:', bookingData);
    
    // Show success modal
    successModal.style.display = 'block';
    
    // Reset form
    this.reset();
    mobileServices.style.display = 'none';
    computerServices.style.display = 'none';
});

// Close modal when clicking the close button
closeModal.addEventListener('click', function() {
    successModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Form validation
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
});

// Update price estimate based on service selection
function updatePriceEstimate() {
    const selectedDevice = deviceType.value;
    const mobileService = document.getElementById('mobileService');
    const computerService = document.getElementById('computerService');
    
    let estimatedPrice = '';
    
    if (selectedDevice === 'mobile') {
        switch(mobileService.value) {
            case 'screen':
                estimatedPrice = '4,000 - 12,000 NPR';
                break;
            case 'battery':
                estimatedPrice = '2,500 - 4,500 NPR';
                break;
            case 'charging':
                estimatedPrice = '1,500 - 3,000 NPR';
                break;
            // Add more cases as needed
        }
    } else if (selectedDevice === 'computer') {
        switch(computerService.value) {
            case 'hardware':
                estimatedPrice = '2,000 - 15,000 NPR';
                break;
            case 'software':
                estimatedPrice = '1,500 - 3,000 NPR';
                break;
            case 'virus':
                estimatedPrice = '1,000 - 2,000 NPR';
                break;
            case 'data':
                estimatedPrice = '3,000 - 10,000 NPR';
                break;
            case 'upgrade':
                estimatedPrice = '5,000 - 25,000 NPR';
                break;
            case 'network':
                estimatedPrice = '1,500 - 5,000 NPR';
                break;
            case 'os':
                estimatedPrice = '1,500 - 3,000 NPR';
                break;
        }
    }
    
    // Update price estimate display if you have a price display element
    // const priceEstimate = document.getElementById('priceEstimate');
    // if (priceEstimate && estimatedPrice) {
    //     priceEstimate.textContent = `Estimated Price: ${estimatedPrice}`;
    // }
}

// Add change event listeners for price updates
deviceType.addEventListener('change', updatePriceEstimate);
if (document.getElementById('mobileService')) {
    document.getElementById('mobileService').addEventListener('change', updatePriceEstimate);
}
if (document.getElementById('computerService')) {
    document.getElementById('computerService').addEventListener('change', updatePriceEstimate);
}

// Initialize current year in footer
document.querySelector('.footer-bottom p').innerHTML = 
    `&copy; ${new Date().getFullYear()} FixaPhone Nepal. All rights reserved.`;
