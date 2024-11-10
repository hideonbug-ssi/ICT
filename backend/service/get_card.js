const { dbPool } = require('../common/postgres');  // Import the connection pool


const getCardFromDB = async () => {
    try {
        const client = await dbPool.connect();

        const query = `
            SELECT t.topic AS title, c.card_id AS id, c.score, c.round_number AS opened
            FROM card c
            JOIN topic t ON c.topic_id = t.topic_id
            ORDER BY t.topic_id, c.card_id;
        `;

        const { rows } = await client.query(query);
        client.release();

        // Group cards by topic
        const result = rows.reduce((acc, row) => {
            // Find the topic in the result array
            let topic = acc.find(t => t.title === row.title);

            // If the topic doesn't exist, add it
            if (!topic) {
                topic = { title: row.title, cards: [] };
                acc.push(topic);
            }

            // Add the card to the topic's cards array
            topic.cards.push({
                id: row.id,
                score: row.score,
                opened: row.opened != null 
            });

            return acc;
        }, []);

        console.log('Formatted Result:', result);
        return result;

    } catch (err) {
        console.error('Error fetching card data:', err);
        throw err;
    }
};

const openCardFromDB = async (cardId) => {
    try {
        const client = await dbPool.connect(); 
        const query = 'SELECT * FROM card WHERE card_id = $1'; 
        // console.log('Topic ID:', topicId);
        const rows  = await client.query(query, [cardId]);  
        console.log('Query result:', rows.rows);
        client.release(); 
        return rows.rows;  
    } catch (err) {
        console.error('Error fetching card data:', err);
        throw err; 
    }
};

module.exports = { getCardFromDB , openCardFromDB};
