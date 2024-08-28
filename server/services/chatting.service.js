// const Conversation = require("../model/Conversation");
// const Message = require("../model/Message");


// exports.createConversation = async (participants) => {
//   const conversation = new Conversation({ participants });
//   return await conversation.save();
// };

// exports.getConversationsByEmployeeId = async (employeeId) => {
//   return await Conversation.find({ participants: employeeId }).populate('participants');
// };

// exports.getMessagesByConversationId = async (conversationId) => {
//   return await Message.find({ conversation: conversationId }).populate('sender');
// };

// exports.sendMessage = async (conversationId, senderId, content) => {
//   const message = new Message({
//     conversation: conversationId,
//     sender: senderId,
//     content,
//   });
//   return await message.save();
// };

