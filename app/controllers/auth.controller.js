const HYDRA_CLIENT_SECRECT = "tmatri@2024";
const Core = require("../models/core.model.js");
const Auth = require("../models/auth.model.js");
var prof_mngnt_model = require('../models/profileManagement.model.js');
var lang_model = require('../models/language.model.js');
const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');

exports.create_token = async (req, res) => {
	try {
		const tokenApiUrl = `${process.env.HYDRA_TOKEN_C}/oauth2/token`;

		const requestBody = new URLSearchParams();
		requestBody.append('grant_type', process.env.HYDRA_GRANT_TYPE);
		requestBody.append('client_id', process.env.HYDRA_CLIENT_ID);
		requestBody.append('client_secret', HYDRA_CLIENT_SECRECT);
		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		};

		const response = await Core.sendHttpRequest('POST', tokenApiUrl, headers, requestBody, true);
		res.status(200).json({ status: 'success', data: response });
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: 'error', data: 'Internal Server Error' });
	}
}

exports.verify_token = async (req, res) => {
	try {
		const { token } = req.body;
		if (!token)
			return res.status(401).json({ status: 'error', data: 'Token Missing' });

		const response = await Auth.verifyToken(token);
		res.status(200).json({ status: 'success', data: response });
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: 'error', data: 'Internal Server Error' });
	}
}

exports.login = async (req, res) => {
	try {
		const token = req.headers['authorization'];

		if (!token)
			return res.status(401).json({ status: 'error', data: 'Token Missing' });

		const verifyTokenResponse = await Auth.verifyToken(token);
		if (!verifyTokenResponse.active)
			return res.status(401).json({ status: 'error', data: 'Invalid Token' });

		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({ status: 'error', data: 'Required Field Missing' });

		const postParameters = {
			password_identifier: email,
			method: 'password',
			password: password
		};

		const headers = {
			'Content-Type': 'application/json'
		};

		const response = await Core.sendHttpRequest('GET', `${process.env.KRATOS_URL}/self-service/login/api`);
		const { ui: { action: flowUrl } } = JSON.parse(response);

		const flowResponse = await Core.sendHttpRequest('POST', flowUrl, headers, JSON.stringify(postParameters));
		const responseData = JSON.parse(flowResponse);

		const errorMessages = responseData.ui && responseData.ui.messages ? responseData.ui.messages.map(message => message.text) : [];
		const group = responseData.session?.identity?.traits?.group;
		if (errorMessages.length > 0) {
			res.status(500).json({ status: 'error', data: errorMessages[0] });
		} else {
			const { session_token: sessionToken } = responseData;
			const identityId = responseData.session?.identity.id;
			const profile = await prof_mngnt_model.findOne({ 'basic_info.ory_identity_id': identityId }).populate('_id').exec();
			//console.log('>>', profile);
			res.status(200).json({
				status: 'success', data: {
					sessionToken: sessionToken,
					group: group,
					profileId: profile._id,
					uname: profile.basic_info.first_name + ' ' + profile.basic_info.last_name
					/*identityId:identityId*/
				}
			});
		}
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: 'error', data: 'Internal Server Error' });
	}
};

exports.logout = async (req, res) => {
	try {
		const sessionToken = req.headers['x-session-token'];
		if (!sessionToken)
			return res.status(401).json({ status: 'error', data: 'Session Token Missing' });

		const requestBody = { session_token: sessionToken };
		const response = await axios.delete(`${process.env.KRATOS_URL}/self-service/logout/api`, { data: requestBody });

		//if(response.status===204)
		if (response.status = 204)
			res.status(200).json({ status: "success", data: "Logged Out" });
		else
			res.status(500).json({ status: "error", data: "Failed to Logout" });
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: "error", data: "Internal Server Error" });
	}
};

