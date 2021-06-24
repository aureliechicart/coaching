const User = require('../models/user');

const { EXTERNAL_API_KEY, EXTERNAL_API_BASE_URL } = process.env;

const fetch = require('node-fetch');
const FormData = require('form-data');

const adminController = {
    /**
     * Controls endpoint POST /v1/api/admin/add
     */
    addAdmin: async (req, res) => {
        // We get the email in request body
        const { email } = req.body;

        const form = new FormData();
        form.append('email', email);

        // We look it up in the external api to identify its external api user id
        try {
            let emailUser;
            await fetch(`${EXTERNAL_API_BASE_URL}/api/check_email`, {
                method: 'POST',
                body: form,
                headers: {
                    'X-AUTH-TOKEN': `${EXTERNAL_API_KEY}`
                }
            }).then(res => res.json())
                .then(json => emailUser = json);

            if (!emailUser.success) {
                res.status(404).json("User not found. Please check email spelling");
            } else {
                //    we search the user in the O'Clock API to confirm this user has the teacher role
                let apiUser;
                await fetch(`${EXTERNAL_API_BASE_URL}/api/user/${emailUser.data.id}`, {
                    method: 'GET',
                    headers: {
                        'X-AUTH-TOKEN': `${EXTERNAL_API_KEY}`
                    }
                }).then(res => res.json())
                    .then(json => apiUser = json);


                if (!apiUser.success) {
                    res.status(404).json("User not found");
                } else {
                    // if the user doesn't have the teacher role
                    if (!apiUser.data.is_teacher) {
                        res.status(401).json(`A user with the student role cannot be given an admin role`);

                    } else {
                        // the user has the teacher role: we check if they exist in our database yet
                        const theInternalUser = await User.checkByApiId(apiUser.data.id);

                        // If no user is found in our database, it means the user is connecting for the first time to our app
                        // we create a new record in our user table
                        if (!theInternalUser) {
                            // We create a new user with admin status true
                            const theNewUser = await new User({ api_user: apiUser.data.id, admin_status: true });
                            await theNewUser.save();

                            apiUser.oap_id = theNewUser.id;
                            apiUser.oap_admin_status = theNewUser.admin_status;
                            apiUser.message = `New admin add.`;

                        } else {
                            // if the user is found in our database
                            // we update its admin_status to true if not already true
                            if (!theInternalUser.admin_status) {
                                theInternalUser.admin_status = true;
                            }
                            await theInternalUser.save();
                            apiUser.oap_id = theInternalUser.id;
                            apiUser.oap_admin_status = theInternalUser.admin_status;
                            apiUser.message = `Successfully added new admin`;
                        }
                        // Now the user has been created/updated with admin status, we return the full apiUser object
                        res.status(200).json(apiUser);
                    }
                }
            }

        } catch (err) {
            res.status(500).json(err.message);
        }

    },


    /**
    * Controls endpoint GET /v1/api/admin/students
    */
   getAllWordQuery : async (req ,res) => {
        
        
    try {
        let { wordSearched } = req.params;
        const studentsAPI = [];
        const studentsOAP = [];
        let dataSearched; 
        
        // Retrieve cockpit data from the retrieved parameter
        await fetch(`${EXTERNAL_API_BASE_URL}/api/user/search?q=${wordSearched}`,{
            method: 'GET',
            headers: {
                'X-AUTH-TOKEN': `${EXTERNAL_API_KEY}`
            }
        }).then(res => res.json())
        .then(json => dataSearched = json);

        const usersApi = dataSearched.data;
        // Retrieve each research student in a table by checking if is_student = true
        for(const userAPI of usersApi){
            if(userAPI.is_student){
                studentsAPI.push(userAPI);
            }; 
        };
        
        // We are looping each student and check if this student is OAP or not
        for(const studentAPI of studentsAPI){
            
            // If this is the case, we add it to an array with its information and its OAP_id
            const student = await User.checkByApiId(studentAPI.id);
            if(student){
                studentAPI.oap_id = student.id;
                studentsOAP.push(studentAPI);
            };
        };

        if(studentsOAP.length){
            // Given at the front THAT students who are connected to the service and therefore concerned by research.
            res.status(200).json(studentsOAP);
        }
        else{
            //the word is well received but it does not exist
            res.status(202).json(`Aucun élève trouvé selon la recherche : ${wordSearched}` );
        };
        
    } catch(err){
        res.status(500).json(err.message);
    };
    
    },


};

module.exports = adminController;
