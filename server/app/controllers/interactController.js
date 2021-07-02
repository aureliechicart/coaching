const Interact = require('../models/interact');
const Mission = require('../models/mission');
const Theme = require('../models/theme');
const User = require('../models/user')

const interactController = {

    /**
    * Controls endpoint GET /api/missions/users/:userId
    */
    getAllByUserId: async (req, res) => {
        try {
            // We get the id in the parameters of the request
            const { userId } = req.params;

            // we check the user id
            await User.findOne(userId);

            const theInteracts = await Interact.findAll(userId);
            res.status(200).json(theInteracts);

        } catch (err) {
            // There are no checkbox values stored in the database for this user id
            // In the model, there is an error with a custom message
            res.status(404).json(err.message);
        }
    },


    /**
    * Controls endpoint GET /api/missions/:missionId/users/:userId
    */
    getOneByMissionAndUser: async (req, res) => {

        try {
            // We get the id in the parameters of the request
            const { missionId, userId } = req.params;

            // we check the mission id and the user id
            await Mission.findOne(req.params.missionId);
            await User.findOne(req.params.userId);

            //we show information
            const theInteract = await Interact.findOne(missionId, userId);
            res.status(200).json(theInteract);


        } catch (err) {
            // There is no checkbox value stored in the database for this user id and this mission id
            // In the model, there is an error with a custom message
            res.status(404).json(err.message);
        };
    },


    /**
  * Controls endpoint GET /api/themes/:themeId/users/:userId
  */
    getAllByUserAndTheme: async (req, res) => {
        try {
            // We get the ids in the parameters of the request
            const { userId, themeId } = req.params;

            //find all interactions of the userId
            const userInteracts = await Interact.findAll(userId);
            //get all missions of one theme
            const missions = await Mission.findByTheme(themeId);

            // we filter the missions to keep only the missions that are relevant to the theme
            const userInteractsByTheme = userInteracts.filter(userInteract => {
                for (const mission of missions) {
                    if (userInteract.mission_id === mission.id) {
                        return userInteract;
                    };
                }
            });

            // we return the resulting array
            res.status(200).json(userInteractsByTheme);
        } catch (err) {
            // There are no checkbox values stored in the database for this user id and theme id
            // In the model, there is an error with a custom message
            res.status(404).json(err.message);
        };
    },


    /**
    * Controls endpoint GET /api/students/:userId/themes/:themeId/score
    */
    getScorebyThemeAndUser: async (req, res) => {

        try {
            // we get the theme id and user id from the request body
            const { themeId, userId } = req.params;

            // we check the theme id and user id 
            await Theme.findOne(themeId);
            await User.findOne(userId);

            // we obtain the number of completed missions for this theme and this user
            const scoreByTheme = await Theme.findTheScoreOfOneThemeOfOneUser(themeId, userId);

            // we get all the missions in database related to this theme
            const allMissionsByTheme = await Mission.findByTheme(themeId);

            // we calculate the percentage of completed missions for this theme
            const scoreRatio = Math.round((parseInt(scoreByTheme.score, 10) / allMissionsByTheme.length) * 100);

            res.status(200).json({ bytheme_ratio: `${scoreRatio}` });

        } catch (err) {
            // There is no such user or theme stored in the database
            // In the model, there is an error with a custom message
            res.status(404).json(err.message);
        };

    },


    /**
    * Controls endpoint GET /api/students/:userId/score
    */
    getGlobalScoreByUser: async (req, res) => {
        try {
            // We get the id in the parameters of the request
            const { userId } = req.params;

            // we check if such id exists in the database
            await User.findOne(userId);


            // we get the total number of completed missions for this user 
            const globalScore = await Interact.findGlobalScoreOfOneUser(userId);

            // we get all the missions existing in database
            const allMissions = await Mission.findAll();

            // we calculate the percentage of completed missions for this user
            const globalScoreRatio = Math.round((parseInt(globalScore.global_score, 10) / allMissions.length) * 100);
            res.status(200).json({ global_ratio: `${globalScoreRatio}` });

        } catch (err) {
            // There is no such user 
            // In the model, there is an error with a custom message
            res.status(404).json(err.message);
        };
    },


    /**
    * Controls endpoint POST /api/student/interact
    */
    checkBox: async (req, res) => {

        try {
            // We get the body parameters of the request
            const { mission_id, user_id } = req.body;

            // We check if the mission id and the user id exist
            // If not, it will generate an error that will be intercepted in the catch
            await Mission.findOne(mission_id);
            await User.findOne(user_id);

            // if there are no errors, we can save this new record in the database
            const newInteract = new Interact({ mission_id, user_id });
            await newInteract.save();
            res.status(201).json(newInteract);

        } catch (err) {
            res.status(404).json(err.message);
        }
    },

    /**
    * Controls endpoint DELETE /api/student/interact/missions/:missionId/users/:userId
    */
    uncheckBox: async (req, res) => {
        try {
            // We get the ids in the parameters of the request
            const { missionId, userId } = req.params;

            // We check that the record exists before updating it
            const interact = await Interact.findOne(missionId, userId);

            // if it exists, we delete it and send a confirmation message to the client
            await interact.delete();
            res.status(200).json(`L'enregistrement a bien été supprimé`);

        } catch (err) {
            res.status(500).json(err.message);
        }
    }
}

module.exports = interactController;