exports.signup = async (req, res) => {
	try {
		const token = req.headers['authorization'];

		if (!token)
			return res.status(401).json({ status: 'error', data: 'Token Missing' });

		const verifyTokenResponse = await Auth.verifyToken(token);
		if (!verifyTokenResponse.active)
			return res.status(401).json({ status: 'error', data: 'Invalid Token' });

		const { email, phone, password, first_name, last_name, group } = req.body;
		if (!email || !phone || !password || !first_name || !last_name)
			return res.status(400).json({ status: 'error', data: 'Required Field Missing' });

		const postParameter = {
			method: 'password',
			password,
			traits: {
				email,
				phone,
				group,
				name: {
					last: last_name,
					first: first_name
				}
			}
		};

		const headers = { 'Content-Type': 'application/json' };
		let response = await Core.sendHttpRequest('GET', `${process.env.KRATOS_URL}/self-service/registration/api`, headers, postParameter);
		let responseData = JSON.parse(response);
		const flowUrl = responseData.ui.action;
		response = await Core.sendHttpRequest('POST', flowUrl, headers, JSON.stringify(postParameter));//need to verify
		responseData = JSON.parse(response);
		const identityId = responseData.session?.identity.id;
		if (identityId) {
			//res.status(200).json({ status: 'success', data: {identityId: identityId, group: group}});
			const session_token = responseData.session_token;
			try {
				var profile = new prof_mngnt_model({ basic_info: { first_name: first_name, last_name: last_name, mobile: phone, email: email, date_of_birth: req.body.date_of_birth, gender: req.body.gender, mother_lang_id: req.body.mother_lang_id, ory_identity_id: identityId } });
				const savedProfile = await profile.save();

				res.status(200).json({ status: 'success', data: { profileId: savedProfile._id, group: group, sessionToken: session_token, uname: savedProfile.basic_info.first_name + ' ' + savedProfile.basic_info.last_name } });
			} catch (error) {
				//console.log('error', error);
				res.status(500).json({ status: 'error', data: 'Internal Server Error' });
			}
		} else {
			if (responseData.ui && responseData.ui.messages) {
				const errorMessage = responseData.ui.messages[0].text;
				res.status(200).json({ status: 'error', data: errorMessage });
			} else if (!responseData.session_token) {
				if (responseData.ui && Array.isArray(responseData.ui.nodes)) {
					const nodesError = responseData.ui.nodes;

					for (const node of nodesError) {
						if (node.messages && Array.isArray(node.messages)) {
							const messages = node.messages;

							if (messages.length > 0) {
								const errorList = messages[0].text;
								return res.status(200).json({ status: 'error', data: errorList });
							}
						}
					}
				}
			}
		}
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: 'error', data: 'Internal Server Error' });
	}
};

exports.get_profile_info = async (req, res) => {
	try {
		const sessionToken = req.headers['x-session-token'];
		if (!sessionToken)
			return res.status(401).json({ status: 'error', data: 'Session Token Missing' });

		const requestBody = new URLSearchParams();
		const headers = {
			'Content-Type': 'application/json',
			'X-Session-Token': sessionToken
		};
		const response = await Core.sendHttpRequest('GET', `${process.env.KRATOS_URL}/sessions/whoami`, headers, requestBody, true);
		res.status(200).json({ status: 'success', data: response });
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: 'error', data: 'Internal Server Error' });
	}
};

exports.update_profile = async (req, res) => {
	try {
		const sessionToken = req.headers['x-session-token'];
		if (!sessionToken)
			return res.status(401).json({ status: 'error', data: 'Session Token Missing' });

		const { email, phone, first_name, last_name, group } = req.body;
		if (!email || !phone || !first_name || !last_name)
			return res.status(400).json({ status: 'error', data: 'Required Field Missing' });

		const postParameter = {
			method: 'profile',
			traits: {
				email,
				phone,
				group,
				name: {
					last: last_name,
					first: first_name
				}
			}
		};

		const headers = {
			'Content-Type': 'application/json',
			'X-Session-Token': sessionToken
		};

		let response = await Core.sendHttpRequest('GET', `${process.env.KRATOS_URL}/self-service/settings/api`, headers, postParameter);
		let responseData = JSON.parse(response);
		if (responseData?.error) //I have added this
			return res.status(500).json({ status: 'error', data: responseData?.error });

		const flowUrl = responseData?.ui?.action;

		response = await Core.sendHttpRequest('POST', flowUrl, headers, JSON.stringify(postParameter));
		responseData = JSON.parse(response);
		const identityId = responseData.session?.identity.id;
		if (identityId) {
			res.status(200).json({ status: 'success', data: { identityId: identityId, group: group } });
		} else {
			if (responseData.ui && responseData.ui.messages) {
				const errorMessage = responseData.ui.messages[0].text;
				res.status(500).json({ status: 'error', data: errorMessage });
			} else if (!responseData.session_token) {
				if (responseData.ui && Array.isArray(responseData.ui.nodes)) {
					const nodesError = responseData.ui.nodes;

					for (const node of nodesError) {
						if (node.messages && Array.isArray(node.messages)) {
							const messages = node.messages;

							if (messages.length > 0) {
								const errorList = messages[0].text;
								return res.status(500).json({ status: 'error', data: errorList });
							}
						}
					}

				}
			}
		}
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: 'error', data: 'Internal Server Error' });
	}
}

