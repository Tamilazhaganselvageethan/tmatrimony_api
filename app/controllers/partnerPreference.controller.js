const Core = require("../models/core.model.js");
const axios = require('axios');
//var religion_model = require('../models/religion.model.js');
var partnr_pref_model = require('../models/partnerPreference.model.js');
var prof_mngnt_model = require('../models/profileManagement.model.js');

exports.index = async (req, res) => {
    const { action, type, profileId, data } = req.body;
    try {
        const addUpdatedPartnrPref = await partnr_pref_model.findOneAndUpdate(
            { 'profile_id': profileId },
            data,
            { new: true, upsert: true } // Return the updated document
        ).exec();

        if (addUpdatedPartnrPref) {
            res.status(200).json({ status: "success", data: addUpdatedPartnrPref });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
    } catch (error) {
        console.log('error>', error)
        res.status(500).json({ status: "error", data: error });
    }
}

exports.info = async (req, res) => {
    let profileId = req.params.profileId;
    try {
        const profileInfo = await partnr_pref_model.findOne({ 'profile_id': profileId })
            .populate('horoscope_preference.rasi_id')
            .populate('horoscope_preference.natchr_id')
            .populate('horoscope_preference.gothrm_id')
            .populate('location_preference.city_id')
            .populate('location_preference.taluk_id')
            .populate('location_preference.dist_id')
            .populate('location_preference.state_id')
            .populate('location_preference.country_id')
            .populate('education_preference.educationtype_id')
            .populate('education_preference.education_id')
            // .populate('education_preference.eduinstitution_id')
            // .populate('education_preference.eduuniversity_id')
            .populate('profession_preference.occupation_id')
            .populate('profession_preference.employmentype_id')
            .populate('profession_preference.income_id')
            .populate('profession_preference.work_dist_id')
            .populate('profession_preference.work_state_id')
            .populate('profession_preference.work_country_id')
            .populate('religious_preference.religion_id')
            .populate('religious_preference.caste_id')
            .populate('religious_preference.sub_caste_id')
            .populate('personal_preference.language_id')
            .populate('personal_preference.citizenship_id')
            .exec();

        if (profileInfo) {
            res.status(200).json({ status: "success", data: profileInfo });
        } else {
            res.status(200).json({ status: "error", data: "Preference Settings Missing" });
        }
    } catch (error) {
        console.log('error>', error)
        res.status(500).json({ status: "error", data: error });
    }
}

/*exports.filter = async (req, res) => {
    let profileId = req.params.profileId;
    try {
        const profileInfo = await partnr_pref_model.findOne({ 'profile_id': profileId }).exec();            
        if (profileInfo) {
            //res.status(200).json({ status: "success", data: profileInfo });
            const filter = {};
            const {
                horoscope_preference, location_preference,
                education_preference, profession_preference,
                lifestyle_and_food_preference, religious_preference,
                personal_preference
            } = profileInfo;
            
            if (horoscope_preference) {
                const { rasi_id, natchr_id, gothrm_id, dosham } = horoscope_preference;
                if (rasi_id)
                    filter["religion_info.rasi_id"] = rasi_id;
                if (natchr_id)
                    filter["religion_info.natchr_id"] = natchr_id;
                if (gothrm_id)
                    filter["religion_info.gothrm_id"] = gothrm_id;
                if (dosham)
                    filter["religion_info.dosham"] = dosham;
            }
        
            if (location_preference) {
                const { city_id, dist_id, state_id, country_id, location_proximity } = location_preference;
                if (city_id)
                    filter["residing_location.city_id"] = city_id;
                if (dist_id)
                    filter["residing_location.dist_id"] = dist_id;
                if (state_id)
                    filter["residing_location.state_id"] = state_id;
                if (country_id)
                    filter["residing_location.country_id"] = country_id;
                //if (location_proximity)
                    //filter["location_preference.location_proximity"] = location_proximity;
            }
        
            if (education_preference) {
                const { education_id, higher_education_id } = education_preference;
                if (education_id && education_id.length > 0)
                    filter["professional_info.education_id"] = { $in: education_id };
                if (higher_education_id)
                    filter["professional_info.higher_education_id"] = { $in: higher_education_id };
            }
        
            if (profession_preference) {
                const { occupation_id, employmentype_id } = profession_preference;
                if (occupation_id)
                    filter["professional_info.occupation_id"] = { $in: occupation_id };
                if (employmentype_id)
                    filter["professional_info.employmentype_id"] = { $in: employmentype_id };
            }
        
            if (lifestyle_and_food_preference) {
                const { smoking, drinking, food } = lifestyle_and_food_preference;
                if (smoking)
                    filter["personal_info.smoking"] = smoking;
                if (drinking)
                    filter["personal_info.drinking"] = drinking;
                if (food)
                    filter["personal_info.food"] = food;
            }
        
            if (religious_preference) {
                const { religion_id, caste_id, sub_caste_id } = religious_preference;
                if (religion_id)
                    filter["religion_info.religion_id"] = religion_id;
                if (caste_id)
                    filter["religion_info.caste_id"] = caste_id;
                if (sub_caste_id)
                    filter["religion_info.sub_caste_id"] = sub_caste_id;
            }
        
            if (personal_preference) {
                const {
                    age_from, age_to, height_from, height_to,
                    weight_from, weight_to, salary_from, salary_to,
                    language_id, citizenship_id, physical_status,
                    family_type, marital_status
                } = personal_preference;
                if (age_from !== undefined && age_to !== undefined) {
                    filter["personal_info.age"] = { $gte: age_from, $lte: age_to };
                } else if (age_from !== undefined) {
                    filter["personal_info.age"] = { $gte: age_from };
                } else if (age_to !== undefined) {
                    filter["personal_info.age"] = { $lte: age_to };
                }
        
                if (height_from !== undefined && height_to !== undefined) {
                    filter["personal_info.height"] = { $gte: height_from, $lte: height_to };
                } else if (height_from !== undefined) {
                    filter["personal_info.height"] = { $gte: height_from };
                } else if (height_to !== undefined) {
                    filter["personal_info.height"] = { $lte: height_to };
                }
        
                if (weight_from !== undefined && weight_to !== undefined) {
                    filter["personal_info.weight"] = { $gte: weight_from, $lte: weight_to };
                } else if (weight_from !== undefined) {
                    filter["personal_info.weight"] = { $gte: weight_from };
                } else if (weight_to !== undefined) {
                    filter["personal_info.weight"] = { $lte: weight_to };
                }
        
                // if (salary_from !== undefined && salary_to !== undefined) {
                //     filter["personal_preference.salary_from"] = { $gte: salary_from, $lte: salary_to };
                // } else if (salary_from !== undefined) {
                //     filter["personal_preference.salary_from"] = { $gte: salary_from };
                // } else if (salary_to !== undefined) {
                //     filter["personal_preference.salary_from"] = { $lte: salary_to };
                // }
        
                if (language_id)
                    filter["personal_info.language_id"] = language_id;
                if (citizenship_id)
                    filter["personal_info.citizenship_id"] = citizenship_id;
                if (physical_status)
                    filter["personal_info.physical_status"] = physical_status;
                if (family_type)
                    filter["family_info.family_type"] = family_type;
                if (marital_status)
                    filter["personal_info.marital_status"] = marital_status;
            }

            try {
                const filterList = await prof_mngnt_model.find(filter)
                    .populate()
                    .exec();
                if (filterList) {
                    res.status(200).json({ status: "success", data: filterList });
                } else {
                    res.status(200).json({ status: "error", data: "Internal Server Error" });
                }
            } catch (error) {
                console.log('error>', error)
                res.status(500).json({ status: "error", data: error });
            }
        } else {
            res.status(200).json({ status: "error", data: "Preference Settings Missing" });
        }
    } catch(error) {
        console.log('error>', error)
        res.status(500).json({ status: "error", data: error });
    }    
}*/

exports.filter = async (req, res) => {
    let profileId = req.params.profileId;
    try {
        const profileInfo = await partnr_pref_model.findOne({ 'profile_id': profileId }).exec();
        if (profileInfo) {
            //res.status(200).json({ status: "success", data: profileInfo });
            const filter = {};
            const {
                horoscope_preference, location_preference,
                education_preference, profession_preference,
                lifestyle_and_food_preference, religious_preference,
                personal_preference
            } = profileInfo;

            if (horoscope_preference) {
                const { rasi_id, natchr_id, gothrm_id, dosham } = horoscope_preference;
                if (rasi_id)
                    filter["religion_info.rasi_id"] = rasi_id;
                if (natchr_id)
                    filter["religion_info.natchr_id"] = natchr_id;
                if (gothrm_id)
                    filter["religion_info.gothrm_id"] = gothrm_id;
                if (dosham)
                    filter["religion_info.dosham"] = dosham;
            }

            if (location_preference) {
                const { city_id, taluk_id, dist_id, state_id, country_id, location_proximity } = location_preference;
                if (city_id)
                    filter["residing_location.city_id"] = city_id;
                // add frontend partner ui after uncommand
                // if (taluk_id)
                //     filter["residing_location.taluk_id"] = taluk_id;
                if (dist_id)
                    filter["residing_location.dist_id"] = dist_id;
                if (state_id)
                    filter["residing_location.state_id"] = state_id;
                if (country_id)
                    filter["residing_location.country_id"] = country_id;
                //     //if (location_proximity)
                //         //filter["location_preference.location_proximity"] = location_proximity;
            }

            if (education_preference) {
                const { educationtype_id, education_id, eduinstitution_id, eduuniversity_id } = education_preference;
                if (educationtype_id && educationtype_id.length > 0)
                    filter["professional_info.educationtype_id"] = { $in: educationtype_id };
                if (education_id && education_id.length > 0)
                    filter["professional_info.education_id"] = { $in: education_id };
                if (eduinstitution_id && eduinstitution_id.length > 0)
                    filter["professional_info.eduinstitution_id"] = { $in: eduinstitution_id };
                if (eduuniversity_id && eduuniversity_id.length > 0)
                    filter["professional_info.eduuniversity_id"] = { $in: eduuniversity_id };
            }

            if (profession_preference) {
                const { occupation_id, employmentype_id, income_id, work_dist_id, work_state_id, work_country_id } = profession_preference;
                if (occupation_id)
                    filter["professional_info.occupation_id"] = { $in: occupation_id };
                if (employmentype_id)
                    filter["professional_info.employmentype_id"] = { $in: employmentype_id };

                // add frontend partner ui after uncommand
                if (income_id)
                    filter["professional_info.income_id"] = income_id;
                if (work_dist_id)
                    filter["professional_info.work_dist_id"] = work_dist_id;
                if (work_state_id)
                    filter["professional_info.work_state_id"] = work_state_id;
                if (work_country_id)
                    filter["professional_info.work_country_id"] = work_country_id;
            }

            if (lifestyle_and_food_preference) {
                const { smoking, drinking, food } = lifestyle_and_food_preference;
                if (smoking)
                    filter["personal_info.smoking"] = smoking;
                if (drinking)
                    filter["personal_info.drinking"] = drinking;
                if (food)
                    filter["personal_info.food"] = food;
            }

            if (religious_preference) {
                const { religion_id, caste_id, sub_caste_id } = religious_preference;
                if (religion_id)
                    filter["religion_info.religion_id"] = religion_id;
                if (caste_id)
                    filter["religion_info.caste_id"] = caste_id;
                if (sub_caste_id)
                    filter["religion_info.sub_caste_id"] = sub_caste_id;
            }

            if (personal_preference) {
                const {
                    age_from, age_to, height_from, height_to,
                    weight_from, weight_to, salary_from, salary_to,
                    language_id, citizenship_id, physical_status,
                    family_type, marital_status, family_status, family_values, gender, body_type
                } = personal_preference;
                // if (age_from !== undefined && age_to !== undefined) {
                //     filter["personal_info.age"] = { $gte: age_from, $lte: age_to };
                // } else if (age_from !== undefined) {
                //     filter["personal_info.age"] = { $gte: age_from };
                // } else if (age_to !== undefined) {
                //     filter["personal_info.age"] = { $lte: age_to };
                // }
                // const currentDate = new Date();
                // const currentYear = currentDate.getFullYear();
                // const currentMonth = currentDate.getMonth();
                // const currentDay = currentDate.getDate();

                // let filter = {};

                // if (age_from !== undefined && age_to !== undefined) {
                //     filter["$expr"] = {
                //         $and: [
                //             {
                //                 $gte: [
                //                     {
                //                         $subtract: [
                //                             currentYear,
                //                             { $year: "$basic_info.date_of_birth" }
                //                         ]
                //                     },
                //                     age_from
                //                 ]
                //             },
                //             {
                //                 $lte: [
                //                     {
                //                         $subtract: [
                //                             currentYear,
                //                             { $year: "$basic_info.date_of_birth" }
                //                         ]
                //                     },
                //                     age_to
                //                 ]
                //             }
                //         ]
                //     };
                // } else if (age_from !== undefined) {
                //     filter["$expr"] = {
                //         $gte: [
                //             {
                //                 $subtract: [
                //                     currentYear,
                //                     { $year: "$basic_info.date_of_birth" }
                //                 ]
                //             },
                //             age_from
                //         ]
                //     };
                // } else if (age_to !== undefined) {
                //     filter["$expr"] = {
                //         $lte: [
                //             {
                //                 $subtract: [
                //                     currentYear,
                //                     { $year: "$basic_info.date_of_birth" }
                //                 ]
                //             },
                //             age_to
                //         ]
                //     };
                // }

                // if (height_from !== undefined && height_to !== undefined) {
                //     filter["personal_info.height"] = { $gte: height_from, $lte: height_to };
                // } else if (height_from !== undefined) {
                //     filter["personal_info.height"] = { $gte: height_from };
                // } else if (height_to !== undefined) {
                //     filter["personal_info.height"] = { $lte: height_to };
                // }

                if (weight_from !== undefined && weight_to !== undefined) {
                    filter["personal_info.weight"] = { $gte: weight_from, $lte: weight_to };
                } else if (weight_from !== undefined) {
                    filter["personal_info.weight"] = { $gte: weight_from };
                } else if (weight_to !== undefined) {
                    filter["personal_info.weight"] = { $lte: weight_to };
                }

                //     // if (salary_from !== undefined && salary_to !== undefined) {
                //     //     filter["personal_preference.salary_from"] = { $gte: salary_from, $lte: salary_to };
                //     // } else if (salary_from !== undefined) {
                //     //     filter["personal_preference.salary_from"] = { $gte: salary_from };
                //     // } else if (salary_to !== undefined) {
                //     //     filter["personal_preference.salary_from"] = { $lte: salary_to };
                //     // }

                if (language_id)
                    filter["personal_info.language_id"] = language_id;
                if (citizenship_id)
                    filter["personal_info.citizenship_id"] = citizenship_id;
                if (physical_status)
                    filter["personal_info.physical_status"] = physical_status;
                if (family_type)
                    filter["family_info.family_type"] = family_type;
                if (marital_status)
                    filter["personal_info.marital_status"] = marital_status;

                if (family_status)
                    filter["family_info.family_status"] = family_status;
                if (family_values)
                    filter["family_info.family_values"] = family_values;
                if (gender)
                    filter["basic_info.gender"] = gender;
                if (body_type)
                    filter["personal_info.body_type"] = body_type;
            }

            try {
                const filterList = await prof_mngnt_model.find(filter)
                    .populate()
                    .exec();
                if (filterList) {
                    res.status(200).json({ status: "success", data: filterList });
                } else {
                    res.status(200).json({ status: "error", data: "Internal Server Error" });
                }
            } catch (error) {
                console.log('error>', error)
                res.status(500).json({ status: "error", data: error });
            }
        } else {
            res.status(200).json({ status: "error", data: "Preference Settings Missing" });
        }
    } catch (error) {
        console.log('error>', error)
        res.status(500).json({ status: "error", data: error });
    }
}