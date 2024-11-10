const { emit } = require('../common/express');  // Emit function to send messages to WebSocket clients
const { openCardFromDB } = require('../service/get_card'); // Service to fetch card data from DB

const ShowCardHandler = async (req, res) => {
    try {
        const cardId = req.body.cardId;
        console.log('cardId', cardId);
        const cardData = await openCardFromDB(cardId);
        const card = cardData[0];
        // const payload = {
        //     event: "cd/open",
        //     payload: {
        //         topic_id: card.topic_id,
        //         card_id: card.card_id,
        //         question: {
        //             title: card.question,
        //             image_url: card.image_url || ""  
        //         },
        //         bonus: card.bonus || false 
        //     }
        // };
        const payload = {
            event: "cd/open",
            payload: {
                topic_id: card.topic_id,
                question_id: card.card_id,
                title: card.question,
                imageUrl: card.image_url || "",
                bonus: card.bonus || false
            }
        };
        console.log(payload)
        emit(payload);
        res.status(200).send('Card data sent to clients.');
    } catch (err) {
        console.error('Error fetching card data:', err);
        res.status(500).send('Error fetching card data.');
    }
};

module.exports = { ShowCardHandler };