exports.update_password = async (req, res) => {
	try {
		const sessionToken = req.headers['x-session-token'];
		if (!sessionToken)
			return res.status(401).json({ status: 'error', data: 'Session Token Missing' });

		const { password } = req.body;
		if (!password)
			return res.status(400).json({ status: 'error', data: 'Password Missing' });

		const postParameter = {
			method: 'password',
			password
		};

		const headers = {
			'Content-Type': 'application/json',
			'X-Session-Token': sessionToken
		};

		let response = await Core.sendHttpRequest('GET', `${process.env.KRATOS_URL}/self-service/settings/api`, headers, postParameter);
		let responseData = JSON.parse(response);
		if (responseData?.error) //I have added this
			return res.status(500).json({ status: 'error', data: responseData?.error });
		const flowUrl = responseData.ui.action;

		response = await Core.sendHttpRequest('POST', flowUrl, headers, JSON.stringify(postParameter), true);
		if (response?.error)
			return res.status(500).json({ status: 'error', data: response?.error });

		const state = response.state;
		res.status(200).json({ status: 'success', data: state });
	} catch (error) {
		//console.error(error);
		res.status(500).json({ status: 'error', data: 'Internal Server Error' });
	}
};

exports.minio_poc = async (req, res) => {
	/*const ory_identity_id = '5ef7a753-4148-4496-a4cd-45d0a72ef3b0';
	try {
	const profile = await prof_mngnt_model.findOne({ 'basic_info.ory_identity_id': ory_identity_id })
	.populate('basic_info.mother_lang_id') // Populate the 'mother_lang_id' field
	.exec();
	console.log('profile', profile);
	}catch(error){
		console.log('error', error);
	}*/
	var Minio = require('minio');
	var fs = require('fs');

	// Instantiate the minio client with the endpoint
	var minioClient = new Minio.Client({
		endPoint: '192.168.0.189',
		port: 9000,
		useSSL: false,
		accessKey: 'csk',
		secretKey: 'csk@2020',
	})

	/*// File that needs to be uploaded.
	var file = 'FB_IMG_1591513992069.jpg';

	// Make a bucket called europetrip.
	//minioClient.makeBucket('europetrip', 'us-east-1', function (err) {
	//if (err) return console.log(err)

	//console.log('Bucket created successfully in "us-east-1".')

	var metaData = {
		'Content-Type': 'image/jpg', // Adjust this according to the actual image type
		'X-Amz-Meta-Testing': 1234,
		example: 5678,
	}
	// Using fPutObject API upload your file to the bucket europetrip.
	minioClient.fPutObject('thirukulam-v2', 'FB_IMG_1591513992069.jpg', file, metaData, function (err, etag) {
		if (err) return console.log(err)
		console.log('File uploaded successfully.');
	});*/

	/*;(async function () {
		await minioClient.removeObject('thirukulam-v2', 'FB_IMG_1591513992069.jpg')
		console.log('Removed the object')
	})()*/

	/*var size = 0
	minioClient.getObject('thirukulam-v2', 'FB_IMG_1591513992069.jpg', function (err, dataStream) {
		const writeStream = fs.createWriteStream('FB_IMG_1591513992069_new.jpg');
		if (err) {
			return console.log(err)
		}
		dataStream.on('data', function (chunk) {
			console.log('>>', chunk);
			writeStream.write(chunk);
			size += chunk.length
		})
		dataStream.on('end', function () {
			console.log('End. Total size = ' + size)
			writeStream.end();
			//open('FB_IMG_1591513992069_new.jpg');
			import('open').then(open => {
				open.default('FB_IMG_1591513992069_new.jpg'); // Open the saved image file using the default application
			}).catch(err => {
				console.error('Error opening file:', err);
			});
		})
		dataStream.on('error', function (err) {
			console.log(err)
		})
	})*/

	/*var size = 0
	minioClient.getObject('thirukulam-v2', 'FB_IMG_1591513992069.jpg', function (err, dataStream) {
		if (err) {
			return console.log(err)
		}
		dataStream.on('data', function (chunk) {
			size += chunk.length
		})
		dataStream.on('end', function () {
			console.log('End. Total size = ' + size)
		})
		dataStream.on('error', function (err) {
			console.log(err)
		})
	})*/
};

