const http = require('http');

const Core = function() {
};

Core.sendHttpRequest = async (method, url, headers, data,tokenverify) => {
	return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: headers
        };
		
		//console.log("url",url);
		//console.log("options",options);

        const req = http.request(url, options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                //console.log("responseData",responseData);
                try {
                    if(tokenverify)
                    {
                    const parsedResponse = JSON.parse(responseData);
                    resolve(parsedResponse);
                    }
                    else
                    resolve(responseData);

                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            // Convert data to a string before writing
            req.write(data.toString());
        }
        req.end();
    });
};

module.exports = Core;