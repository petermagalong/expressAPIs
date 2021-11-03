const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geacoder')
const Bootcamp = require('../models/Bootcamp')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query ;

    // Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ['select'];

    // Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    console.log(reqQuery)
    // Create query string
    let queryStr = JSON.stringify(req.query);

    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

   // finding resources
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //Select Fields https://mongoosejs.com/docs/queries.html
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields); 
    }

    // Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10 ) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Execution query
    const bootcamps = await query;

    //Pagination result
    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({success:true, count: bootcamps.length, pagination, data:bootcamps})  
})

//@desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    // try {
        const bootcamp =await Bootcamp.findById(req.params.id);
        if(!bootcamp){
          return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }

        res.status(200).send({ success: true, data: bootcamp});
    // } catch (error) {
    //     // res.status(404).send({ success: false, msg: `not found`});
    //     // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    //     next(error);
    // }
    // res.status(200).send({ success: true, msg: `get bootcamp ${req.params.id}`});
})

//@desc Create single bootcamp
//@route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).send({ success: true, data: bootcamp});
})


//@desc Update single bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        }); 
        if(!bootcamp){
            // return res.status(400).json({ success:false});
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({ success:true, data: bootcamp})  
    // res.status(200).send({ success: true, msg: `Update bootcamp ${req.params.id}`});
})


//@desc delete single bootcamp
//@route DEL /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id); // remove due to the cascade delete

        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }

        bootcamp.remove();
        res.status(200).json({ success:true, data: {}})
    // res.status(400).send({ success: true, msg: `delete bootcamp ${req.params.id}`});
})

//@desc get bootcamp with in a radius
//@route DEL /api/v1/bootcamps/radius/:zipcode/:distance
//@access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode,distance } = req.params;

    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;


    //Calc radius using radians 
    //divine dist by radius of Earth
    //Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location:{$geoWithin:{ $centerSphere:[ [lng, lat], radius]}}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})