// exports.obj_store = async (req, res) => {
// 	const { S3Client, PutObjectCommand, PutObjectAclCommand } = require('@aws-sdk/client-s3');
// 	const { Upload } = require('@aws-sdk/lib-storage');
// 	const AWS = require('aws-sdk');
// 	const XLSX = require('xlsx');
// 	const fs = require('fs');
// 	const path = require('path');

// 	// Configure AWS for Linode Object Storage
// 	// AWS.config.update({
// 	// 	accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
// 	// 	secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS',
// 	// 	region: 'YOUR_REGION',
// 	// 	endpoint: 'https://in-maa-1.linodeobjects.com' // Update with Linode's S3-compatible endpoint
// 	// });
// 	// const s3Client = new S3Client({
// 	// 	region: 'in-maa',
// 	// 	endpoint: 'https://in-maa-1.linodeobjects.com', // Update with Linode's S3-compatible endpoint
// 	// 	credentials: {
// 	// 		accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
// 	// 		secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS'
// 	// 	}
// 	// });
// 	const s3Client = new S3Client({
// 		region: 'YOUR_REGION',
// 		endpoint: 'https://in-maa-1.linodeobjects.com', // Update with Linode's S3-compatible endpoint
// 		credentials: {
// 		  accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
// 		  secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS'
// 		}
// 	  });
// 	const s3 = new AWS.S3();
// 	const bucketName = 'thirukulam-v2';

// 	// Function to upload a file
// 	// const uploadFile = async (bucketName, key, filePath) => {
// 	// 	try {
// 	// 		const fileContent = fs.readFileSync(filePath);
// 	// 		const params = {
// 	// 			Bucket: bucketName,
// 	// 			Key: key,
// 	// 			Body: fileContent
// 	// 		};
// 	// 		await s3.upload(params).promise();
// 	// 		console.log(`File uploaded successfully to ${bucketName}/${key}`);
// 	// 	} catch (error) {
// 	// 		console.error('Error uploading file:', error.message);
// 	// 	}
// 	// };
// 	const uploadFile = async (bucketName, key, filePath) => {
// 		try {
// 		  const fileStream = fs.createReadStream(filePath);
// 		  const uploadParams = {
// 			Bucket: bucketName,
// 			Key: key,
// 			Body: fileStream
// 		  };
// 		  const parallelUploads3 = new Upload({
// 			client: s3Client,
// 			params: uploadParams,
// 		  });
// 		  await parallelUploads3.done();

// 		  // Set the object to be publicly readable
// 		  const aclParams = {
// 			Bucket: bucketName,
// 			Key: key,
// 			ACL: 'public-read'
// 		  };
// 		  await s3Client.send(new PutObjectAclCommand(aclParams));

