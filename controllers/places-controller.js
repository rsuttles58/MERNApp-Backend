const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "20 W 34th St, New York, NY, 10001",
    creator: "u1"
  }
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  console.log("Get request in Places");
  res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  //This line uses express-validator to identify if any errors were passed from the data validation of the request by express-validator in the routes.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed.  Check data", 422));
  }

  const { title, description, address, creator } = req.body;
  //create a createdPlace object from the values pushed.

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    //when place is created, uuid function is called which stores a new user
    //with a timestamp
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createPlace);
  //return json value of the created place
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  //This line uses express-validator to identify if any errors were passed from the data validation of the request by express-validator in the routes.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed.  Check data", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find(p => (p.id = placeId)) };
  const placeIndex = DUMMY_PLACES.findIndex(p => (p.id = placeId));
  updatedPlace.title = title;
  updatedPlace.description = description;

  //takes the copy of the dummyplace index item and updates it with the updates received from user
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatePlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id.", 404);
  }
  //return the array with all of the values except for the one that gets passed in as a param.
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p !== placeId);
  res.status(200).json({ message: "Deleted place." });
};
//to export multiple functions,
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
