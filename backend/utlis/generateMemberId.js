const Member = require('../models/Member');

async function generateMemberId(homeId, prefix = 'A') {
  try {
    const lastMember = await Member.find({ homeId, memberId: { $regex: `^${prefix}` } })
                                   .sort({ createdAt: -1 })
                                   .limit(1);

    const lastId = lastMember[0]?.memberId || `${prefix}00`;
    const number = parseInt(lastId.slice(prefix.length)) + 1;
    return `${prefix}${String(number).padStart(2, '0')}`; // A01, A02, A03...
  } catch (err) {
    console.error('Error generating memberId:', err);
    return `${prefix}${String(Math.floor(Math.random() * 90 + 10))}`; // fallback like A42
  }
}

module.exports = generateMemberId;