// 		  console.log(`File uploaded successfully to ${bucketName}/${key}`);
// 		} catch (error) {
// 		  console.error('Error uploading file:', error.message);
// 		}
// 	  };
// 	// old
// 	// const uploadFile = async (bucketName, key, filePath) => {
// 	// 	try {
// 	// 		const fileStream = fs.createReadStream(filePath);
// 	// 		const uploadParams = {
// 	// 			Bucket: bucketName,
// 	// 			Key: key,
// 	// 			Body: fileStream
// 	// 		};
// 	// 		const parallelUploads3 = new Upload({
// 	// 			client: s3Client,
// 	// 			params: uploadParams,
// 	// 		});
// 	// 		await parallelUploads3.done();

// 	// 		// Set the object to be publicly readable
// 	// 		const aclParams = {
// 	// 			Bucket: bucketName,
// 	// 			Key: key,
// 	// 			ACL: 'public-read'
// 	// 		};
// 	// 		await s3Client.send(new PutObjectAclCommand(aclParams));

// 	// 		console.log(`File uploaded successfully to ${bucketName}/${key}`);
// 	// 	} catch (error) {
// 	// 		console.error('Error uploading file:', error.message);
// 	// 	}
// 	// };

// 	// Function to process the Excel file
// 	// const processExcelFile = async (filePath, bucketName) => {
// 	// 	const workbook = XLSX.readFile(filePath);
// 	// 	const sheetName = workbook.SheetNames[0];
// 	// 	const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// 	// 	for (const row of sheet) {
// 	// 		const oryIdentityId = row['basic_info.ory_identity_id'];
// 	// 		const avatarId = row['personal_info.avatar_Id'];
// 	// 		const galleryId = row['personal_info.gallery_Id'];

// 	// 		const folderPath = `${oryIdentityId}/`;
// 	// 		const avatarKey = `${folderPath}avatar/${avatarId}`;
// 	// 		const galleryKey = `${folderPath}gallery/${galleryId}`;

// 	// 		// Assuming files are located in the same directory as the script
// 	// 		const avatarFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', avatarId);
// 	// 		const galleryFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', galleryId);

// 	// 		// Check if files exist before uploading
// 	// 		if (fs.existsSync(avatarFilePath)) {
// 	// 			await uploadFile(bucketName, avatarKey, avatarFilePath);
// 	// 		} else {
// 	// 			console.error(`File not found: ${avatarFilePath}`);
// 	// 		}

// 	// 		if (fs.existsSync(galleryFilePath)) {
// 	// 			await uploadFile(bucketName, galleryKey, galleryFilePath);
// 	// 		} else {
// 	// 			console.error(`File not found: ${galleryFilePath}`);
// 	// 		}
// 	// 	}
// 	// };
// 	// Function to process the Excel file
// 	const processExcelFile = async (filePath, bucketName) => {
// 		const workbook = XLSX.readFile(filePath);
// 		const sheetName = workbook.SheetNames[0];
// 		const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// 		for (const row of sheet) {
// 			const oryIdentityId = row['basic_info.ory_identity_id'];
// 			const avatarId = path.basename(row['personal_info.avatar_Id']);
// 			const galleryId = path.basename(row['personal_info.gallery_Id']);

// 			// Create the nested folder structure
// 			const folderPath = `${oryIdentityId}/gallery/`;
// 			const avatarKey = `${folderPath}avatar/${avatarId}`;
// 			const galleryKey = `${folderPath}${galleryId}`;

// 			// Assuming files are located in the same directory as the script
// 			const avatarFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', avatarId); // Adjust this path as needed
// 			const galleryFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', galleryId); // Adjust this path as needed

// 			// Check if files exist before uploading
// 			if (fs.existsSync(avatarFilePath)) {
// 				await uploadFile(bucketName, avatarKey, avatarFilePath);
// 			} else {
// 				console.error(`File not found: ${avatarFilePath}`);
// 			}

// 			if (fs.existsSync(galleryFilePath)) {
// 				await uploadFile(bucketName, galleryKey, galleryFilePath);
// 			} else {
// 				console.error(`File not found: ${galleryFilePath}`);
// 			}
// 		}
// 	};
// 	// Main function to execute the script
// 	const main = async () => {
// 		const excelFilePath = path.join('C:\\Users\\Admin\\Downloads', 'gallery_id_tmatri.xlsx'); // Ensure this path is correct
// 		await processExcelFile(excelFilePath, bucketName);
// 	};

