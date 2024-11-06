const RandomBonusCardService = require('../service/RandomBonusCardService');

async function updateBonusCards(req, res) {
  try {
    await RandomBonusCardService.getRandomBonusCard();
    res.json({ message: 'Bonus cards updated successfully.' });  // Send success response
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });  // Send error response
  }
}

module.exports = { updateBonusCards };
