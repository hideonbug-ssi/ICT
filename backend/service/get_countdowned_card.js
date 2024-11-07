const { dbPool } = require('../common/postgres');  // Import the connection pool

const getCountdownedCardFromDB = async (cardId) => {
    try {
        const client = await dbPool.connect(); 
        const query = 'SELECT duration FROM card WHERE card_id = $1'; 
        const values = [cardId];
        const { rows } = await client.query(query, values);  
        console.log('Query result:', rows);
        client.release(); 
        return rows;  
    } catch (err) {
        console.error('Error fetching card data:', err);
        throw err; 
    }
};
module.exports = { getCountdownedCardFromDB };