// 	main().catch(error => {
// 		console.error('Error:', error.message);
// 		res.status(500).send('An error occurred');
// 	});
// }




// const { S3Client, PutObjectAclCommand } = require('@aws-sdk/client-s3');
// const { Upload } = require('@aws-sdk/lib-storage');
// const AWS = require('aws-sdk');
// const XLSX = require('xlsx');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// // Configure AWS for Linode Object Storage
// const s3Client = new S3Client({
// 	region: 'in-maa',
// 	endpoint: 'https://in-maa-1.linodeobjects.com',
// 	credentials: {
// 		accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
// 		secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS',
// 	}
// });
// const bucketName = 'thirukulam-v2';
// // Function to upload a file
// const uploadFile = async (bucketName, key, filePath) => {
// 	try {
// 		const fileStream = fs.createReadStream(filePath);
// 		const uploadParams = {
// 			Bucket: bucketName,
// 			Key: key,
// 			Body: fileStream
// 		};
// 		const parallelUploads3 = new Upload({
// 			client: s3Client,
// 			params: uploadParams,
// 		});
// 		await parallelUploads3.done();

// 		// Set the object to be publicly readable
// 		const aclParams = {
// 			Bucket: bucketName,
// 			Key: key,
// 			ACL: 'public-read'
// 		};
// 		await s3Client.send(new PutObjectAclCommand(aclParams));

// 		console.log(`File uploaded successfully to ${bucketName}/${key}`);
// 	} catch (error) {
// 		console.error('Error uploading file:', error.message);
// 	}
// };

// // Function to process the Excel file
// const processExcelFile = async (filePath, bucketName) => {
// 	const workbook = XLSX.readFile(filePath);
// 	const sheetName = workbook.SheetNames[0];
// 	const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// 	for (const row of sheet) {
// 		const oryIdentityId = row['basic_info.ory_identity_id'];
// 		const avatarId = path.basename(row['personal_info.avatar_Id']);
// 		const galleryId = path.basename(row['personal_info.gallery_Id']);

// 		// Create the nested folder structure
// 		const folderPath = `${oryIdentityId}/gallery/`;
// 		const avatarKey = `${folderPath}avatar/${avatarId}`;
// 		const galleryKey = `${folderPath}${galleryId}`;

// 		// Assuming files are located in the same directory as the script
// 		const avatarFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', avatarId); // Adjust this path as needed
// 		const galleryFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', galleryId); // Adjust this path as needed

// 		// Check if files exist before uploading
// 		if (fs.existsSync(avatarFilePath)) {
// 			await uploadFile(bucketName, avatarKey, avatarFilePath);
// 		} else {
// 			console.error(`File not found: ${avatarFilePath}`);
// 		}

// 		if (fs.existsSync(galleryFilePath)) {
// 			await uploadFile(bucketName, galleryKey, galleryFilePath);
// 		} else {
// 			console.error(`File not found: ${galleryFilePath}`);
// 		}
// 	}
// };

// // Main function to execute the script
// exports.obj_store = async (req, res) => {
// 	const excelFilePath = path.join('C:\\Users\\Admin\\Downloads', 'gallery_id_tmatri.xlsx'); // Ensure this path is correct
// 	await processExcelFile(excelFilePath, 'thirukulam-v2');
// 	res.send('Processing completed');
// };

// // Retrieve image endpoint
// const s3 = new AWS.S3({
// 	accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
// 	secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS',
// 	endpoint: 'https://in-maa-1.linodeobjects.com',
// 	s3ForcePathStyle: true,
// 	signatureVersion: 'v4'
// });

// exports.getImage = (req, res) => {
// 	const key = req.params[0];
// 	const params = {
// 		Bucket: 'thirukulam-v2',
// 		Key: key
// 	};

