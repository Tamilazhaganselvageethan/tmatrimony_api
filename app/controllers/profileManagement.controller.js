const Core = require("../models/core.model.js");
const axios = require('axios');
//var religion_model = require('../models/religion.model.js');
var prof_mngnt_model = require('../models/profileManagement.model.js');

// exports.index = async (req, res) => {
// 	const { action, type, profileId, data } = req.body;
// 	try {
// 		const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
//             { '_id': profileId },
//             data,
//             { new: true } // Return the updated document
//         ).exec();

//         if (updatedProfile) {
//             res.status(200).json({ status: "success", data:updatedProfile });
//         } else {
//             //res.status(500).json({ status: "error", data: "Internal Server Error"});
//             res.status(200).json({ status: "error", data: "Internal Server Error"});
//         }
// 	}catch(error){
// 		console.log('error>', error)
// 		res.status(500).json({ status: "error", data: error});
// 	}
// }

const multer = require('multer');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3 = new AWS.S3({
    accessKeyId: 'OHRYB5P3K68S12ZAA2Q4',
    secretAccessKey: 'tOIfa1ocJrR1771pUG1n3xATqhHIloDxH5STd8sS',
    endpoint: 'https://in-maa-1.linodeobjects.com',
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

// const uploadFileToS3 = (file,oryId) => {
//     const params = {
//         Bucket: 'thirukulam-v2',
//         Key: `${oryId}/gallery/avatar/${file.originalname}`,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ACL: 'public-read'
//     };

//     return s3.upload(params).promise();
// };
const uploadFileToS3 = (file, oryIdentityId) => {
    const params = {
        Bucket: 'thirukulam-v2',
        Key: `${oryIdentityId}/gallery/avatar/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    return s3.upload(params).promise();
};

// exports.index = async (req, res) => {
//     let { action, type, profileId, data } = req.body;

//     // Parse data if it is a string
//     if (typeof data === 'string') {
//         data = JSON.parse(data);
//     }

//     try {
//         // Find the profile by ID to get the ory_identity_id
//         const profile = await prof_mngnt_model.findById(profileId).exec();

//         if (!profile) {
//             return res.status(404).json({ status: "error", data: "Profile not found" });
//         }

//         const oryIdentityId = profile.basic_info && profile.basic_info.ory_identity_id;

//         if (!oryIdentityId) {
//             return res.status(400).json({ status: "error", data: "ory_identity_id is missing" });
//         }

//         // Handle file upload if a file is provided
//         if (req.file) {
//             try {
//                 const s3Response = await uploadFileToS3(req.file, oryIdentityId);
//                 if (!data.personal_info) {
//                     data.personal_info = {}; // Ensure personal_info is defined
//                 }
//                 data.personal_info.avatar_Id = req.file.originalname; // Store only the file name in avatar_Id
//             } catch (error) {
//                 console.error('File upload error>', error);
//                 return res.status(500).json({ status: "error", data: "File upload failed" });
//             }
//         }

//         const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
//             { '_id': profileId },
//             data,
//             { new: true }
//         ).exec();

//         if (updatedProfile) {
//             res.status(200).json({ status: "success", data: updatedProfile });
//         } else {
//             res.status(500).json({ status: "error", data: "Internal Server Error" });
//         }
//     } catch (error) {
//         console.error('Database update error>', error);
//         res.status(500).json({ status: "error", data: error });
//     }
// };

// exports.updateAvatar = async (req, res) => {
//     let profileId = req.params.profileId;

//     try {
//         const profile = await prof_mngnt_model.findById(profileId).exec();

//         if (!profile) {
//             return res.status(404).json({ status: "error", data: "Profile not found" });
//         }

//         const oryIdentityId = profile.basic_info && profile.basic_info.ory_identity_id;

//         if (!oryIdentityId) {
//             return res.status(400).json({ status: "error", data: "ory_identity_id is missing" });
//         }

//         // Handle file upload if a file is provided
//         if (req.file) {
//             try {
//                 const s3Response = await uploadFileToS3(req.file, oryIdentityId);
//                 const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
//                     { '_id': profileId },
//                     { 'personal_info.avatar_Id': req.file.originalname },
//                     { new: true }
//                 ).exec();

//                 if (updatedProfile) {
//                     res.status(200).json({ status: "success", data: updatedProfile });
//                 } else {
//                     res.status(500).json({ status: "error", data: "Internal Server Error" });
//                 }
//             } catch (error) {
//                 console.error('File upload error>', error);
//                 return res.status(500).json({ status: "error", data: "File upload failed" });
//             }
//         } else {
//             res.status(400).json({ status: "error", data: "No file provided" });
//         }
//     } catch (error) {
//         console.error('Database update error>', error);
//         res.status(500).json({ status: "error", data: error });
//     }
// };




exports.index = async (req, res) => {
    let { action, type, profileId, data } = req.body;

    // Parse data if it is a string
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    try {
        // Find the profile by ID to get the ory_identity_id
        const profile = await prof_mngnt_model.findById(profileId).exec();

        if (!profile) {
            return res.status(404).json({ status: "error", data: "Profile not found" });
        }

        const oryIdentityId = profile.basic_info && profile.basic_info.ory_identity_id;

        if (!oryIdentityId) {
            return res.status(400).json({ status: "error", data: "ory_identity_id is missing" });
        }

        // Handle file upload if a file is provided
        if (req.file) {
            try {
                const s3Response = await uploadFileToS3(req.file, oryIdentityId);
                if (!data.personal_info) {
                    data.personal_info = {}; // Ensure personal_info is defined
                }
                data.personal_info.avatar_Id = req.file.originalname; // Store only the file name in avatar_Id
            } catch (error) {
                console.error('File upload error>', error);
                return res.status(500).json({ status: "error", data: "File upload failed" });
            }
        }

        // Handle Base64 image data if provided
        if (data.base64Image) {
            try {
                const base64Data = Buffer.from(data.base64Image, 'base64');
                const fileName = `avatar_${Date.now()}.jpeg`; // You can customize the file name as needed
                const s3Response = await s3.upload({
                    Bucket: 'thirukulam-v2',
                    Key: `${oryIdentityId}/gallery/avatar/${fileName}`,
                    Body: base64Data,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg', // Ensure the content type matches the actual image type
                    ACL: 'public-read'
                }).promise();

                if (!data.personal_info) {
                    data.personal_info = {}; // Ensure personal_info is defined
                }
                data.personal_info.avatar_Id = fileName; // Store the file name in avatar_Id
            } catch (error) {
                console.error('Base64 image upload error>', error);
                return res.status(500).json({ status: "error", data: "Base64 image upload failed" });
            }
        }

        const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
            { '_id': profileId },
            data,
            { new: true }
        ).exec();

        if (updatedProfile) {
            res.status(200).json({ status: "success", data: updatedProfile });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
    } catch (error) {
        console.error('Database update error>', error);
        res.status(500).json({ status: "error", data: error });
    }
};

exports.updateAvatar = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const profile = await prof_mngnt_model.findById(profileId).exec();

        if (!profile) {
            return res.status(404).json({ status: "error", data: "Profile not found" });
        }

        const oryIdentityId = profile.basic_info && profile.basic_info.ory_identity_id;

        if (!oryIdentityId) {
            return res.status(400).json({ status: "error", data: "ory_identity_id is missing" });
        }

        // Handle file upload if a file is provided
        if (req.file) {
            try {
                // Convert file buffer to a readable stream for S3
                const fileBuffer = req.file.buffer;
                const fileName = req.file.originalname;

                const s3Response = await s3.upload({
                    Bucket: 'thirukulam-v2',
                    Key: `${oryIdentityId}/gallery/avatar/${fileName}`,
                    Body: fileBuffer,
                    ContentType: req.file.mimetype,
                    ACL: 'public-read'
                }).promise();

                const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
                    { '_id': profileId },
                    { 'personal_info.avatar_Id': fileName },
                    { new: true }
                ).exec();

                if (updatedProfile) {
                    res.status(200).json({ status: "success", data: updatedProfile });
                } else {
                    res.status(500).json({ status: "error", data: "Internal Server Error" });
                }
            } catch (error) {
                console.error('File upload error>', error);
                return res.status(500).json({ status: "error", data: "File upload failed" });
            }
        } else if (req.body.base64Image) {
            // Handle Base64 image
            try {
                const base64Data = Buffer.from(req.body.base64Image, 'base64');
                const fileName = `avatar_${Date.now()}.jpeg`; // Customize the file name as needed

                const s3Response = await s3.upload({
                    Bucket: 'thirukulam-v2',
                    Key: `${oryIdentityId}/gallery/avatar/${fileName}`,
                    Body: base64Data,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg', // Ensure the content type matches the actual image type
                    ACL: 'public-read'
                }).promise();

                const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
                    { '_id': profileId },
                    { 'personal_info.avatar_Id': fileName },
                    { new: true }
                ).exec();

                if (updatedProfile) {
                    res.status(200).json({ status: "success", data: updatedProfile });
                } else {
                    res.status(500).json({ status: "error", data: "Internal Server Error" });
                }
            } catch (error) {
                console.error('Base64 image upload error>', error);
                return res.status(500).json({ status: "error", data: "Base64 image upload failed" });
            }
        } else {
            res.status(400).json({ status: "error", data: "No file or Base64 image provided" });
        }
    } catch (error) {
        console.error('Database update error>', error);
        res.status(500).json({ status: "error", data: error });
    }
};


// new
// exports.index = async (req, res) => {
//     let { action, type, profileId, data, } = req.body;

//     // Parse data if it is a string
//     if (typeof data === 'string') {
//         data = JSON.parse(data);
//     }

//     // Handle file upload if a file is provided
//     if (req.file) {
//         try {
//             const s3Response = await uploadFileToS3(req.file, profileId);
//             if (!data.personal_info) {
//                 data.personal_info = {}; // Ensure personal_info is defined
//             }
//             // data.personal_info.avatar_Id = s3Response.Location; // Store the S3 file URL in avatar_Id
//             data.personal_info.avatar_Id = s3Response.Key; // Store the S3 file URL in avatar_Id
//         } catch (error) {
//             console.error('File upload error>', error);
//             return res.status(500).json({ status: "error", data: "File upload failed" });
//         }
//     }

//     try {
//         const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
//             { '_id': profileId },
//             data,
//             { new: true }
//         ).exec();

//         if (updatedProfile) {
//             res.status(200).json({ status: "success", data: updatedProfile });
//         } else {
//             res.status(500).json({ status: "error", data: "Internal Server Error" });
//         }
//     } catch (error) {
//         console.error('Database update error>', error);
//         res.status(500).json({ status: "error", data: error });
//     }
// };

// exports.index = async (req, res) => {
//     let { action, type, profileId, data } = req.body;

//     // Parse data if it is a string
//     if (typeof data === 'string') {
//         try {
//             data = JSON.parse(data);
//         } catch (error) {
//             console.log('JSON parse error>', error);
//             return res.status(400).json({ status: "error", data: "Invalid JSON format in data field" });
//         }
//     }

//     const oryId = data?.basic_info?.ory_identity_id;

//     if (req.file && oryId) {
//         try {
//             const s3Response = await uploadFileToS3(req.file, oryId);
//             console.log(s3Response, 'resp');

//             if (!data.personal_info) {
//                 data.personal_info = {}; // Ensure personal_info is defined
//                 console.log(data.personal_info, 'per');
//             }

//             data.personal_info.avatar_Id = s3Response.Location; // Store the S3 file URL in avatar_Id
//             console.log(data.personal_info.avatar_Id, '~~~~~');
//         } catch (error) {
//             console.log('File upload error>', error);
//             return res.status(500).json({ status: "error", data: "File upload failed" });
//         }
//     }

//     try {
//         const updatedProfile = await prof_mngnt_model.findOneAndUpdate(
//             { '_id': profileId },
//             data,
//             { new: true }
//         ).exec();

//         if (updatedProfile) {
//             res.status(200).json({ status: "success", data: updatedProfile });
//         } else {
//             res.status(200).json({ status: "error", data: "Internal Server Error" });
//         }
//     } catch (error) {
//         console.log('error>', error);
//         res.status(500).json({ status: "error", data: error });
//     }
// };

exports.info = async (req, res) => {
    let profileId = req.params.profileId;
    try {
        const profileInfo = await prof_mngnt_model.findOne({ '_id': profileId })
            .populate('basic_info.mother_lang_id')
            .populate('religion_info.religion_id')
            .populate('religion_info.caste_id')
            .populate('religion_info.sub_caste_id')
            .populate('religion_info.gothrm_id')
            .populate('religion_info.natchr_id')
            .populate('religion_info.rasi_id')
            .populate('personal_info.citizenship_id')
            .populate('personal_info.language_id')
            .populate('professional_info.educationtype_id')
            .populate('professional_info.education_id')
            .populate('professional_info.eduinstitution_id')
            .populate('professional_info.eduuniversity_id')
            // .populate('professional_info.higher_education_id')
            .populate('professional_info.employmentype_id')
            .populate('professional_info.occupation_id')
            .populate('professional_info.income_id')
            .populate('professional_info.work_city_id')
            .populate('professional_info.work_taluk_id')
            .populate('professional_info.work_dist_id')
            .populate('professional_info.work_state_id')
            .populate('professional_info.work_country_id')
            .populate('horoscope_info.city_id')
            .populate('horoscope_info.taluk_id')
            .populate('horoscope_info.dist_id')
            .populate('horoscope_info.state_id')
            .populate('horoscope_info.country_id')
            .populate('horoscope_info.natchr_id')
            .populate('horoscope_info.rasi_id')            
            .populate('residing_location.city_id')
            .populate('residing_location.taluk_id')
            .populate('residing_location.dist_id')
            .populate('residing_location.state_id')
            .populate('residing_location.country_id')
            .exec();
            
        if (profileInfo) {
            res.status(200).json({ status: "success", data: profileInfo });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
    } catch(error) {
        console.log('error>', error)
        res.status(500).json({ status: "error", data: error });
    }    
}


exports.matchInfo = async (req, res) => {
    let profileId = req.params.matchProfileId;
    try {
        const profileInfo = await prof_mngnt_model.findOne({ '_id': profileId }).exec();
        if (profileInfo) {
            res.status(200).json({ status: "success", data:profileInfo });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
    }catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}    
}
