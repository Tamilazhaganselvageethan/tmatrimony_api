const mongoose = require('mongoose');

const partnerPreference = new mongoose.Schema({
  /*preference_id: {
    type: Number,
    required: true,
    unique: true // Assuming it's a primary key
  },*/
  /*profile_id: {
    type: Number,
    required: true,
    unique: true
  },*/
  ory_identity_id: String,
  profile_id: {type: mongoose.Schema.Types.ObjectId, ref: 'profileRegistration'}, //FK
  horoscope_preference : {
	rasi_id: {type: mongoose.Schema.Types.ObjectId, ref: 'rasiMaster' }, //FK from rasiMaster
	natchr_id: {type: mongoose.Schema.Types.ObjectId, ref: 'nakshatraMaster' }, //FK from nakshatraMaster
	gothrm_id: {type: mongoose.Schema.Types.ObjectId, ref: 'gothramMaster' }, //FK from gothramMaster
	dosham: {
		type: String,
			enum: ['Yes', 'No', 'Don\'t Know']
	} //Yes / No
  },	
  location_preference : {
	//location_id: Number, //FK: location_id	
	city_id: {type: mongoose.Schema.Types.ObjectId, ref: 'cityMaster' }, //FK from cityMaster
	taluk_id: {type: mongoose.Schema.Types.ObjectId, ref: 'talukMaster' }, //new
	dist_id: {type: mongoose.Schema.Types.ObjectId, ref: 'districtMaster' }, //FK from districtMaster
	state_id: {type: mongoose.Schema.Types.ObjectId, ref: 'stateMaster' }, //FK from stateMaster
	country_id: {type: mongoose.Schema.Types.ObjectId, ref: 'countryMaster' }, //FK from countryMaster
	location_proximity: String, //'within 10km', 'within 20km', 'within 30km', 'within 40km'
  },	
  education_preference : {
	educationtype_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'educationTypeMaster' }], //new
	education_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'educationMaster'}], //FK: education_id
	//eduinstitution_id:{type: mongoose.Schema.Types.ObjectId, ref: 'educationInstitutionMaster' },
    //eduuniversity_id:{type: mongoose.Schema.Types.ObjectId, ref: 'educationUniversityMaster' },	
	//higher_education_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'higherEducationMaster' }], //FK: higher_education_id
	employmentype_id: {type: mongoose.Schema.Types.ObjectId, ref: 'employmentTypeMaster' }, //new
    occupation_id: {type: mongoose.Schema.Types.ObjectId, ref: 'occupationMaster' }, //new
  },
  profession_preference : {
	occupation_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'occupationMaster' }], //FK: occupation_id
	employmentype_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'employmentTypeMaster' }], //FK: employmentype_id
	income_id: {type: mongoose.Schema.Types.ObjectId, ref: 'incomeMaster' }, //new
    //work_location_id: Number, //FK: location_id
    work_dist_id: {type: mongoose.Schema.Types.ObjectId, ref: 'districtMaster' }, //new
    work_state_id: {type: mongoose.Schema.Types.ObjectId, ref: 'stateMaster' }, //new
    work_country_id: {type: mongoose.Schema.Types.ObjectId, ref: 'countryMaster' }, //new
  },	
  lifestyle_and_food_preference : {
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
  religious_preference : {
	religion_id: {type: mongoose.Schema.Types.ObjectId, ref: 'religionMaster' }, //FK from religionMaster
	caste_id: {type: mongoose.Schema.Types.ObjectId, ref: 'casteMaster' }, //FK from casteMaster
	sub_caste_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'subcasteMaster' }, //FK from subcasteMaster
  },	
  personal_preference : {
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
	family_status: {//new
      type: String,
      enum: ['Middle Class', 'Upper Middle Class', 'High Class', 'Rich/Affluent']
    },
	family_type: {
	  type: String,
	  enum: ['Joint', 'Nuclear']
	},
	family_values: {//new
      type: String,
      enum: ['Orthodox', 'Traditional', 'Moderate', 'Liberal']
    },
	marital_status: {
	  type: String,
	  enum: ['Never Married', 'Widowed', 'Divorced']
	},
	gender: {//new
      type: String,
      enum: ['Male', 'Female', 'Third Gender']
    },
	body_type:{//new
      type: String,
      enum: ['Slim', 'Athletic', 'Average', 'Heavy']
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
});

module.exports = mongoose.model('Preference', partnerPreference);