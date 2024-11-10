const { emit } = require('../common/express');
const { dbPool } = require('../common/postgres');
const { makeCardDismissed } = require('../service/make_card_dismissed');
const { getCountdownedCardFromDB } = require('../service/get_countdowned_card');

let countdownIntervals = {}; 

const startCardCountdown = async (req, res) => {
    try { 
        const cardId = req.body.cardId;
        const roundId = req.body.roundId;
        console.log(cardId);
        const time = await getCountdownedCardFromDB(cardId);
        const duration = time[0].duration;
        if (!duration) {
            console.error(`No duration found for card ID: ${cardId}`);
            return;
        }

        let remainingTime = duration;

        countdownIntervals[cardId] = setInterval(async () => {
            remainingTime -= 1;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            emit({
                event: 'cd/countdown',
                payload: { 
                    m: minutes,
                    s: seconds 
                }
            });

            if (remainingTime <= 0) {
                clearInterval(countdownIntervals[cardId]);
                delete countdownIntervals[cardId];
                // await makeCardDismissed(cardId, roundId); 
                // emit({
                //     event: 'cd/dismiss',
                //     payload: null
                // });
            }
        }, 1000); // Run every 1 second
        res.status(200).send('Countdown started successfully');
    } catch (err) {
        console.error('Error starting countdown:', err);
        res.status(500).send('Error starting countdown.');
    }
};

const stopCardCountdown = (cardId) => {
    if (countdownIntervals[cardId]) {
        clearInterval(countdownIntervals[cardId]);
        delete countdownIntervals[cardId];
        console.log(`Countdown stopped for card ID: ${cardId}`);
    } else {
        console.log(`No active countdown for card ID: ${cardId}`);
    }
};


const CardDismissedHandler = async (req, res) => {
    try {
        const cardId = req.body.cardId;
        const roundId = req.body.roundId;
        
        await makeCardDismissed(cardId, roundId);
        stopCardCountdown(cardId); 
        emit({
            event: 'cd/dismiss',
            payload: null
        });

        res.status(200).send('Card dismissed successfully');
    } catch (err) {
        console.error('Error dismissing card:', err);
        res.status(500).send('Error dismissing card.');
    }
};

module.exports = { startCardCountdown, stopCardCountdown, CardDismissedHandler };
