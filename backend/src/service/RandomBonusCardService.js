const { dbPool } = require('../config/postgres'); // Import the PostgreSQL connection pool

async function getRandomBonusCard() {
    try {
        // Get the total number of cards
        const { rows } = await dbPool.query('SELECT COUNT(*) AS COUNT FROM card');
        const totalCard = rows[0].count;
        const bonusCard_count = Math.floor(totalCard * 0.25);

        // Select random cards to set as bonus
        const bonusCards = await dbPool.query('SELECT card_id FROM card ORDER BY RANDOM() LIMIT $1', [bonusCard_count]);
        const idsToUpdate = bonusCards.rows.map(card => card.card_id);

        if (idsToUpdate.length > 0) {
            // Update the selected cards
            const placeholders = idsToUpdate.map((_, index) => `$${index + 1}`).join(',');
            const query = `UPDATE card SET bonus = 1 WHERE card_id IN (${placeholders})`;
            await dbPool.query(query, idsToUpdate);
            console.log(`${idsToUpdate.length} cards updated with bonus status.`);
        } else {
            throw new Error('No cards to update.');
        }
    } catch (error) {
        console.error('Error updating bonus cards:', error);
        throw error; // Rethrow error for controller handling
    }
}

module.exports = { getRandomBonusCard };
