//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = (req, res, next) => {
    res.status(400).send({ success: true, msg: 'tian'});
}

//@desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).send({ success: true, msg: `get bootcamp ${req.params.id}`});
}

//@desc Create single bootcamp
//@route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = (req, res, next) => {
    res.status(201).send({ success: true, msg: 'Create new bootcamp'});
}


//@desc Update single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).send({ success: true, msg: `Update bootcamp ${req.params.id}`});
}


//@desc delete single bootcamp
//@route DEL /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = (req, res, next) => {
    res.status(400).send({ success: true, msg: `delete bootcamp ${req.params.id}`});
}


