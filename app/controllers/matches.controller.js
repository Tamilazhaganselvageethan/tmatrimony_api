const Core = require("../models/core.model.js");
const axios = require('axios');
//var religion_model = require('../models/religion.model.js');
var prof_mngnt_model = require('../models/profileManagement.model.js');
var set_conn_status_model = require('../models/setConnectionStatus.model.js');
var save_filter_model = require('../models/filter.model.js');

exports.profileInfo = async (req, res) => {
    let profileId = req.params.profileId;
    try {
        const profileInfo = await prof_mngnt_model.findOne({ '_id': profileId })
        .populate('basic_info.mother_lang_id')
        .populate('religion_info.religion_id')
        .populate('religion_info.caste_id')
        .populate('religion_info.sub_caste_id')
        .populate('religion_info.gothrm_id')
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

exports.setConnectionStatus = async (req, res) => {
    const { owner_id, selected_profile_id, interest_status } = req.body;
	try {
		const connection_status = await set_conn_status_model.findOneAndUpdate(
            {'interest_owner_id': owner_id,  'selected_profile_id':selected_profile_id},
            {'interest_status': interest_status},
            { new: true, upsert: true }
        ).exec();

        if (connection_status) {
            res.status(200).json({ status: "success", data:connection_status });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.sentConnectionList = async (req, res) => {
// user id
// user subs
// if (subs=='platinim') 
//free 

    let profileId = req.params.profileId;
    //console.log('profileId>>>', profileId);
    try {
        const connectionList = await set_conn_status_model.find({ 'interest_owner_id': profileId })
        .populate('selected_profile_id')
        .exec();
        if (connectionList) {
            res.status(200).json({ status: "success", data:connectionList });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
    }catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.receivedConnectionList = async (req, res) => {
    let profileId = req.params.profileId;
    //console.log('profileId>>>', profileId);
    try {
        const connectionList = await set_conn_status_model.find({ 'selected_profile_id': profileId })
        .populate('interest_owner_id')
        .exec();
        if (connectionList) {
            res.status(200).json({ status: "success", data:connectionList });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
    }catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.filter = async (req, res) => {
    /*const filter = {};
    const { rasi_id, natchr_id, gothrm_id, dosham, age_from, age_to, height_from, height_to, weight_from, weight_to, salary_from, salary_to, city_id, dist_id, state_id, country_id, location_proximity, education_id, higher_education_id, occupation_id, language_id, employmentype_id, citizenship_id, smoking, drinking, food, physical_status, family_type, marital_status, religion_id, caste_id, sub_caste_id } = req.body;

    if (rasi_id)
        filter["religion_info.rasi_id"] = rasi_id;
    if (natchr_id)
        filter["religion_info.natchr_id"] = natchr_id;
    if (gothrm_id)
        filter["religion_info.gothrm_id"] = gothrm_id;
    if (dosham)
        filter["religion_info.dosham"] = dosham;

    if (age_from !== undefined && age_to !== undefined) {
        filter["basic_info.age"] = { $gte: age_from, $lte: age_to };
    } else if (age_from !== undefined) {
        filter["basic_info.age"] = { $gte: age_from };
    } else if (age_to !== undefined) {
        filter["basic_info.age"] = { $lte: age_to };
    }

    if (height_from !== undefined && height_to !== undefined) {
        filter["personal_info.age"] = { $gte: height_from, $lte: height_to };
    } else if (height_from !== undefined) {
        filter["personal_info.age"] = { $gte: height_from };
    } else if (height_to !== undefined) {
        filter["personal_info.age"] = { $lte: height_to };
    }

    if (weight_from !== undefined && weight_to !== undefined) {
        filter["personal_info.weight"] = { $gte: weight_from, $lte: weight_to };
    } else if (weight_from !== undefined) {
        filter["personal_info.weight"] = { $gte: weight_from };
    } else if (weight_to !== undefined) {
        filter["personal_info.weight"] = { $lte: weight_to };
    }

    //if (salary_from !== undefined && salary_to !== undefined) {
    //    filter["personal_info.salary"] = { $gte: salary_from, $lte: salary_to };
    //} else if (salary_from !== undefined) {
    //    filter["personal_info.salary"] = { $gte: salary_from };
    //} else if (salary_to !== undefined) {
    //    filter["personal_info.salary"] = { $lte: salary_to };
    //}

    if (city_id)
        filter["residing_location.city_id"] = city_id;
    if (dist_id)
        filter["residing_location.dist_id"] = dist_id;
    if (state_id)
        filter["residing_location.state_id"] = state_id;
    if (country_id)
        filter["residing_location.country_id"] = country_id;
    //if (location_proximity)
    if (education_id && education_id.length > 0)
        filter["professional_info.education_id"] = { $in: education_id };
    if (higher_education_id)
        filter["professional_info.higher_education_id"] = { $in: higher_education_id };
    if (occupation_id)
        filter["professional_info.occupation_id"] = { $in: occupation_id };
    if (language_id)
        filter["personal_info.language_id"] = { $in: [language_id] };
    if (employmentype_id)
        filter["professional_info.employmentype_id"] = { $in: employmentype_id };
    if (citizenship_id)
        filter["professional_info.citizenship_id"] = citizenship_id;
    if (smoking)
        filter["personal_info.smoking"] = smoking;
    if (drinking)
        filter["personal_info.drinking"] = drinking;
    if (food)
        filter["personal_info.food"] = food;
    if (physical_status)
        filter["personal_info.physical_status"] = physical_status;
    if (family_type)
        filter["family_info.family_type"] = family_type;
    if (marital_status)
        filter["personal_info.marital_status"] = marital_status;
    if (religion_id)
        filter["religion_info.religion_id"] = religion_id;
    if (caste_id)
        filter["religion_info.caste_id"] = caste_id;
    if (sub_caste_id)    
        filter["religion_info.sub_caste_id"] = sub_caste_id;
    
    try {
        const filterList = await prof_mngnt_model.find(filter)
        .populate()
        .exec();
        if (filterList) {
            res.status(200).json({ status: "success", data:filterList });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
    }catch(error){
        console.log('error>', error)
        res.status(500).json({ status: "error", data: error});
    }*/
    const filter = {};
    const {
        horoscope_filter, location_filter,
        education_filter, profession_filter,
        lifestyle_and_food_filter, religious_filter,
        personal_filter
    } = req.body.data;

    if (horoscope_filter) {
        const { rasi_id, natchr_id, gothrm_id, dosham } = horoscope_filter;
        if (rasi_id)
            filter["religion_info.rasi_id"] = rasi_id;
        if (natchr_id)
            filter["religion_info.natchr_id"] = natchr_id;
        if (gothrm_id)
            filter["religion_info.gothrm_id"] = gothrm_id;
        if (dosham)
            filter["religion_info.dosham"] = dosham;
    }

    if (location_filter) {
        const { city_id, taluk_id, dist_id, state_id, country_id, location_proximity } = location_filter;
        if (city_id)
            filter["residing_location.city_id"] = city_id;
        if (taluk_id)
            filter["residing_location.taluk_id"] = taluk_id;
        if (dist_id)
            filter["residing_location.dist_id"] = dist_id;
        if (state_id)
            filter["residing_location.state_id"] = state_id;
        if (country_id)
            filter["residing_location.country_id"] = country_id;
        //if (location_proximity)
            //filter["location_preference.location_proximity"] = location_proximity;
    }

    if (education_filter) {
        const { educationtype_id, education_id, eduinstitution_id, eduuniversity_id } = education_filter;
        if (educationtype_id && educationtype_id.length > 0)
            filter["professional_info.educationtype_id"] = { $in: educationtype_id };
        if (education_id && education_id.length > 0)
            filter["professional_info.education_id"] = { $in: education_id };
        if (eduinstitution_id && eduinstitution_id.length > 0)
            filter["professional_info.eduinstitution_id"] = { $in: eduinstitution_id };
        if (eduuniversity_id && eduuniversity_id.length > 0)
            filter["professional_info.eduuniversity_id"] = { $in: eduuniversity_id };
    }

    if (profession_filter) {
        const { occupation_id, employmentype_id, income_id, work_dist_id, work_state_id, work_country_id } = profession_filter;
        if (occupation_id)
            filter["professional_info.occupation_id"] = { $in: occupation_id };
        if (employmentype_id)
            filter["professional_info.employmentype_id"] = { $in: employmentype_id };
        if (income_id)
            filter["professional_info.income_id"] = income_id;
        if (work_dist_id)
            filter["professional_info.work_dist_id"] = work_dist_id;
        if (work_state_id)
            filter["professional_info.work_state_id"] = work_state_id;
        if (work_country_id)
            filter["professional_info.work_country_id"] = work_country_id;
    }

    if (lifestyle_and_food_filter) {
        const { smoking, drinking, food } = lifestyle_and_food_filter;
        if (smoking)
            filter["personal_info.smoking"] = smoking;
        if (drinking)
            filter["personal_info.drinking"] = drinking;
        if (food)
            filter["personal_info.food"] = food;
    }

    if (religious_filter) {
        const { religion_id, caste_id, sub_caste_id } = religious_filter;
        if (religion_id)
            filter["religion_info.religion_id"] = religion_id;
        if (caste_id)
            filter["religion_info.caste_id"] = caste_id;
        if (sub_caste_id)
            filter["religion_info.sub_caste_id"] = sub_caste_id;
    }

    if (personal_filter) {
        const {
            age_from, age_to, height_from, height_to,
            weight_from, weight_to, salary_from, salary_to,
            language_id, citizenship_id, physical_status,
            family_type, marital_status, family_status, family_values, gender, body_type
        } = personal_filter;
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

        /*if (salary_from !== undefined && salary_to !== undefined) {
            filter["personal_preference.salary_from"] = { $gte: salary_from, $lte: salary_to };
        } else if (salary_from !== undefined) {
            filter["personal_preference.salary_from"] = { $gte: salary_from };
        } else if (salary_to !== undefined) {
            filter["personal_preference.salary_from"] = { $lte: salary_to };
        }*/

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
}

exports.saveFilter = async (req, res) => {
    const { data } = req.body;
    data.filter_owner_id = req.body.profileId;
    //console.log(data); return;
	try {
		const connection_status = await save_filter_model.create(data);

        if (connection_status) {
            res.status(200).json({ status: "success", data:connection_status });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.getFilterList = async (req, res) => {
    let profileId = req.params.profileId;
    //console.log('profileId>>>', profileId);
    try {
        const connectionList = await save_filter_model.find({ 'filter_owner_id': profileId }).exec();
        if (connectionList) {
            res.status(200).json({ status: "success", data:connectionList });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
    }catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.deleteFilter = async (req, res) => {
    let filer_id = req.params.filer_id;
    try {
        const connectionList = await save_filter_model.deleteOne({ '_id': filer_id }).exec();
        if (connectionList) {
            res.status(200).json({ status: "success", data:connectionList });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
    }catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}