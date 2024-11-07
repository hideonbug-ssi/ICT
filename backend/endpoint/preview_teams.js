const e = require('express');
const { emit } = require('../common/express');
const { previewTeams } = require('../service/add_team');

const PreviewTeamsHandler = async (req, res) => {
    const team_id = req.body.team_id;

    if (team_id === undefined) {
        return res.status(400).send('team_id is required');
    }

    try {
        const teams = await previewTeams(team_id);
        res.status(200).json(teams);
        emit({ 
            event: 'lb/preview/add', 
            payload: {
                team: {
                    id: teams[0].team_id,
                    name: teams[0].team_name,
                    school: teams[0].school
                    }
            }});
    } catch (error) {
        console.error('Error retrieving teams:', error);
        res.status(500).send('Error retrieving teams');
    }
};

module.exports = { PreviewTeamsHandler };