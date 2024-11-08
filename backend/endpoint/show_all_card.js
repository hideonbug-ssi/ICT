const { emit } = require('../common/express');  // Emit function to send messages to WebSocket clients
const { getCardFromDB } = require('../service/get_card'); // Service to fetch card data from DB

const ShowAllCardHandler = async (req, res) => {
    try {

        const cardData = await getCardFromDB();

        const payload = {
            event: "cd/state",
            payload:{
                mode:"topic",
                topics: cardData
            }
        }

        emit(payload);
        res.status(200).send('Card data sent to clients.');
    } catch (err) {
        console.error('Error fetching card data:', err);
        res.status(500).send('Error fetching card data.');
    }
};

module.exports = { ShowAllCardHandler };