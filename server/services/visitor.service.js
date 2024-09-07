const Visitor = require("../model/Visitor.model");


exports.addVisitor = async (visitorData) => {
  const newVisitor = new Visitor(visitorData);
  return await newVisitor.save();
};



exports.getAllVisitors = async () => {
  try {
    const visitors = await Visitor.find(); // Fetch all visitors
    return visitors;
  } catch (error) {
    throw new Error('Error fetching visitors: ' + error.message);
  }
};
exports.getAVisitorById = async (visitorId) => {
  try {
    const visitor = await Visitor.find({"_id":visitorId}); // Fetch a visitor
    return visitor;
  } catch (error) {
    throw new Error('Error fetching visitor: ' + error.message);
  }
};