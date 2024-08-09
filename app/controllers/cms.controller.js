var cms_model = require('../models/cms.model');

exports.index = async (req, res) => {
    let page_sku = req.params.page_sku;
    //console.log('page_sku>>', page_sku);
    try {
        const cmsInfo = await cms_model.findOne({ 'sku': page_sku }).exec();
        if (cmsInfo) {
            res.status(200).json({ status: "success", data:cmsInfo });
        } else {
            //res.status(500).json({ status: "error", data: "Internal Server Error"});
            res.status(200).json({ status: "error", data: "Internal Server Error"});
        }
    }catch(error){
		console.log('error>', error)
		res.status(500).json({ status: "error", data: error});
	}    
}
