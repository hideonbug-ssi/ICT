const {dbPool} = require('../common/postgres');

const makeCardDismissed = async (cardId, roundId) => {
    try {
        const client = await dbPool.connect();
        const query = 'UPDATE card SET round_number = $1 WHERE card_id = $2';
        const values = [roundId, cardId];
        await client.query(query, values);
        client.release();
        return { message: 'Card dismissed successfully' };
    } catch (err) {
        console.error('Error dismissing card:', err);
        throw err;
    }
};

module.exports = {makeCardDismissed};