const Bootcamp = require('../models/Bootcamp')
//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps =async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success:true, count: bootcamps.length, data:bootcamps})
    } catch (error) {
        res.status(400).json({ success: false});
    }
    
}

//@desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp =async (req, res, next) => {

    try {
        const bootcamp =await Bootcamp.findById(req.params.id);
        if(!bootcamp){
          return  res.status(404).send({ success: false, msg: `user found`});
        }

        res.status(200).send({ success: true, data: bootcamp});
    } catch (error) {
        res.status(404).send({ success: false, msg: `not found`});
    }
    // res.status(200).send({ success: true, msg: `get bootcamp ${req.params.id}`});
}

//@desc Create single bootcamp
//@route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).send({ success: true, data: bootcamp});
    } catch (error) {
        res.status(400).json({ success: false})
    }
}


//@desc Update single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamp = async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    if(!bootcamp){
        return res.status(400).json({ success:false});
    }


    res.status(200).json({ success:true, data: bootcamp})
    // res.status(200).send({ success: true, msg: `Update bootcamp ${req.params.id}`});
}


//@desc delete single bootcamp
//@route DEL /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp =async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
        if(!bootcamp){
            return res.status(400).json({ success:false });
        }
    
    
        res.status(200).json({ success:true, data: {}})
    } catch (error) {
        res.status(400).send({ success: false, msg: `failed delete bootcamp ${req.params.id}`});
    }
    // res.status(400).send({ success: true, msg: `delete bootcamp ${req.params.id}`});
}


