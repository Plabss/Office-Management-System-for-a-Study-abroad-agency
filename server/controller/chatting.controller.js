// const { createConversation, getConversationsByEmployeeId, getMessagesByConversationId, sendMessage } = require("../services/chatting.service");

// exports.createConversation = async (req, res) => {
//   try {
//     const { participants } = req.body;
//     const conversation = await createConversation(participants);
//     res.status(201).json(conversation);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create conversation' });
//   }
// };

// exports.getConversations = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const conversations = await getConversationsByEmployeeId(employeeId);
//     res.status(200).json(conversations);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch conversations' });
//   }
// };

// exports.getMessages = async (req, res) => {
//   try {
//     const { conversationId } = req.params;
//     const messages = await getMessagesByConversationId(conversationId);
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// };

// exports.sendMessage = async (req, res) => {
//   try {
//     const { conversationId, senderId, content } = req.body;
//     const message = await sendMessage(conversationId, senderId, content);
//     res.status(201).json(message);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to send message' });
//   }
// };