// 	//   s3.getObject(params, (err, data) => {
// 	//     if (err) {
// 	//       console.error('Error fetching the object:', err);
// 	//       res.status(500).send(err);
// 	//     } else {
// 	//       res.setHeader('Content-Type', data.ContentType);
// 	//       res.send(data.Body);
// 	//     }
// 	//   });

// 	s3.getObject(params, (err, data) => {
// 		if (err) {
// 			res.status(500).send(err);
// 		} else {
// 			res.writeHead(200, { 'Content-Type': data.ContentType });
// 			res.write(data.Body, 'binary');
// 			res.end(null, 'binary');
// 		}
// 	});
// };






// new

const { S3Client, PutObjectAclCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const AWS = require('aws-sdk');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// const upload = multer({ dest: 'uploads/' });

// Configure AWS for Linode Object Storage
const s3Client = new S3Client({
	region: 'in-maa',
	endpoint: 'https://in-maa-1.linodeobjects.com',
	credentials: {
		accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
		secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS',
	}
});
const bucketName = 'thirukulam-v2';
// Function to upload a file
const uploadFile = async (bucketName, key, filePath,fileBuffer, fileMimeType) => {
	try {
		const fileStream = fs.createReadStream(filePath);
		const uploadParams = {
			Bucket: bucketName,
			Key: key,
			Body: fileStream,
			ContentType: fileMimeType
		};
		const parallelUploads3 = new Upload({
			client: s3Client,
			params: uploadParams,
		});
		await parallelUploads3.done();

		// Set the object to be publicly readable
		const aclParams = {
			Bucket: bucketName,
			Key: key,
			ACL: 'public-read'
		};
		await s3Client.send(new PutObjectAclCommand(aclParams));

		console.log(`File uploaded successfully to ${bucketName}/${key}`);
	} catch (error) {
		console.error('Error uploading file:', error.message);
	}
};

// Function to process the Excel file
const processExcelFile = async (filePath, bucketName) => {
	const workbook = XLSX.readFile(filePath);
	const sheetName = workbook.SheetNames[0];
	const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

	for (const row of sheet) {
		const oryIdentityId = row['basic_info.ory_identity_id'];
		const avatarId = path.basename(row['personal_info.avatar_Id']);
		const galleryId = path.basename(row['personal_info.gallery_Id']);

		// Create the nested folder structure
		const folderPath = `${oryIdentityId}/gallery/`;
		const avatarKey = `${folderPath}avatar/${avatarId}`;
		const galleryKey = `${folderPath}${galleryId}`;

		// Assuming files are located in the same directory as the script
		const avatarFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', avatarId); // Adjust this path as needed
		const galleryFilePath = path.join('C:/Users/Admin/Downloads/ProfileImages', galleryId); // Adjust this path as needed

		// Check if files exist before uploading
		if (fs.existsSync(avatarFilePath)) {
			await uploadFile(bucketName, avatarKey, avatarFilePath);
		} else {
			console.error(`File not found: ${avatarFilePath}`);
		}

		if (fs.existsSync(galleryFilePath)) {
			await uploadFile(bucketName, galleryKey, galleryFilePath);
		} else {
			console.error(`File not found: ${galleryFilePath}`);
		}
	}
};

// Main function to execute the script
exports.obj_store = async (req, res) => {
	const excelFilePath = path.join('C:\\Users\\Admin\\Downloads', 'gallery_id_tmatri.xlsx'); // Ensure this path is correct
	await processExcelFile(excelFilePath, 'thirukulam-v2');
	res.send('Processing completed');
};

// Retrieve image endpoint
const s3 = new AWS.S3({
	accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
	secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS',
	endpoint: 'https://in-maa-1.linodeobjects.com',
	s3ForcePathStyle: true,
	signatureVersion: 'v4'
});

exports.getImage = (req, res) => {
	const key = req.params[0];
	const params = {
		Bucket: 'thirukulam-v2',
		Key: key
	};

	//   s3.getObject(params, (err, data) => {
	//     if (err) {
	//       console.error('Error fetching the object:', err);
	//       res.status(500).send(err);
	//     } else {
	//       res.setHeader('Content-Type', data.ContentType);
	//       res.send(data.Body);
	//     }
	//   });

	// s3.getObject(params, (err, data) => {
	// 	if (err) {
	// 		res.status(500).send(err);
	// 	} else {
	// 		res.writeHead(200, { 'Content-Type': data.ContentType });
	// 		res.write(data.Body, 'binary');
	// 		res.end(null, 'binary');
	// 	}
	// });
	s3.getObject(params, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			const base64Image = data.Body.toString('base64');
			res.send({ base64Image });
		}
	});
};

