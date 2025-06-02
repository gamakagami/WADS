import mongoose from 'mongoose';
import connectDB from '../config/db.js';

// Define Chat Schema
const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: {
        messageType: { type: String, default: 'general' },
        productCategory: String,
        sentiment: String,
        language: String
    }
});

// Create indexes for efficient querying
chatSchema.index({ userId: 1, timestamp: -1 });

// Create Chat model
const Chat = mongoose.model('Chat', chatSchema);

// Product knowledge base with enhanced information
const productContext = `
You are a helpful assistant for Semesta Medika, a medical equipment supplier. 
Our main product categories are:
1. Hospital Products
2. Homecare Products  
3. Ward Furnitures
4. Medical Imaging Equipment
5. Health Monitoring Systems

Our Featured Products:

== HEALTH MONITORING SYSTEMS ==

- Health Checkup Station Y-21PC (Blood Pressure Monitor)
  Features: 
    * 10.1" Touch Display (800x1280)
    * Blood pressure measurement (0-300mmHg, ±2mmHg accuracy)
    * Pulse rate monitoring (40-180/min, ±2% accuracy)
    * Multiple login methods (QR code, RFID card, phone number)
    * Thermal printer with automatic paper cut
    * Android 11 OS, 4GB RAM, 64GB storage
    * Optional HD camera (1080P) and microphone for telemedicine
    * WiFi, Bluetooth, RJ45, USB connectivity
    * Compact design: 694.58×463.16×409.33mm, 7.8kg
  Use cases: Hospitals, community clinics, pharmacies, health centers, campus medical rooms
  Technical specs: 110V-240V power, working temp 5°C-40°C

- Height and Weight Scale Y-18PC
  Features:
    * Ultrasonic height sensor (30-205cm, ±5mm accuracy)
    * Weight measurement (2-300kg with varying tolerances)
    * 7" Touch Display (600x1024)
    * BMI calculation (WHO standard)
    * Foldable design for compact storage
    * Thermal printer with automatic cut
    * Multiple login options (auto, QR code, RFID card)
    * WiFi, Bluetooth, RJ45 connectivity
    * Aluminum profile, anti-corrosion design
    * Dimensions: 558.5×385×2350mm, 30kg
  Use cases: Hospitals, airports, pharmacies, health centers, campus medical rooms

== MEDICAL IMAGING EQUIPMENT ==

- Wireless MediCam + LED Light FM-105
  Price: Rp 45.000.000
  Features:
    * Full HD 1080P/720P video recording at 30fps
    * 128GB internal storage
    * WiFi 802.11 b/g/n, Bluetooth 4.0
    * High-performance LED headlight (10,000-25,000 Lux depending on model)
    * Magnification options: 6x, 3x, 2x
    * Instant autofocus (5cm to infinity)
    * 3350mAh removable battery (5 hours working time)
    * Live broadcast capability via iOS/Windows apps
    * Wireless BT pedal support
    * Lightweight: 250g, dimensions: 360×100×150mm
  Applications: Dental medicine, aesthetic medicine, surgery
  Use cases: Hospitals, clinics, medical universities

- Standalone Micro Camera D-5
  Price: Rp 60.000.000
  Features:
    * 4M pixel Full HD sensor (1/3")
    * Focus range: 10-100cm (auto/manual)
    * Magnification: 8x, 6x, 4x zoom ratios
    * 256GB internal storage
    * Full HD 1080P/720P recording
    * HDMI Type-C output
    * LED headlight: 1,500-50,000 Lux with continuous control
    * 5000mAh Li-ion battery (7 hours without headlight, 3 hours with max headlight)
    * WiFi, Bluetooth connectivity
    * iOS/Android/Windows app support
    * Compact: 168×64×54mm, ~200g
    * 1/4" tripod mounting holes
  Applications: Dental, surgical, telemedicine
  Use cases: Hospitals, clinics, medical colleges

== WARD FURNITURE ==

- Examination Couch JCI-1000EC
  Features:
    * Dimensions: 630×2020×530mm (height range: 530-1000mm)
    * Mild steel frame (top: 20×50mm, bottom: 40×80mm)
    * Electric actuator motor with foot controller
    * Hydraulic gas spring back rest (250N, 50kg+ load capacity)
    * Weight capacity: 400kg
    * Heavy duty 3" castors
    * Moveable paper towel holder
    * 4 handle positions for easy maneuvering
    * High-density polyurethane foam with synthetic leather
    * Powder coating finish (lead/cadmium free)
  Manufacturing: 6-axis robotic MIG welding, Fanuc fiber laser cutting, CNC tube bending

- Therapy Couch JCI-1000TC
  Features:
    * Same specifications as JCI-1000EC
    * Additional face hole for patient positioning
    * Specialized for therapy applications

- Examination Couch JCI-2000EC
  Price: Rp 21.750.000
  Features:
    * Same dimensions and construction as JCI-1000EC
    * Electric actuator motor for back rest (75kg+ capacity)
    * Enhanced electric height adjustment system
    * Memory function capability
    * Soft premium padding

- Therapy Couch JCI-2000TC
  Price: Rp 22.500.000
  Features:
    * Same specifications as JCI-2000EC
    * Face hole addition for therapeutic treatments
    * Premium upholstery for patient comfort

== LEGACY PRODUCTS ==

- U-life Mobile Cart for Laptop (Rp 4.900.000)
  Features: Mobile workstation, adjustable height, laptop holder, cable management
  Use case: Hospital wards, clinics, medical offices

- Portable Health Check Up Station SK-GS6 (Rp 60.000.000)
  Features: All-in-one health monitoring, portable design
  Use case: Health screenings, mobile clinics

- Health Check Up Kiosk SK-X60HD (Rp 205.000.000)
  Features: Advanced health monitoring, touch screen interface
  Use case: Hospitals, large clinics

- Cordless High Lux LED Lamp (Rp 18.000.000)
  Features: High-intensity lighting, cordless operation
  Use case: Medical procedures, examinations

== COMPANY INFORMATION ==

Company: PT. Semesta Medika Makmur
Address: Jl. Kamal Raya Outer Ring Road, Ruko Mutiara Taman Palem Blok A2 No. 28
         Cengkareng Timur - Jakarta Barat 11730
Phone: (021) 2951 7888 / 5439 6999 / 2902 0168 / 2931 2345
Email: semestamedikamakmur@gmail.com
Website: www.semestamedika.com
Business Hours: Monday - Friday: 9:00 AM - 5:00 PM
Services: Installation, maintenance, technical support, and after-sales service available

== MANUFACTURER INFORMATION ==

Yeo Medical Technology Co., Ltd. (Health monitoring equipment)
Address: Floor 6, Building A, Wanhe Science and Technology Building
         No.7 Huitong Road, Guangming District, Shenzhen, China
Factory: Room 402, Building C1, China Merchants Smart Park
         No. 459 Qiaokai Road, Guangming District, Shenzhen, China
Contact: ashley.yao@yeomedical.com, Tel: +86 151 7251 6634

== USAGE GUIDELINES ==
Please provide accurate information about our products and services. 
- Focus on technical specifications when discussing equipment capabilities
- Mention use cases and applications for each product
- Provide pricing information where available
- Include manufacturer details for technical support inquiries
- Highlight key features that differentiate products
- If unsure about specific details not covered in this knowledge base, please acknowledge the limitation

Key selling points to emphasize:
- Advanced technology integration (Android OS, wireless connectivity)
- Medical-grade accuracy and reliability
- Comprehensive connectivity options
- Portable and space-efficient designs
- International manufacturing standards
- Multiple application fields and use cases
`;

