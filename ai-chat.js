// NASS AI Chat Assistant
// Version 1.2.0

document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('ai-chat-widget');
    const openButton = document.getElementById('ai-chat-open');
    const closeButton = document.getElementById('ai-chat-close');
    const sendButton = document.getElementById('ai-chat-send');
    const chatInput = document.getElementById('ai-chat-input');
    const messagesContainer = document.getElementById('ai-chat-messages');

    // --- Knowledge Base ---
    const knowledgeBase = {
        "admission process": "To apply for admission, you need to purchase an application form, fill it out, and submit it with your academic transcripts and two passport-sized photos. After submission, you will be scheduled for an entrance exam and an interview.",
        "admission requirements": "Applicants are required to have a pass in at least six subjects, including English and Mathematics, in the Basic Education Certificate Examination (BECE).",
        "programs": "We offer a variety of programs including Science, General Arts, Business, Visual Arts, and Home Economics. Each program is designed to provide students with a comprehensive education.",
        "facilities": "Our school is equipped with modern facilities including science laboratories, a library, a computer lab, sports facilities, an agricultural school farm, administration block, visual arts department, dining hall, student dormitories, and assembly hall to support comprehensive student learning and development.",
        "agricultural farm": "Our school has an Agricultural School Farm that provides practical agricultural training where students learn modern farming techniques and agricultural science. The farm includes crop cultivation areas, livestock management section, agricultural equipment and tools, and promotes hands-on learning with sustainable farming practices.",
        "farm": "Our Agricultural School Farm offers practical training in modern farming techniques, crop cultivation, livestock management, and sustainable farming practices. It provides students with hands-on learning experience in agricultural science.",
        "history": "NEW ABIREM/AFOSU SENIOR HIGH was founded in 2013 with the mission to provide quality education and foster moral values in students. The school has since grown to become a center of excellence in the region.",
        "values": "Our core values are Unity and Service. We believe in fostering a sense of community and encouraging our students to contribute positively to society.",
        "contact": "You can contact us via phone at +233 XX XXX XXXX or email at info@nafshts.edu.gh. Our office is located in New Abirem, Ghana.",
        "anthem": "NEW ABIREM/AFOSU SENIOR HIGH SCHOOL ANTHEM:\n\nVerse:\nArise oh! NASS to achieve your goals,\nThe purpose of the school is to achieve excellence\nWe need to work, learn and serve from our hearts,\nWith God all things are possible\nWe shall surely gain the prize\n\nRefrain:\nUnity and service\nUnity and service\nUnity and service\nWe shall surely gain the prize\n\nOur Motto: 'Unity and Service'",
        "location": "The school is located in New Abirem/Afosu.",
        "headmaster": "The current Headmaster is Mr. Kwadwo Owusu Fredrick, who serves as the head of administration.",
        "administration": "The school administration consists of: Mr. Kwadwo Owusu Fredrick (Headmaster), Mr. Ernest Twum (Assistant Headmaster - Academics), and Mrs. Alice Frimpomaa (Assistant Headmaster - Domestic). Together they provide leadership and ensure the smooth operation of the school.",
        "assistant headmaster": "The school has two Assistant Headmasters: Mr. Ernest Twum who handles Academic affairs, and Mrs. Alice Frimpomaa who manages Domestic affairs.",
        "academics": "The head of academics is Mr. Ernest Twum, who serves as Assistant Headmaster (Academics). He oversees all academic programs, curriculum implementation, and educational standards at the school.",
        "domestic": "The head of domestic affairs is Mrs. Alice Frimpomaa, who serves as Assistant Headmaster (Domestic). She manages student welfare, boarding facilities, and domestic operations of the school.",
        "assistant headmaster academics": "Mr. Ernest Twum is the Assistant Headmaster in charge of Academics. He oversees all academic programs and educational standards.",
        "assistant headmaster domestic": "Mrs. Alice Frimpomaa is the Assistant Headmaster in charge of Domestic affairs. She manages student welfare and boarding facilities.",
        "only one headmaster": "No, NASS has three headmasters in total: Mr. Kwadwo Owusu Fredrick (Main Headmaster), Mr. Ernest Twum (Assistant Headmaster - Academics), and Mrs. Alice Frimpomaa (Assistant Headmaster - Domestic). Together they form the complete headmaster team that leads the school.",
        "how many headmasters": "NASS has three headmasters: Mr. Kwadwo Owusu Fredrick (Main Headmaster), Mr. Ernest Twum (Assistant Headmaster - Academics), and Mrs. Alice Frimpomaa (Assistant Headmaster - Domestic).",
        "all headmasters": "The complete headmaster team at NASS consists of: Mr. Kwadwo Owusu Fredrick (Main Headmaster), Mr. Ernest Twum (Assistant Headmaster - Academics), and Mrs. Alice Frimpomaa (Assistant Headmaster - Domestic).",
        "default": "I'm sorry, I don't have information on that topic right now. Please try asking another question or contact the school administration for more details."
    };

    // --- Event Listeners ---
    openButton.addEventListener('click', () => toggleChat(true));
    closeButton.addEventListener('click', () => toggleChat(false));
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // --- Functions ---
    function toggleChat(open) {
        if (open) {
            chatWidget.style.display = 'flex';
            if (messagesContainer.children.length === 0) {
                addMessage("Welcome to the NASS AI Assistant! How can I help you today?", 'ai');
            }
        } else {
            chatWidget.style.display = 'none';
        }
    }

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            chatInput.value = '';
            setTimeout(() => {
                getAIResponse(userMessage);
            }, 500);
        }
    }

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getAIResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        let response = knowledgeBase.default;

        // Function to calculate similarity between two strings
        function calculateSimilarity(str1, str2) {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            const editDistance = getEditDistance(longer, shorter);
            return (longer.length - editDistance) / longer.length;
        }

        // Function to calculate edit distance (Levenshtein distance)
        function getEditDistance(str1, str2) {
            const matrix = [];
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
                    if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            return matrix[str2.length][str1.length];
        }

        // Enhanced matching with spell checking and fuzzy matching
        let bestMatch = { key: '', score: 0 };

        for (const key in knowledgeBase) {
            if (key === 'default') continue;

            // Exact match (highest priority)
            if (lowerCaseMessage.includes(key)) {
                response = knowledgeBase[key];
                break;
            }

            // Check for partial matches and similar words
            const words = lowerCaseMessage.split(' ');
            const keyWords = key.split(' ');

            for (const word of words) {
                for (const keyWord of keyWords) {
                    // Check similarity for spell checking
                    const similarity = calculateSimilarity(word, keyWord);
                    if (similarity > 0.7 && similarity > bestMatch.score) {
                        bestMatch = { key: key, score: similarity };
                    }
                }
            }

            // Check for common misspellings and variations
            const commonVariations = {
                'headmaster': ['headmasta', 'head master', 'headmster', 'hedmaster', 'headmater'],
                'administration': ['admin', 'adminstration', 'administation', 'adminstration'],
                'academics': ['academic', 'acadmics', 'acadamic', 'acdemics'],
                'domestic': ['dometic', 'domestc', 'domastic'],
                'assistant': ['asistant', 'assisant', 'assistnt', 'asst'],
                'anthem': ['anthen', 'antem', 'anthm'],
                'facilities': ['facility', 'facilites', 'facilties'],
                'admission': ['admision', 'admissions', 'admision'],
                'programs': ['program', 'progams', 'programmes'],
                'contact': ['contct', 'cantact', 'contat'],
                'location': ['loction', 'locaton', 'place', 'where']
            };

            // Check variations
            if (commonVariations[key]) {
                for (const variation of commonVariations[key]) {
                    if (lowerCaseMessage.includes(variation)) {
                        response = knowledgeBase[key];
                        break;
                    }
                }
                if (response !== knowledgeBase.default) break;
            }
        }

        // Use best fuzzy match if no exact match found
        if (response === knowledgeBase.default && bestMatch.score > 0.7) {
            response = knowledgeBase[bestMatch.key];
        }

        addMessage(response, 'ai');
    }

    console.log("NASS AI Assistant Initialized.");
});