// exports.uploadImage = async (req, res) => {
// 	console.log('Request body upload:', req.body);
// 	console.log('Request file upload:', req.file);
// 	const { oryId } = req.body;
// 	const file = req.file;

// 	if (!oryId || !file) {
// 		return res.status(400).send('Missing required fields: oryId and image file');
// 	}

// 	const key = `${oryId}/gallery/avatar/${file.filename}`;

// 	try {
// 		await uploadFile(bucketName, key, file.path);
		

// 		res.send(`File uploaded successfully to ${bucketName}/${key}`);
// 	} catch (error) {
// 		res.status(500).send('Error uploading file: ' + error.message);
// 	}
// };
// exports.uploadImage = async (req, res) => {
// 	console.log('Request body upload:', req.body);
// 	console.log('Request file upload:', req.file);
// 	const { oryId } = req.body;
// 	const file = req.file;

// 	if (!oryId || !file) {
// 		return res.status(400).send('Missing required fields: oryId and image file');
// 	}

// 	const key = `${oryId}/gallery/avatar/${file.filename}`;

// 	try {
// 		await uploadFile(bucketName, key, file.path);
// 		await prof_mngnt_model.updateOne({ 'basic_info.ory_identity_id': oryId }, {
// 			'personal_info.avatar_Id': file.originalname
// 		  });

// 		res.send(`File uploaded successfully to ${bucketName}/${key}`);
// 	} catch (error) {
// 		res.status(500).send('Error uploading file: ' + error.message);
// 	}
// };

// const mongoUri = 'mongodb://172.235.15.172:27017/';
// const dbName = 'thirukulamdb';
// // Function to update the avatar_Id in MongoDB
// const updateAvatarIdInDb = async (oryId, avatarId) => {
// 	const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
// 	try {
// 	  await client.connect();
// 	  const db = client.db(dbName);
// 	  const collection = db.collection('profile_registration'); // Replace with your collection name
  
// 	  const result = await collection.updateOne(
// 		{ 'basic_info.ory_identity_id': oryId },
// 		{ $set: { 'personal_info.avatar_Id': avatarId } }
// 	  );
  
// 	  console.log(`MongoDB update result: ${result.matchedCount} document(s) matched, ${result.modifiedCount} document(s) modified.`);
// 	} catch (error) {
// 	  console.error('Error updating MongoDB:', error.message);
// 	} finally {
// 	  await client.close();
// 	}
//   };
  
// exports.updateImage = async (req, res) => {
// 	console.log('Request body update:', req.body);
// 	console.log('Request file update:', req.file);
// 	const { oryId } = req.body;
// 	const file = req.file;

// 	if (!oryId || !file) {
// 		return res.status(400).send('Missing required fields: oryId and image file');
// 	}

// 	const key = `${oryId}/gallery/avatar/${file.filename}`;

// 	try {
// 		// Check if the file already exists
// 		const headParams = {
// 			Bucket: bucketName,
// 			Key: key
// 		};

// 		// If the object exists, proceed to update
// 		s3.headObject(headParams, async (err, data) => {
// 			if (err && err.code !== 'NotFound') {
// 				return res.status(500).send('Error checking file existence: ' + err.message);
// 			}

// 			// Upload the new file
// 			await uploadFile(bucketName, key, file.path);
// 			await updateAvatarIdInDb(oryId, file.filename);
// 			res.send(`File updated successfully in ${bucketName}/${key}`);
// 		});
// 	} catch (error) {
// 		res.status(500).send('Error updating file: ' + error.message);
// 	}
// };


