const { dbPool } = require('../common/postgres');  // Import the connection pool


const getCardFromDB = async (cardId, topicId) => {
    try {
        const client = await dbPool.connect(); 
        const query = 'SELECT * FROM card WHERE card_id = $1 AND topic_id = $2'; 
        const values = [cardId, topicId];
        console.log('Topic ID:', topicId);
        const { rows } = await client.query(query, values);  
        console.log('Query result:', rows);
        client.release(); 
        return rows;  
    } catch (err) {
        console.error('Error fetching card data:', err);
        throw err; 
    }
};

module.exports = { getCardFromDB };

// แยก round  & 
//