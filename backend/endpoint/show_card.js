
const { emit } = require('../common/express');  // Emit function to send messages to WebSocket clients
const { getCardFromDB } = require('../service/get_card'); // Service to fetch card data from DB

const ShowCardHandler = async (req, res) => {
    try {
        const cardId = req.body.cardId;
        const topicId = req.body.topicId;
        console.log('cardId', cardId)
        console.log('topicId', topicId) 
        const cardData = await getCardFromDB(cardId, topicId); // Fetch card data from the database
        emit({ type: 'show_card', card: cardData }); // Emit card data to WebSocket clients
        res.status(200).send('Card data sent to clients.');
    } catch (err) {
        console.error('Error fetching card data:', err);
        res.status(500).send('Error fetching card data.');
    }
};

module.exports = { ShowCardHandler };
