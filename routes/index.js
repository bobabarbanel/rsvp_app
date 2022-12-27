var express = require("express");
var router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const ObjectId = require("mongodb").ObjectId;
const uri =
	"mongodb+srv://rabarbanel:iVCwKfBXLrRxzw4C@mcollections.dor0p.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});
let collection;
client.connect(async () => {
	collection = client.db("party").collection("rsvp");
});
/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index");
});
router.get("/all", function(req, res, next) {
	collection
		.find()
		.sort({ lastName: 1, firstName: 1 })
		.toArray()
		.then(cards => {
			res.json(cards);
		});
});

router.post("/getRsvp", function(req, res, next) {
	// console.log(req.params);
	const fr = new RegExp(req.body.firstName, "i");
	const lr = new RegExp(req.body.lastName, "i");
	const query = {
		firstName: {
			$regex: fr
		},
		lastName: {
			$regex: lr
		}
	};
	// console.log(query);
	collection.find(query).toArray().then(cards => {
		if (cards.length === 1) {
			res.json(cards[0]);
		} else {
			console.log("error", cards.length);
		}
	});
});

router.post("/updateRsvp", function(req, res, next) {
	console.log(req.params);
	let { _id, response } = req.body;
	const query = { _id: new ObjectId(_id) };
	collection.updateOne(query, { $set: { response, date: new Date() } }).then(() => {
		res.json({ response });
	});
});

module.exports = router;
