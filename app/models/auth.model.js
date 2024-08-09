const Core = require("../models/core.model.js");

const Auth = function() {
};

Auth.verifyToken = async (token) => {
	try {
        const url = `${process.env.HYDRA_TOKEN_V}/oauth2/introspect`;
        const requestBody = new URLSearchParams();
        requestBody.append('token', token);
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        const response = await Core.sendHttpRequest('POST', url, headers, requestBody,true);
        return response;
    } catch (error) {
        console.error(error);
        return { active: false };
    }
};

module.exports = Auth;