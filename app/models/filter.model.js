const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
	filter_owner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'profileRegistration'}, //FK
	filter_name: {type: String, unique: true},
	//profile_id: {type: mongoose.Schema.Types.ObjectId, ref: 'profileRegistration'}, //FK
  	horoscope_filter : {
		rasi_id: {type: mongoose.Schema.Types.ObjectId, ref: 'rasiMaster' }, //FK from rasiMaster
		natchr_id: {type: mongoose.Schema.Types.ObjectId, ref: 'nakshatraMaster' }, //FK from nakshatraMaster
		gothrm_id: {type: mongoose.Schema.Types.ObjectId, ref: 'gothramMaster' }, //FK from gothramMaster
		dosham: {
			type: String,
				enum: ['Yes', 'No', 'Don\'t Know']
		} //Yes / No
  	},	
	location_filter : {
		//location_id: Number, //FK: location_id
		city_id: {type: mongoose.Schema.Types.ObjectId, ref: 'cityMaster' }, //FK from cityMaster
		dist_id: {type: mongoose.Schema.Types.ObjectId, ref: 'districtMaster' }, //FK from districtMaster
		state_id: {type: mongoose.Schema.Types.ObjectId, ref: 'stateMaster' }, //FK from stateMaster
		country_id: {type: mongoose.Schema.Types.ObjectId, ref: 'countryMaster' }, //FK from countryMaster
		location_proximity: String, //'within 10km', 'within 20km', 'within 30km', 'within 40km'
	},	
	education_filter : {
		education_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'educationMaster'}], //FK: education_id
		higher_education_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'higherEducationMaster' }], //FK: higher_education_id
	},
	profession_filter : {
		occupation_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'occupationMaster' }], //FK: occupation_id
		employmentype_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'employmentTypeMaster' }], //FK: employmentype_id
	},	
	lifestyle_and_food_filter : {
		smoking: {
			type: String,
			enum: ['Yes', 'No']
		},
		drinking: {
			type: String,
			enum: ['Yes', 'No']
		},
		food: {
			type: String,
			enum: ['Vegetarian', 'Non-vegetarian', 'Eggtarian']
		}
	},
	religious_filter : {
		religion_id: {type: mongoose.Schema.Types.ObjectId, ref: 'religionMaster' }, //FK from religionMaster
		caste_id: {type: mongoose.Schema.Types.ObjectId, ref: 'casteMaster' }, //FK from casteMaster
		sub_caste_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'subcasteMaster' }, //FK from subcasteMaster
	},	
	personal_filter : {
		age_from: Number,
		age_to: Number,
		height_from: Number,
		height_to: Number,
		weight_from: Number,
		weight_to: Number,
		salary_from: Number, 
		salary_to: Number,
		language_id: {type: mongoose.Schema.Types.ObjectId, ref: 'languageMaster'}, //FK from languageMaster
		citizenship_id: {type: mongoose.Schema.Types.ObjectId, ref: 'citizenShipMaster'}, //FK from citizenShipMaster
		physical_status:{
			type: String,
			enum: ['Normal', 'Physically Challenged']
		},
		family_type: {
			type: String,
			enum: ['Joint', 'Nuclear']
		},
		marital_status: {
			type: String,
			enum: ['Never Married', 'Widowed', 'Divorced']
		}
	},
	created_date: {
		type: Date,
		default: Date.now
	},
	updated_date: {
		type: Date,
		default: Date.now
	},
	created_by: Number, //FK: profile_id
	updated_by: Number, //FK: profile_id
	created_ip: Number, 
	updated_ip: Number
}, { collection: 'saved_filters' });

module.exports = mongoose.model('filter', filterSchema);