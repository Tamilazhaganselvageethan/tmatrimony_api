var caste_model = require('../models/caste.model.js');
var citizenship_model = require('../models/citizenShip.model.js');
var city_model = require('../models/city.model.js');
var country_model = require('../models/country.model.js');
var district_model = require('../models/district.model.js');
var educationType_model = require('../models/educationType.model.js');
var education_model = require('../models/education.model.js');
var educationInstitution_model=require('../models/educationInstitution.model.js');
var educationUniversity_model =require('../models/educationUniversity.model.js')
var employmentType_model = require('../models/employmentType.model.js');
var gothram_model = require('../models/gothram.model.js');
var higherEducation_model = require('../models/higherEducation.model.js');
var hobbies_model = require('../models/hobbies.model.js');
var income_model = require('../models/income.model.js');
var lang_model = require('../models/language.model.js');
var natchra_model = require('../models/nakshatra.model.js');
var occupation_model = require('../models/occupation.model.js');
var rasi_model = require('../models/rasi.model.js');
var religion_model = require('../models/religion.model.js');
var state_model = require('../models/state.model.js');
var subcaste_model = require('../models/subcaste.model.js');
var taluk_model = require('../models/taluk.model.js');

exports.caste = async (req, res) => {	
	try {
		const caste_list = await caste_model.find({}, 'caste_nme _id');

        if (caste_list) {
            res.status(200).json({ status: "success", data:caste_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.citizenship = async (req, res) => {	
	try {
		const citizenship_list = await citizenship_model.find({}, 'citizenship_nme _id');

        if (citizenship_list) {
            res.status(200).json({ status: "success", data:citizenship_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.city = async (req, res) => {	
	try {
		const city_list = await city_model.find({}, 'city_nme _id');

        if (city_list) {
            res.status(200).json({ status: "success", data:city_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.country = async (req, res) => {	
	try {
		const country_list = await country_model.find({}, 'country_nme _id');

        if (country_list) {
            res.status(200).json({ status: "success", data:country_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

// master.controller.js
exports.getCountries = async (req, res) => {	
    try {
        const country_list = await country_model.find({}, 'name_0 country_id');
        if (country_list) {
            res.status(200).json({ status: "success", data: country_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
    } catch (error) {
        console.log('error>', error);
        res.status(500).json({ status: "error", data: error });
    }
};
// master.controller.js
exports.getStatesByCountry = async (req, res) => {	
    try {
        const { cnty_id } = req.query;
        if (!cnty_id) 
            return res.status(400).json({ status: "error", data: "Country ID is required" });
        
        const country_list = await country_model.findOne({ _id: cnty_id }).select('country_id');

        const state_list = await state_model.find({ 'country_id':country_list.country_id }, 'name_1 state_id');
        if (state_list) {
            res.status(200).json({ status: "success", data: state_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
    } catch (error) {
        console.log('error>', error);
        res.status(500).json({ status: "error", data: error });
    }
};

// master.controller.js
exports.getDistrictsByState = async (req, res) => {	
    try {
        const { stat_id } = req.query;

        if (!stat_id) 
            return res.status(400).json({ status: "error", data: "State ID is required" });
        
        const state_list = await state_model.findOne({ _id: stat_id }).select('state_id');
        //console.log('>>>', state_list);
        const district_list = await district_model.find({ 'state_id':state_list.state_id }, 'name_2 _id');
        if (district_list) {
            res.status(200).json({ status: "success", data: district_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
    } catch (error) {
        console.log('error>', error);
        res.status(500).json({ status: "error", data: error });
    }
};

// master.controller.js
exports.getTaluksByDistrict = async (req, res) => {	
    try {
        const { dist_id } = req.query;

        if (!dist_id) 
            return res.status(400).json({ status: "error", data: "District ID is required" });

        const state_list = await district_model.findOne({ _id: dist_id }).select('name_2');
        
        console.log('dist_id>>', state_list);
        const taluk_list = await taluk_model.find({ 'name_2':state_list.name_2 }, 'name_3 _id');
        if (taluk_list) {
            res.status(200).json({ status: "success", data: taluk_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
    } catch (error) {
        console.log('error>', error);
        res.status(500).json({ status: "error", data: error });
    }
};


exports.district = async (req, res) => {	
	try {
		const district_list = await district_model.find({}, 'district_nme _id');

        if (district_list) {
            res.status(200).json({ status: "success", data:district_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}
exports.getEducationByType = async (req, res) => {	
	try {
        const { educationType } = req.query;

        if (!educationType) {
            return res.status(400).json({ status: "error", data: "Education type is required" });
        }

        const educationList = await education_model.find({ education_type: educationType });

        if (educationList) {
            res.status(200).json({ status: "success", data: educationList });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error" });
        }
	} catch (error) {
		console.log('error>', error);
		res.status(500).json({ status: "error", data: error });
	}
};
exports.education = async (req, res) => {	
	try {
		const education_list = await education_model.find({}, 'education_nme _id');

        if (education_list) {
            res.status(200).json({ status: "success", data:education_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}
exports.educationType = async (req, res) => {	
	try {
		const educationType_list = await educationType_model.find({}, 'educationtype_nme _id');

        if (educationType_list) {
            res.status(200).json({ status: "success", data:educationType_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}
exports.educationInstitution = async (req, res) => {	
	try {
		const educationInstitution_list = await educationInstitution_model.find({}, 'eduinstitution_nme _id');

        if (educationInstitution_list) {
            res.status(200).json({ status: "success", data:educationInstitution_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.educationUniversity = async (req, res) => {	
	try {
		const educationUniversity_list = await educationUniversity_model.find({}, 'eduuniversity_nme _id');

        if (educationUniversity_list) {
            res.status(200).json({ status: "success", data:educationUniversity_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}


exports.employmentType = async (req, res) => {	
	try {
		const employmentType_list = await employmentType_model.find({}, 'employment_type_nme _id');

        if (employmentType_list) {
            res.status(200).json({ status: "success", data:employmentType_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.gothram = async (req, res) => {	
	try {
		const gothram_list = await gothram_model.find({}, 'gothram_nme _id');

        if (gothram_list) {
            res.status(200).json({ status: "success", data:gothram_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.higherEducation = async (req, res) => {	
	try {
		const higherEducation_list = await higherEducation_model.find({}, 'highereducation_nme _id');

        if (higherEducation_list) {
            res.status(200).json({ status: "success", data:higherEducation_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.hobbies = async (req, res) => {	
	try {
		const hobbies_list = await hobbies_model.find({}, 'hobbies_nme _id');

        if (hobbies_list) {
            res.status(200).json({ status: "success", data:hobbies_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.income = async (req, res) => {	
	try {
		const income_list = await income_model.find({}, 'income_nme _id');

        if (income_list) {
            res.status(200).json({ status: "success", data:income_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.languages = async (req, res) => {	
	try {
		const language_list = await lang_model.find({}, 'language_nme _id');

        if (language_list) {
            res.status(200).json({ status: "success", data:language_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.natchra = async (req, res) => {	
	try {
		const natchra_list = await natchra_model.find({}, 'natchr_nme _id');

        if (natchra_list) {
            res.status(200).json({ status: "success", data:natchra_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.occupation = async (req, res) => {	
	try {
		const occupation_list = await occupation_model.find({}, 'occupation_nme _id');

        if (occupation_list) {
            res.status(200).json({ status: "success", data:occupation_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.rasi = async (req, res) => {	
	try {
		const rasi_list = await rasi_model.find({}, 'rasi_nme _id');

        if (rasi_list) {
            res.status(200).json({ status: "success", data:rasi_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.religion = async (req, res) => {	
	try {
		const religion_list = await religion_model.find({}, 'religion_nme _id');

        if (religion_list) {
            res.status(200).json({ status: "success", data:religion_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.state = async (req, res) => {	
	try {
		const state_list = await state_model.find({}, 'state_nme _id');

        if (state_list) {
            res.status(200).json({ status: "success", data:state_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}

exports.subcaste = async (req, res) => {	
	try {
		const subcaste_list = await subcaste_model.find({}, 'subcaste_nme _id');

        if (subcaste_list) {
            res.status(200).json({ status: "success", data:subcaste_list });
        } else {
            res.status(500).json({ status: "error", data: "Internal Server Error"});
        }
	}catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}
}