export const chatService = {
    /**
     * Process a chat message and store it in MongoDB
     * @param {string} userId - The ID of the user sending the message
     * @param {string} message - The user's message
     * @param {Object} options - Additional options for message processing
     * @returns {Promise<Object>} The AI response and chat record
     */
    async processMessage(userId, message, options = {}) {
        try {
            // Ensure MongoDB connection
            if (!mongoose.connection.readyState) {
                await connectDB();
            }

            // Fetch last 5 messages for context
            const recentChats = await Chat.find({ userId })
                .sort({ timestamp: -1 })
                .limit(5)
                .lean();

            const chatHistory = recentChats
                .reverse() // oldest first
                .map(chat => `User: ${chat.message}\nAI: ${chat.response}`)
                .join('\n');

            // Add conversation context if available (optional, legacy)
            // const conversationContext = options.conversationContext || '';
            
            const prompt = `${productContext}
Chat History:
${chatHistory}

User Question: ${message}

Only answer the user's question directly. If the user asks for a scenario, advice, or best practices, provide concise, relevant suggestions or recommendations. Do not include any unrelated or unnecessary information.`;

            // Make direct API call to Gemini 2.0 Flash
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCqmHK03_nCeBTncfeVJtbqDuCw4-sivSo`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        safetySettings: [{
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_NONE"
                        }]
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                console.error('Gemini API Error:', error);
                throw new Error(`Gemini API error: ${error.error?.message || JSON.stringify(error)}`);
            }

            const result = await response.json();
            const aiResponse = result.candidates[0]?.content?.parts[0]?.text || 'No response generated';

            // Extract product category and other metadata
            const productCategory = this._extractProductCategory(message);
            const sentiment = this._analyzeSentiment(message);
            const language = this._detectLanguage(message);

            // Store chat in MongoDB
            const chatData = {
                userId,
                message,
                response: aiResponse,
                metadata: {
                    messageType: options.messageType || 'general',
                    productCategory,
                    sentiment,
                    language,
                    ...options.metadata
                }
            };

            const chat = new Chat(chatData);
            await chat.save();

            return {
                success: true,
                chatId: chat._id,
                response: aiResponse,
                metadata: chatData.metadata
            };
        } catch (error) {
            console.error('Error processing message:', error);
            throw new Error(`Chat processing failed: ${error.message}`);
        }
    },

    /**
     * Get chat history for a user with pagination
     * @param {string} userId - The ID of the user
     * @param {Object} options - Pagination and filtering options
     * @returns {Promise<Object>} Paginated chat history
     */
    async getChatHistory(userId, options = {}) {
        try {
            // Ensure MongoDB connection
            if (!mongoose.connection.readyState) {
                await connectDB();
            }

            const {
                limit: limitCount = 20,
                skip = 0,
                startDate = null,
                endDate = null,
                productCategory = null
            } = options;

            // Build query
            const query = { userId };
            
            // Add date range if provided
            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate) query.timestamp.$gte = new Date(startDate);
                if (endDate) query.timestamp.$lte = new Date(endDate);
            }

            // Add product category filter if provided
            if (productCategory) {
                query['metadata.productCategory'] = productCategory;
            }

            // Execute query with pagination
            const chats = await Chat.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitCount);

            // Get total count for pagination
            const total = await Chat.countDocuments(query);

            return {
                success: true,
                chats,
                hasMore: skip + chats.length < total,
                total
            };
        } catch (error) {
            throw new Error(`Failed to fetch chat history: ${error.message}`);
        }
    },

    /**
     * Delete a chat message
     * @param {string} chatId - The ID of the chat to delete
     * @param {string} userId - The ID of the user (for verification)
     * @returns {Promise<Object>} Deletion result
     */
    async deleteChat(chatId, userId) {
        try {
            // Ensure MongoDB connection
            if (!mongoose.connection.readyState) {
                await connectDB();
            }

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(chatId)) {
                throw new Error('Chat not found or unauthorized');
            }

            const chat = await Chat.findOne({ _id: chatId, userId });
            
            if (!chat) {
                throw new Error('Chat not found or unauthorized');
            }

            await chat.deleteOne();
            return { success: true, message: 'Chat deleted successfully' };
        } catch (error) {
            if (error.message === 'Chat not found or unauthorized') {
                throw error;
            }
            throw new Error(`Failed to delete chat: ${error.message}`);
        }
    },

    /**
     * Update a chat message
     * @param {string} chatId - The ID of the chat to update
     * @param {string} userId - The ID of the user (for verification)
     * @param {Object} updates - The updates to apply
     * @returns {Promise<Object>} Update result
     */
    async updateChat(chatId, userId, updates) {
        try {
            // Ensure MongoDB connection
            if (!mongoose.connection.readyState) {
                await connectDB();
            }

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(chatId)) {
                throw new Error('Chat not found or unauthorized');
            }

            const chat = await Chat.findOne({ _id: chatId, userId });
            
            if (!chat) {
                throw new Error('Chat not found or unauthorized');
            }

            Object.assign(chat, updates);
            await chat.save();

            return { success: true, message: 'Chat updated successfully' };
        } catch (error) {
            if (error.message === 'Chat not found or unauthorized') {
                throw error;
            }
            throw new Error(`Failed to update chat: ${error.message}`);
        }
    },

    /**
     * Extract product category from message
     * @private
     */
    _extractProductCategory(message) {
        const categories = ['Hospital Products', 'Homecare Products', 'Ward Furnitures'];
        const lowerMessage = message.toLowerCase();
        
        for (const category of categories) {
            if (lowerMessage.includes(category.toLowerCase())) {
                return category;
            }
        }
        return null;
    },

    /**
     * Analyze message sentiment
     * @private
     */
    _analyzeSentiment(message) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'helpful'];
        const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'useless'];
        
        const lowerMessage = message.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (lowerMessage.includes(word)) score++;
        });
        
        negativeWords.forEach(word => {
            if (lowerMessage.includes(word)) score--;
        });
        
        return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    },

    /**
     * Detect message language
     * @private
     */
    _detectLanguage(message) {
        const indonesianWords = ['apa', 'bagaimana', 'dimana', 'kapan', 'mengapa', 'berapa'];
        const englishWords = ['what', 'how', 'where', 'when', 'why', 'how much'];
        
        const lowerMessage = message.toLowerCase();
        let idScore = 0;
        let enScore = 0;
        
        indonesianWords.forEach(word => {
            if (lowerMessage.includes(word)) idScore++;
        });
        
        englishWords.forEach(word => {
            if (lowerMessage.includes(word)) enScore++;
        });
        
        return idScore > enScore ? 'id' : 'en';
    },

    /**
     * Get user chat statistics
     * @param {string} userId - The ID of the user
     * @returns {Promise<Object>} User chat statistics
     */
    async getUserChatStats(userId) {
        try {
            // Ensure MongoDB connection
            if (!mongoose.connection.readyState) {
                await connectDB();
            }

            const stats = await Chat.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: null,
                        totalMessages: { $sum: 1 },
                        productCategories: {
                            $push: '$metadata.productCategory'
                        },
                        messageTypes: {
                            $push: '$metadata.messageType'
                        },
                        languages: {
                            $push: '$metadata.language'
                        },
                        sentiments: {
                            $push: '$metadata.sentiment'
                        }
                    }
                }
            ]);

            if (stats.length === 0) {
                return {
                    success: true,
                    stats: {
                        totalMessages: 0,
                        productCategories: {},
                        messageTypes: {},
                        languages: {},
                        sentiments: {
                            positive: 0,
                            neutral: 0,
                            negative: 0
                        }
                    }
                };
            }

            const result = stats[0];
            
            // Process categories
            const categories = {};
            result.productCategories.forEach(cat => {
                if (cat) categories[cat] = (categories[cat] || 0) + 1;
            });

            // Process message types
            const types = {};
            result.messageTypes.forEach(type => {
                if (type) types[type] = (types[type] || 0) + 1;
            });

            // Process languages
            const languages = {};
            result.languages.forEach(lang => {
                if (lang) languages[lang] = (languages[lang] || 0) + 1;
            });

            // Process sentiments
            const sentiments = {
                positive: 0,
                neutral: 0,
                negative: 0
            };
            result.sentiments.forEach(sent => {
                if (sent) sentiments[sent]++;
            });

            return {
                success: true,
                stats: {
                    totalMessages: result.totalMessages,
                    productCategories: categories,
                    messageTypes: types,
                    languages,
                    sentiments
                }
            };
        } catch (error) {
            throw new Error(`Failed to fetch chat statistics: ${error.message}`);
        }
    }
}; 