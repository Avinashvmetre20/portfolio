// AI Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    // Chatbot DOM elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Portfolio knowledge base
    const portfolioData = {
        name: "Avinash",
        role: "Backend Developer",
        skills: ["JavaScript", "Java", "Node.js", "Express.js", "MongoDB", "MySQL", "Git", "DSA", "Socket.io", "JWT", "Redis", "Cloudinary"],
        projects: [
            {
                name: "Employee Management System",
                description: "A secure employee management system with role-based access, image uploads via Cloudinary, and RESTful CRUD operations. Features JWT authentication, employee data/picture management, and pagination.",
                tech: ["JavaScript", "Node.js", "Express.js", "MongoDB", "JWT", "Cloudinary"],
                github: "https://github.com/Avinashvmetre20/Employee-management-syatem",
                demo: "https://employeem.netlify.app/"
            },
            {
                name: "OpenChat - Real-time Chat Application",
                description: "A real-time chat application with 1:1 and group messaging, built with Node.js and Socket.io. Features include typing indicators, online status, read receipts, JWT authentication, and MongoDB storage.",
                tech: ["Node.js", "Socket.io", "Express.js", "MongoDB", "JWT", "HTML5", "JavaScript"],
                github: "https://github.com/Avinashvmetre20/OpenChat",
                demo: "https://openchat-5ft3.onrender.com"
            },
            {
                name: "Investment Portfolio",
                description: "A financial dashboard integrating real-time crypto/stock market APIs with Redis caching. Features include live Bitcoin tracking, market news aggregation, and personal portfolio management with CRUD operations for tracked assets.",
                tech: ["JavaScript", "Node.js", "Express.js", "MongoDB", "Redis", "Socket.io"],
                github: "https://github.com/Avinashvmetre20/B43_WEB_197_Web-Project-192",
                demo: "https://b43-web-197-web-project-192.onrender.com/"
            },
            {
                name: "OpenCart System",
                description: "E-commerce system with dynamic product search, cart functionality, and performance optimization.",
                tech: ["JavaScript", "Firebase", "HTML5", "CSS3"],
                github: "https://github.com/Avinashvmetre20/eCart",
                demo: "https://opencart1.netlify.app/"
            }
        ],
        education: [
            {
                institution: "Masai School",
                degree: "Backend Developer",
                period: "2024 - present"
            },
            {
                institution: "Dr. Ambedkar Institute of Technology",
                degree: "B.E. in Computer Science and Engineering",
                period: "2020 - 2024"
            },
            {
                institution: "Diamond Ind PU Science College",
                degree: "Pre-University Course (Science)",
                period: "2018 - 2020"
            },
            {
                institution: "Basavateertha Vidya Peeta High School",
                degree: "SSLC (Secondary School Leaving Certificate)",
                period: "2018"
            }
        ],
        certifications: [
            {
                name: "Database Management System (NPTEL)",
                year: "2022"
            },
            {
                name: "Google Cloud Computing Foundations (NPTEL)",
                year: "2021"
            }
        ],
        contact: {
            phone: "+91 6360639208",
            email: "avinashvmetre20@gmail.com",
            location: "Bengaluru, India",
            github: "https://github.com/Avinashvmetre20",
            linkedin: "https://www.linkedin.com/in/avinashvmetre20/"
        }
    };

    // Enhanced AI API Integration with two-step approach
    const GEMINI_API_KEY = "AIzaSyCowUbrCLivE9CM_7kvrjymS59UIfStmY4";
    
    async function callGeminiAI(userMessage) {
        try {
            // Step 1: Initial API call to understand the question
            const initialPrompt = `
You are an AI assistant for Avinash's portfolio website. A user has asked: "${userMessage}"

Please analyze this question and tell me:
1. What type of information they're looking for (project details, technology, contact, education, etc.)
2. Which specific project(s) they might be referring to
3. What specific details would be most relevant to answer their question
4. If they're asking about which projects use a specific technology, identify that technology

Respond in a structured format like:
TYPE: [project/technology/contact/education/general]
PROJECTS: [list relevant project names if any]
TECHNOLOGY: [if asking about specific technology]
DETAILS_NEEDED: [what specific information to gather]
            `;

            const initialResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GEMINI_API_KEY}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: initialPrompt
                        }]
                    }]
                })
            });

            if (!initialResponse.ok) {
                throw new Error(`HTTP error! status: ${initialResponse.status}`);
            }

            const initialData = await initialResponse.json();
            const analysis = initialData.candidates[0].content.parts[0].text;

            // Step 2: Search through project data based on analysis
            const relevantData = await searchProjectData(userMessage, analysis);

            // Step 3: Final API call with collected data for perfect answer
            const finalPrompt = `
You are an AI assistant for Avinash's portfolio website. 

**User Question:** ${userMessage}

**Relevant Portfolio Data:**
${relevantData}

**Analysis of Question:** ${analysis}

Please provide a perfect, contextual answer to the user's question using the relevant data above. 

IMPORTANT INSTRUCTIONS:
1. Be direct and specific to what was asked
2. Use emojis and formatting to make responses engaging
3. For YES/NO questions, use ✅/❌ format
4. For technology questions, be specific about what's used
5. For project details, provide comprehensive information
6. For contact questions, provide all contact details
7. For COUNT questions (how many projects use X), provide the number and list the projects
8. Keep responses concise but informative
9. If information is not available, suggest contacting Avinash directly

Provide a helpful, professional response that directly answers the user's question.
            `;

            const finalResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GEMINI_API_KEY}`
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: finalPrompt
                        }]
                    }]
                })
            });

            if (!finalResponse.ok) {
                throw new Error(`HTTP error! status: ${finalResponse.status}`);
            }

            const finalData = await finalResponse.json();
            
            if (finalData.candidates && finalData.candidates[0] && finalData.candidates[0].content && finalData.candidates[0].content.parts[0]) {
                return finalData.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from AI API');
            }
        } catch (error) {
            console.error('AI API Error:', error);
            // Fallback to static responses if API fails
            return generateFallbackResponse(userMessage);
        }
    }

    // Function to search and collect relevant project data
    async function searchProjectData(userMessage, analysis) {
        const message = userMessage.toLowerCase();
        let relevantData = '';

        // Add personal information
        relevantData += `**Personal Information:**\n`;
        relevantData += `- Name: ${portfolioData.name}\n`;
        relevantData += `- Role: ${portfolioData.role}\n`;
        relevantData += `- Contact: ${portfolioData.contact.email}, ${portfolioData.contact.phone}, ${portfolioData.contact.location}\n\n`;

        // Add technical skills
        relevantData += `**Technical Skills:** ${portfolioData.skills.join(', ')}\n\n`;

        // Search for relevant projects
        for (let project of portfolioData.projects) {
            const projectNameLower = project.name.toLowerCase();
            const projectWords = project.name.split(' ').map(word => word.toLowerCase());
            
            // Check if this project is relevant to the question
            if (message.includes(projectNameLower) || 
                projectWords.some(word => message.includes(word)) ||
                message.includes('chat') && project.name.includes('Chat') ||
                message.includes('employee') && project.name.includes('Employee') ||
                message.includes('investment') && project.name.includes('Investment') ||
                message.includes('cart') && project.name.includes('Cart') ||
                analysis.toLowerCase().includes(project.name.toLowerCase())) {
                
                relevantData += `**Project: ${project.name}**\n`;
                relevantData += `- Description: ${project.description}\n`;
                relevantData += `- Technologies: ${project.tech.join(', ')}\n`;
                relevantData += `- GitHub: ${project.github}\n`;
                relevantData += `- Live Demo: ${project.demo}\n\n`;
            }
        }

        // Add education if relevant
        if (message.includes('education') || message.includes('degree') || message.includes('study') || analysis.toLowerCase().includes('education')) {
            relevantData += `**Education:**\n`;
            portfolioData.education.forEach(edu => {
                relevantData += `- ${edu.institution}: ${edu.degree} (${edu.period})\n`;
            });
            relevantData += `\n`;
        }

        // Add certifications if relevant
        if (message.includes('certification') || message.includes('certificate') || analysis.toLowerCase().includes('certification')) {
            relevantData += `**Certifications:**\n`;
            portfolioData.certifications.forEach(cert => {
                relevantData += `- ${cert.name} (${cert.year})\n`;
            });
            relevantData += `\n`;
        }

        // Add contact information if relevant
        if (message.includes('contact') || message.includes('email') || message.includes('phone') || analysis.toLowerCase().includes('contact')) {
            relevantData += `**Contact Information:**\n`;
            relevantData += `- Email: ${portfolioData.contact.email}\n`;
            relevantData += `- Phone: ${portfolioData.contact.phone}\n`;
            relevantData += `- Location: ${portfolioData.contact.location}\n`;
            relevantData += `- GitHub: ${portfolioData.contact.github}\n`;
            relevantData += `- LinkedIn: ${portfolioData.contact.linkedin}\n\n`;
        }

        return relevantData;
    }

    // Fallback response generator (original static logic)
    function generateFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return `Hello! I'm here to help you learn more about ${portfolioData.name}'s portfolio. What would you like to know?`;
        }
        
        // Technology-specific questions (which projects use X)
        if (message.includes('which') && message.includes('projects') && message.includes('use')) {
            const techKeywords = ['cloudinary', 'mongodb', 'node', 'express', 'jwt', 'socket', 'redis', 'firebase', 'html', 'css', 'javascript'];
            for (let tech of techKeywords) {
                if (message.includes(tech)) {
                    const projectsUsingTech = portfolioData.projects.filter(project => 
                        project.tech.some(technology => technology.toLowerCase().includes(tech))
                    );
                    
                    if (projectsUsingTech.length > 0) {
                        let response = `🛠️ Projects using ${tech.toUpperCase()}:\n\n`;
                        projectsUsingTech.forEach(project => {
                            response += `• **${project.name}**\n`;
                        });
                        return response;
                    } else {
                        return `❌ No projects use ${tech.toUpperCase()}`;
                    }
                }
            }
        }
        
        // Count-based questions (how many projects use X)
        if ((message.includes('how many') || message.includes('in how many')) && message.includes('projects') && message.includes('use')) {
            const techKeywords = ['cloudinary', 'mongodb', 'node', 'express', 'jwt', 'socket', 'redis', 'firebase', 'html', 'css', 'javascript'];
            for (let tech of techKeywords) {
                if (message.includes(tech)) {
                    const projectsUsingTech = portfolioData.projects.filter(project => 
                        project.tech.some(technology => technology.toLowerCase().includes(tech))
                    );
                    
                    if (projectsUsingTech.length > 0) {
                        let response = `📊 **${projectsUsingTech.length} project${projectsUsingTech.length > 1 ? 's' : ''}** use ${tech.toUpperCase()}:\n\n`;
                        projectsUsingTech.forEach(project => {
                            response += `• **${project.name}**\n`;
                        });
                        return response;
                    } else {
                        return `❌ **0 projects** use ${tech.toUpperCase()}`;
                    }
                }
            }
        }
        
        // About Avinash
        if (message.includes('who') && message.includes('avinash') || message.includes('about') && message.includes('avinash')) {
            return `${portfolioData.name} is a ${portfolioData.role} with expertise in backend development. He's proficient in JavaScript, Java, Node.js, and Generative AI, with a strong foundation in backend development. He's known for problem-solving skills and thrives in collaborative environments.`;
        }
        
        // Skills
        if (message.includes('skill') || message.includes('technology') || message.includes('tech stack')) {
            return `${portfolioData.name}'s technical skills include: ${portfolioData.skills.join(', ')}. He specializes in backend development with Node.js, Express.js, and various databases like MongoDB and MySQL.`;
        }
        
        // Enhanced project search with flexible question understanding
        for (let project of portfolioData.projects) {
            const projectNameLower = project.name.toLowerCase();
            const projectWords = project.name.split(' ').map(word => word.toLowerCase());
            
            // Check for specific project mentions (more flexible matching)
            if (message.includes(projectNameLower) || 
                projectWords.some(word => message.includes(word)) ||
                message.includes('chat') && project.name.includes('Chat') ||
                message.includes('employee') && project.name.includes('Employee') ||
                message.includes('investment') && project.name.includes('Investment') ||
                message.includes('cart') && project.name.includes('Cart')) {
                
                // If asking for demo link specifically
                if (message.includes('demo') || message.includes('live') || message.includes('link') || message.includes('show me') || message.includes('where can i')) {
                    return `🚀 Live Demo: ${project.demo}`;
                }
                
                // If asking for GitHub link specifically
                if (message.includes('github') || message.includes('code') || message.includes('source') || message.includes('repository')) {
                    return `📂 GitHub: ${project.github}`;
                }
                
                // If asking about technologies used in the project
                if (message.includes('technology') || message.includes('tech') || message.includes('used') || message.includes('technologies') || message.includes('stack') || message.includes('tools') || message.includes('built with') || message.includes('made with')) {
                    // Check if user is asking for yes/no answer
                    if (message.includes('yes or no') || message.includes('say yes or no') || message.includes('is') && (message.includes('used') || message.includes('included'))) {
                        // Check for specific technology mentions
                        if (message.includes('html')) {
                            const hasHtml = project.tech.some(tech => tech.toLowerCase().includes('html'));
                            return hasHtml ? `✅ YES - HTML is used in ${project.name}` : `❌ NO - HTML is not used in ${project.name}`;
                        }
                        if (message.includes('javascript')) {
                            const hasJs = project.tech.some(tech => tech.toLowerCase().includes('javascript'));
                            return hasJs ? `✅ YES - JavaScript is used in ${project.name}` : `❌ NO - JavaScript is not used in ${project.name}`;
                        }
                        if (message.includes('node')) {
                            const hasNode = project.tech.some(tech => tech.toLowerCase().includes('node'));
                            return hasNode ? `✅ YES - Node.js is used in ${project.name}` : `❌ NO - Node.js is not used in ${project.name}`;
                        }
                        if (message.includes('mongodb')) {
                            const hasMongo = project.tech.some(tech => tech.toLowerCase().includes('mongodb'));
                            return hasMongo ? `✅ YES - MongoDB is used in ${project.name}` : `❌ NO - MongoDB is not used in ${project.name}`;
                        }
                        if (message.includes('express')) {
                            const hasExpress = project.tech.some(tech => tech.toLowerCase().includes('express'));
                            return hasExpress ? `✅ YES - Express.js is used in ${project.name}` : `❌ NO - Express.js is not used in ${project.name}`;
                        }
                        if (message.includes('jwt')) {
                            const hasJwt = project.tech.some(tech => tech.toLowerCase().includes('jwt'));
                            return hasJwt ? `✅ YES - JWT is used in ${project.name}` : `❌ NO - JWT is not used in ${project.name}`;
                        }
                        if (message.includes('cloudinary')) {
                            const hasCloudinary = project.tech.some(tech => tech.toLowerCase().includes('cloudinary'));
                            return hasCloudinary ? `✅ YES - Cloudinary is used in ${project.name}` : `❌ NO - Cloudinary is not used in ${project.name}`;
                        }
                        if (message.includes('socket')) {
                            const hasSocket = project.tech.some(tech => tech.toLowerCase().includes('socket'));
                            return hasSocket ? `✅ YES - Socket.io is used in ${project.name}` : `❌ NO - Socket.io is not used in ${project.name}`;
                        }
                        if (message.includes('redis')) {
                            const hasRedis = project.tech.some(tech => tech.toLowerCase().includes('redis'));
                            return hasRedis ? `✅ YES - Redis is used in ${project.name}` : `❌ NO - Redis is not used in ${project.name}`;
                        }
                        if (message.includes('firebase')) {
                            const hasFirebase = project.tech.some(tech => tech.toLowerCase().includes('firebase'));
                            return hasFirebase ? `✅ YES - Firebase is used in ${project.name}` : `❌ NO - Firebase is not used in ${project.name}`;
                        }
                        if (message.includes('css')) {
                            const hasCss = project.tech.some(tech => tech.toLowerCase().includes('css'));
                            return hasCss ? `✅ YES - CSS is used in ${project.name}` : `❌ NO - CSS is not used in ${project.name}`;
                        }
                    }
                    return `🛠️ Technologies used in ${project.name}: ${project.tech.join(', ')}`;
                }
                
                // If asking about the USE or PURPOSE of the project
                if (message.includes('use') || message.includes('purpose') || message.includes('what') || message.includes('why') || message.includes('benefit') || message.includes('application') || message.includes('how does') || message.includes('what does') || message.includes('explain')) {
                    return `💡 ${project.name} is used for: ${project.description}`;
                }
                
                // If asking for project details
                return `**${project.name}**: ${project.description}\n\nTechnologies used: ${project.tech.join(', ')}\n\n📂 GitHub: ${project.github}\n🚀 Live Demo: ${project.demo}`;
            }
        }
        
        // Projects (general)
        if (message.includes('project') || message.includes('work') || message.includes('portfolio') || message.includes('what projects') || message.includes('show projects')) {
            let response = `${portfolioData.name} has worked on several impressive projects:\n\n`;
            portfolioData.projects.forEach((project, index) => {
                response += `${index + 1}. **${project.name}**: ${project.description}\n`;
                response += `   Technologies: ${project.tech.join(', ')}\n\n`;
            });
            return response;
        }
        
        // Education
        if (message.includes('education') || message.includes('degree') || message.includes('study') || message.includes('where did') || message.includes('university') || message.includes('college')) {
            let response = `${portfolioData.name}'s education background:\n\n`;
            portfolioData.education.forEach(edu => {
                response += `• ${edu.institution} - ${edu.degree} (${edu.period})\n`;
            });
            return response;
        }
        
        // Contact information
        if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('reach') || message.includes('how to contact') || message.includes('get in touch')) {
            return `You can reach ${portfolioData.name} at:\n\n📧 Email: ${portfolioData.contact.email}\n📱 Phone: ${portfolioData.contact.phone}\n📍 Location: ${portfolioData.contact.location}\n\nSocial Links:\n🔗 GitHub: ${portfolioData.contact.github}\n🔗 LinkedIn: ${portfolioData.contact.linkedin}`;
        }
        
        // Experience
        if (message.includes('experience') || message.includes('background') || message.includes('career') || message.includes('work experience')) {
            return `${portfolioData.name} is a dynamic software developer with expertise in backend development using JavaScript, Node.js, and modern frameworks. He has proven ability to develop secure, scalable applications with features like role-based access control, real-time data integration, and performance optimization. He's a quick learner with demonstrated ability to rapidly acquire new technologies.`;
        }
        
        // Certifications
        if (message.includes('certification') || message.includes('certificate') || message.includes('certified')) {
            let response = `${portfolioData.name} has the following certifications:\n\n`;
            portfolioData.certifications.forEach(cert => {
                response += `• ${cert.name} (${cert.year})\n`;
            });
            return response;
        }
        
        // Unknown queries - redirect to contact
        return `I don't have specific information about that. For detailed questions or inquiries, please contact ${portfolioData.name} directly:\n\n📧 Email: ${portfolioData.contact.email}\n📱 Phone: ${portfolioData.contact.phone}\n\nHe'll be happy to help you with any specific questions!`;
    }

    // Add message to chat
    function addMessage(content, isUser = false, isAI = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (!isUser) {
            const icon = document.createElement('i');
            icon.className = isAI ? 'fas fa-brain' : 'fas fa-robot';
            icon.title = isAI ? 'AI Powered Response' : 'Bot Response';
            messageContent.appendChild(icon);
        }
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = content;
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(messageContent);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator-message';
        typingDiv.id = 'typing-indicator';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        messageContent.appendChild(icon);
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        messageContent.appendChild(typingIndicator);
        typingDiv.appendChild(messageContent);
        chatbotMessages.appendChild(typingDiv);
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Handle user input with AI integration
    async function handleUserInput() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        // Add user message
        addMessage(message, true);
        chatbotInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        const startTime = Date.now();
        let response = '';
        let responseType = 'fallback';
        
        try {
            // Try AI API first
            response = await callGeminiAI(message);
            responseType = 'ai_powered';
            removeTypingIndicator();
            addMessage(response, false, true); // Pass isAI as true for AI response
        } catch (error) {
            console.error('AI API failed, using fallback:', error);
            // Fallback to static responses
            setTimeout(() => {
                removeTypingIndicator();
                response = generateFallbackResponse(message);
                responseType = 'fallback';
                addMessage(response, false, false); // Pass isAI as false for fallback response
            }, 1000);
        }
        
        const responseTime = Date.now() - startTime;
        
        // Log the interaction
        logInteraction(message, response, responseType, responseTime);
    }
    
    // Function to log chatbot interactions
    async function logInteraction(userQuestion, botResponse, responseType, responseTime) {
        try {
            const timestamp = new Date().toISOString();
            const date = timestamp.split('T')[0];
            const time = timestamp.split('T')[1].split('.')[0];
            
            const interaction = {
                id: Date.now().toString(),
                timestamp: timestamp,
                date: date,
                time: time,
                user_question: userQuestion,
                bot_response: botResponse,
                response_type: responseType,
                response_time_ms: responseTime,
                user_session_id: getSessionId()
            };
            
            // Get existing logs from localStorage or create new
            let logs = { chatbot_interactions: [], metadata: {} };
            const existingLogs = localStorage.getItem('chatbot_logs');
            if (existingLogs) {
                logs = JSON.parse(existingLogs);
            }
            
            // Add new interaction
            logs.chatbot_interactions.push(interaction);
            
            // Update metadata
            logs.metadata = {
                total_interactions: logs.chatbot_interactions.length,
                first_interaction: logs.chatbot_interactions[0]?.timestamp || timestamp,
                last_interaction: timestamp,
                ai_powered_responses: logs.chatbot_interactions.filter(i => i.response_type === 'ai_powered').length,
                fallback_responses: logs.chatbot_interactions.filter(i => i.response_type === 'fallback').length,
                average_response_time_ms: Math.round(
                    logs.chatbot_interactions.reduce((sum, i) => sum + i.response_time_ms, 0) / logs.chatbot_interactions.length
                ),
                most_common_questions: getMostCommonQuestions(logs.chatbot_interactions),
                file_updated: new Date().toISOString(),
                version: "1.0"
            };
            
            // Store in localStorage
            localStorage.setItem('chatbot_logs', JSON.stringify(logs));
            
            console.log('Chatbot interaction logged to localStorage:', interaction);
            
            // Save to file immediately after every interaction
            console.log('Saving conversation to file immediately...');
            await saveConversationToFile(interaction);
            
        } catch (error) {
            console.error('Error logging interaction:', error);
        }
    }
    
    // Function to get session ID
    function getSessionId() {
        let sessionId = localStorage.getItem('chatbot_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now();
            localStorage.setItem('chatbot_session_id', sessionId);
        }
        return sessionId;
    }
    
    // Function to analyze most common questions
    function getMostCommonQuestions(interactions) {
        const questionTypes = interactions.map(interaction => {
            const question = interaction.user_question.toLowerCase();
            if (question.includes('project') || question.includes('work')) return 'project information';
            if (question.includes('technology') || question.includes('tech') || question.includes('use')) return 'technology usage';
            if (question.includes('contact') || question.includes('email') || question.includes('phone')) return 'contact details';
            if (question.includes('skill') || question.includes('expertise')) return 'skills information';
            if (question.includes('education') || question.includes('degree')) return 'education information';
            if (question.includes('demo') || question.includes('link')) return 'demo links';
            return 'general inquiry';
        });
        
        const counts = {};
        questionTypes.forEach(type => {
            counts[type] = (counts[type] || 0) + 1;
        });
        
        return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 3);
    }

    // Function to save each conversation immediately to file
    async function saveConversationToFile(newInteraction) {
        try {
            // Get existing conversations from localStorage
            let allConversations = JSON.parse(localStorage.getItem('all_conversations') || '{"conversations": [], "metadata": {}}');
            
            // Add new conversation
            allConversations.conversations.push({
                id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                session_id: getSessionId(),
                user_question: newInteraction.user_question,
                bot_response: newInteraction.bot_response,
                response_type: newInteraction.response_type,
                response_time_ms: newInteraction.response_time_ms
            });
            
            // Update metadata
            allConversations.metadata = {
                total_conversations: allConversations.conversations.length,
                unique_users: new Set(allConversations.conversations.map(c => c.session_id)).size,
                first_conversation: allConversations.conversations[0]?.timestamp || newInteraction.timestamp,
                last_conversation: newInteraction.timestamp,
                file_updated: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('all_conversations', JSON.stringify(allConversations));
            
            console.log('Conversation saved to localStorage. Total conversations:', allConversations.conversations.length);
            
        } catch (error) {
            console.error('Error saving conversation to localStorage:', error);
        }
    }

    // Function to save localStorage data to chatbot_logs.json file
    async function saveLocalStorageToFile() {
        try {
            // Get data from localStorage
            const localStorageData = localStorage.getItem('chatbot_logs');
            if (!localStorageData) {
                console.log('No chatbot logs found in localStorage');
                return;
            }

            const localStorageLogs = JSON.parse(localStorageData);
            
            // Read existing file data
            let existingLogs = { chatbot_interactions: [], metadata: {} };
            try {
                const response = await fetch('assets/chatbot_logs.json');
                if (response.ok) {
                    existingLogs = await response.json();
                }
            } catch (error) {
                console.log('Creating new logs file');
            }

            // Merge localStorage data with existing file data
            const mergedLogs = mergeChatbotLogs(existingLogs, localStorageLogs);
            
            // Update metadata
            mergedLogs.metadata = {
                total_interactions: mergedLogs.chatbot_interactions.length,
                first_interaction: mergedLogs.chatbot_interactions[0]?.timestamp || new Date().toISOString(),
                last_interaction: mergedLogs.chatbot_interactions[mergedLogs.chatbot_interactions.length - 1]?.timestamp || new Date().toISOString(),
                ai_powered_responses: mergedLogs.chatbot_interactions.filter(i => i.response_type === 'ai_powered').length,
                fallback_responses: mergedLogs.chatbot_interactions.filter(i => i.response_type === 'fallback').length,
                average_response_time_ms: Math.round(
                    mergedLogs.chatbot_interactions.reduce((sum, i) => sum + i.response_time_ms, 0) / mergedLogs.chatbot_interactions.length
                ),
                most_common_questions: getMostCommonQuestions(mergedLogs.chatbot_interactions),
                file_updated: new Date().toISOString(),
                version: "1.0"
            };

            // Save to file using a server endpoint (in a real application)
            // For now, we'll log the data that would be saved
            console.log('Saving merged chatbot logs to file:', mergedLogs);
            
            // In a real application, you would send this data to a server endpoint
            // await fetch('/api/save-chatbot-logs', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(mergedLogs)
            // });

            // For demonstration, we'll create a downloadable JSON file
            downloadJSONFile(mergedLogs, 'chatbot_logs_updated.json');
            
            // Clear localStorage after successful save
            localStorage.removeItem('chatbot_logs');
            console.log('Chatbot logs saved to file and localStorage cleared');
            
        } catch (error) {
            console.error('Error saving localStorage data to file:', error);
        }
    }

    // Function to merge chatbot logs from different sources
    function mergeChatbotLogs(existingLogs, newLogs) {
        const mergedInteractions = [...existingLogs.chatbot_interactions];
        
        // Add new interactions, avoiding duplicates based on id
        newLogs.chatbot_interactions.forEach(newInteraction => {
            const existingIndex = mergedInteractions.findIndex(existing => existing.id === newInteraction.id);
            if (existingIndex === -1) {
                mergedInteractions.push(newInteraction);
            } else {
                // Update existing interaction if newer
                if (new Date(newInteraction.timestamp) > new Date(mergedInteractions[existingIndex].timestamp)) {
                    mergedInteractions[existingIndex] = newInteraction;
                }
            }
        });

        // Sort by timestamp
        mergedInteractions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return {
            chatbot_interactions: mergedInteractions,
            metadata: existingLogs.metadata
        };
    }

    // Function to download JSON file (for demonstration purposes)
    function downloadJSONFile(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Function to load and process localStorage data
    function loadLocalStorageData() {
        try {
            const localStorageData = localStorage.getItem('chatbot_logs');
            if (localStorageData) {
                const logs = JSON.parse(localStorageData);
                console.log('Found chatbot logs in localStorage:', logs);
                return logs;
            }
        } catch (error) {
            console.error('Error loading localStorage data:', error);
        }
        return null;
    }

    // Function to manually trigger saving localStorage data to file
    function saveChatbotLogsToFile() {
        saveLocalStorageToFile();
    }

    // Function to display current localStorage data
    function displayLocalStorageData() {
        const localStorageData = localStorage.getItem('chatbot_logs');
        if (localStorageData) {
            const logs = JSON.parse(localStorageData);
            console.log('Current localStorage chatbot logs:', logs);
            return logs;
        } else {
            console.log('No chatbot logs found in localStorage');
            return null;
        }
    }

    // Function to export all conversations from localStorage
    function exportAllConversations() {
        try {
            const allConversations = localStorage.getItem('all_conversations');
            if (allConversations) {
                const data = JSON.parse(allConversations);
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = 'all_conversations.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                console.log('All conversations exported successfully');
                return true;
            } else {
                console.log('No conversations found to export');
                return false;
            }
        } catch (error) {
            console.error('Error exporting conversations:', error);
            return false;
        }
    }

    // Add functions to window object for manual triggering and debugging
    window.saveChatbotLogsToFile = saveChatbotLogsToFile;
    window.displayLocalStorageData = displayLocalStorageData;
    window.exportAllConversations = exportAllConversations;

    // Auto-save localStorage data when page is about to be unloaded
    window.addEventListener('beforeunload', () => {
        const localStorageData = localStorage.getItem('chatbot_logs');
        if (localStorageData) {
            // Send data to server or save to file before page unload
            console.log('Page unloading - saving chatbot logs...');
            // In a real application, you would send this data to a server
            // For now, we'll just log it
            const logs = JSON.parse(localStorageData);
            console.log('Chatbot logs to save:', logs);
        }
    });

    // Event listeners
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    chatbotSend.addEventListener('click', handleUserInput);

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Export button functionality
    const chatbotExport = document.getElementById('chatbot-export');
    if (chatbotExport) {
        chatbotExport.addEventListener('click', async () => {
            try {
                chatbotExport.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                chatbotExport.disabled = true;
                
                // Export all conversations from localStorage
                const success = exportAllConversations();
                
                if (success) {
                    addMessage('✅ All conversations exported successfully! Check your downloads folder for the JSON file.', false, false);
                } else {
                    addMessage('ℹ️ No conversations found to export.', false, false);
                }
                
                setTimeout(() => {
                    chatbotExport.innerHTML = '<i class="fas fa-download"></i>';
                    chatbotExport.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('Export error:', error);
                addMessage('❌ Error exporting conversations. Please try again.', false, false);
                
                chatbotExport.innerHTML = '<i class="fas fa-download"></i>';
                chatbotExport.disabled = false;
            }
        });
    }

    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
            chatbotContainer.classList.remove('active');
        }
    });
}); 