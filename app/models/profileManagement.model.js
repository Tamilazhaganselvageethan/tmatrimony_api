var mongoose = require('mongoose');
//var lang_model = require('../models/language.model.js');

var profileManagementSchema = new mongoose.Schema({
  /*profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },*/
  basic_info:{    
    first_name: String,
    //middle_name: String,
    last_name: String,
    mobile: Number,
    email: String,
    date_of_birth: Date,
    age: Number,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Third Gender']
    },  
    mother_lang_id: {type: mongoose.Schema.Types.ObjectId, ref: 'languageMaster' }, //FK
    //password: String
    ory_identity_id: String,
    teleph_code: Number, //new
    landline_no: Number    //new
  },   
  religion_info:{
    religion_id: {type: mongoose.Schema.Types.ObjectId, ref: 'religionMaster' }, //FK
    caste_id: {type: mongoose.Schema.Types.ObjectId, ref: 'casteMaster' }, //FK
    sub_caste_id: {type: mongoose.Schema.Types.ObjectId, ref: 'subcasteMaster' }, //FK
    gothrm_id: {type: mongoose.Schema.Types.ObjectId, ref: 'gothramMaster' }, //FK
    dosham: {
      type: String,
      enum: ['Yes', 'No', 'Don\'t Know']
    }, 
    /**/
    want_same_community: Boolean,
    // uncommad code add new in profilemanagementcontroller
    natchr_id: {type: mongoose.Schema.Types.ObjectId, ref: 'nakshatraMaster' }, //FK: natchr_id
    rasi_id: {type: mongoose.Schema.Types.ObjectId, ref: 'rasiMaster' }, //FK: rasi_id
  }, 
  personal_info:{
    marital_status: {
      type: String,
      enum: ['Never Married', 'Widowed', 'Divorced']
    },
    height: Number,
    weight: Number,
    /*family_status: {
      type: String,
      enum: ['Middle Class', 'Upper Middle Class', 'High Class', 'Rich/Affluent']
    },
    family_type: {
      type: String,
      enum: ['Joint', 'Nuclear']
    },
    family_values: {
      type: String,
      enum: ['Orthodox', 'Traditional', 'Moderate', 'Liberal']
    },*/
    physical_status:{
      type: String,
      enum: ['Normal', 'Physically Challenged']
    }, 
    food: {
      type: String,
      enum: ['Vegetarian', 'Non-vegetarian', 'Eggtarian']
    },

    /**/
    about_me: String,
    profile_created_by: {
      type: String,
      enum: ['Father', 'Mother', 'Brother', 'Sister', 'Self']
    }, 
    body_type:{
      type: String,
      enum: ['Slim', 'Athletic', 'Average', 'Heavy']
    },     
    smoking: {
      type: String,
      enum: ['Yes', 'No']
    },
    drinking: {
      type: String,
      enum: ['Yes', 'No']
    },    
    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    },
    avatar_Id: String,  //new
    profile_picture: String,
    gallery_id: String, //new
    folder_name: String,
    photo_folder_url: String,
    citizenship_id: {type: mongoose.Schema.Types.ObjectId, ref: 'citizenShipMaster'}, //FK: citizenship_id
    language_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'languageMaster'}], //FK: language_id,
    hobbies: [Number], //FK: hobbie_id   
    id_proof_folder_url: String //new   
  },
  professional_info:{
    educationtype_id:{type: mongoose.Schema.Types.ObjectId, ref: 'educationTypeMaster' },
    education_id: {type: mongoose.Schema.Types.ObjectId, ref: 'educationMaster' }, //FK
    eduinstitution_id:{type: mongoose.Schema.Types.ObjectId, ref: 'educationInstitutionMaster' },
    eduuniversity_id:{type: mongoose.Schema.Types.ObjectId, ref: 'educationUniversityMaster' },
    // higher_education_id: {type: mongoose.Schema.Types.ObjectId, ref: 'higherEducationMaster' }, //FK
    employmentype_id: {type: mongoose.Schema.Types.ObjectId, ref: 'employmentTypeMaster' }, //FK
    occupation_id: {type: mongoose.Schema.Types.ObjectId, ref: 'occupationMaster' }, //FK
    income_id: {type: mongoose.Schema.Types.ObjectId, ref: 'incomeMaster' }, //FK
    //work_location_id: Number, //FK: location_id
    work_city_id: {type: mongoose.Schema.Types.ObjectId, ref: 'cityMaster' }, //FK
    work_taluk_id: {type: mongoose.Schema.Types.ObjectId, ref: 'talukMaster' }, //FK  //new
    work_dist_id: {type: mongoose.Schema.Types.ObjectId, ref: 'districtMaster' }, //FK
    work_state_id: {type: mongoose.Schema.Types.ObjectId, ref: 'stateMaster' }, //FK
    work_country_id: {type: mongoose.Schema.Types.ObjectId, ref: 'countryMaster' }, //FK
    work_zipcode: Number,

    /**/
    education_detail: String,
    higher_education_detail: String,
    occupation_detail: String,
    work_mobile: Number,
    work_email: String,
    work_landline_no: Number, //new
    edu_folder_url: String, // MinIO URLs  //new
    work_folder_url: String // MinIO URLs //new
  },
  horoscope_info:{
    time_of_birth: String,
    //place_of_birth: Number, //FK: location_id    
    city_id: {type: mongoose.Schema.Types.ObjectId, ref: 'cityMaster' }, //FK
    taluk_id: {type: mongoose.Schema.Types.ObjectId, ref: 'talukMaster' }, //FK  //new
    dist_id: {type: mongoose.Schema.Types.ObjectId, ref: 'districtMaster' }, //FK
    state_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'stateMaster' }, //FK
    country_id: {type: mongoose.Schema.Types.ObjectId, ref: 'countryMaster' }, //FK    
    
    natchr_id: {type: mongoose.Schema.Types.ObjectId, ref: 'nakshatraMaster' }, //FK: natchr_id //new
    rasi_id: {type: mongoose.Schema.Types.ObjectId, ref: 'rasiMaster' }, //FK: rasi_id //new
    dosham: {
      type: String,
      enum: ['Yes', 'No', 'Don\'t Know']
    }, //new
    horoscope_folder_url: String, // MinIO URLs
  },  
  family_info:{
    family_status: {
      type: String,
      enum: ['Middle Class', 'Upper Middle Class', 'High Class', 'Rich/Affluent']
    },
    family_type: {
      type: String,
      enum: ['Joint', 'Nuclear']
    },
    family_values: {
      type: String,
      enum: ['Orthodox', 'Traditional', 'Moderate', 'Liberal']
    },
    father_name: String,
    mother_name: String,
    no_of_brothers: Number,
    no_of_sisters: Number,
    about_family: String,
    father_occupation_id: String,
    mother_occupation_id: String,
    ancestral_origin: String,
  },  
  residing_location:{
    address1: String,
    address2: String,
    //location_id: Number, //FK: location_id
    city_id: {type: mongoose.Schema.Types.ObjectId, ref: 'cityMaster' }, //FK
    taluk_id: {type: mongoose.Schema.Types.ObjectId, ref: 'talukMaster' }, //FK  //new
    dist_id: {type: mongoose.Schema.Types.ObjectId, ref: 'districtMaster' }, //FK
    state_id: {type: mongoose.Schema.Types.ObjectId, ref: 'stateMaster' }, //FK
    country_id: {type: mongoose.Schema.Types.ObjectId, ref: 'countryMaster' }, //FK
    zipcode: Number,
    location_coord: String, //latitude, longitude
    folder_url: String, // MinIO URLs //new
  }, 
  social_media_info:{
    facebook_id: String,
    instagram_id: String,
    linkedin_id: String,
    twitter_id: String
  },
  verify:{
    mobile_verify_status: Boolean,
    id_proof_verify_status: Boolean,
    id_proof_doc:{
      type: String,
      enum: ['Driving License', 'PAN', 'Passport', 'VoterID', 'Aadhaar']
    }, 
    id_proof_folder_url: String,
    edu_proof_verify_status: Boolean,
    edu_proof_doc: String,
    edu_proof_folder_url: String,
    income_proof_verify_status: Boolean,
    income_proof_doc: String,
    income_proof_folder_url: String,
    work_proof_doc: String,      //new
    work_proof_folder_url: String,   //new
    photo_proof_selfie: Boolean,
    photo_proof_selfie_folder_url: String,
    photo_verify_status: Boolean,
  },
  profile_info:{  
    delete_reason: String,
    //priority: Number,
    status: String, //enum [1,2,3]  //new
    isSelected: Boolean,    //new
    blacklisted_profile_ids: [Number], //FK: profile_ids
    paid_on: Date,
    expires_on: Date,
    no_of_views: {
      type: Number,
      default: 0
    },
    no_of_clicks: {
      type: Number,
      default: 0
    },
    no_of_likes: {
      type: Number,
      default: 0
    },
    profile_visibilty: {
      type: String,
      enum: ['Premium', 'Free']
    },
    who_can_send_you_interest_requests: {
      type: String,
      enum: ['Premium', 'Free']
    },  
    favorite_ids: [Number] //FK: profile_ids
  },
  profile_ctd_dt: {
    type: Date,
    default: Date.now
  },
  profile_ctd_by: Number, //FK: profile_id
  profile_ctd_ip: String,
  profile_mfd_dt: {
    type: Date,
    default: Date.now
  },
  profile_mfd_by: Number, //FK: profile_id
  profile_mfd_ip: String  
}, { collection: 'profile_registration' });

module.exports = mongoose.model('profileRegistration', profileManagementSchema);