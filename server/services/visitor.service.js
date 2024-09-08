const Visitor = require("../model/Visitor.model");


exports.addVisitor = async (visitorData) => {
  const newVisitor = new Visitor(visitorData);
  return await newVisitor.save();
};



// exports.getAllVisitors = async () => {
//   try {
//     const visitors = await Visitor.find(); // Fetch all visitors
//     return visitors;
//   } catch (error) {
//     throw new Error('Error fetching visitors: ' + error.message);
//   }
// };
// exports.getAllVisitors = async (filters) => {
//   try {
//     const { name, startDate, endDate } = filters;

//     // Build the filter object
//     const query = {};

//     // If name is provided, use regex to match visitors whose names contain the given string
//     if (name) {
//       query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
//     }

//     // If startDate or endDate is provided, filter visitors within that date range
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) {
//         query.createdAt.$gte = new Date(startDate); // Greater than or equal to startDate
//       }
//       if (endDate) {
//         query.createdAt.$lte = new Date(endDate); // Less than or equal to endDate
//       }
//     }


//     console.log("qqqqq",query);

//     // Fetch visitors with filters
//     const visitors = await Visitor.find(query); 
//     console.log("vvv",visitors);
//     return visitors;
//   } catch (error) {
//     throw new Error('Error fetching visitors: ' + error.message);
//   }
// };

exports.getAllVisitors = async (filters) => {
  try {
    const { name, startDate, endDate, interestedCountry } = filters;

    // Build the filter object
    const query = {};

    // If name is provided, use regex to match visitors whose names contain the given string
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    // If startDate or endDate is provided, filter visitors within that date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate); // Greater than or equal to startDate
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate); // Less than or equal to endDate
      }
    }

    // If interestedCountry is provided, use regex to match visitors whose interestedCountries contain the given country
    if (interestedCountry) {
      query.interestedCountries = { $regex: interestedCountry, $options: 'i' }; // Case-insensitive search
    }

    // Fetch visitors with filters
    const visitors = await Visitor.find(query); 
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