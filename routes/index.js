var express = require("express");
var router = express.Router();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
	`mongodb+srv://rabarbanel:${process.env.MONGO_PASS}@mcollections.dor0p.mongodb.net/?retryWrites=true&w=majority`;
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
router.get("/:id", function(req, res, next) {
	res.render("indexid", {id: req.params.id});
});
router.get("/api/all", function(req, res, next) {
	collection
		.find()
		.sort({ lastName: 1, firstName: 1 })
		.toArray()
		.then(cards => {
			res.json(cards);
		});
});

router.get("/api/getRsvp", function(req, res, next) {
	const _id = new ObjectId(req.query.id);
	const query = { _id };
	collection.find(query).toArray().then(cards => {
		if (cards.length === 1) {
			res.json(cards[0]);
		} else {
			console.log("error", cards.length);
		}
	});
});

router.post("/api/updateRsvp", function(req, res, next) {
	let { _id, response } = req.body;
	const query = { _id: new ObjectId(_id) };
	collection.updateOne(query, { $set: { response, date: new Date() } }).then(() => {
		res.json({ response });
	});
});

router.post("/api/contribute", function(req, res, next) {
	let { _id, amount, from } = req.body;
	const query = { _id: new ObjectId(_id) };
	collection
		.updateOne(query, { $set: { contribution: {
			amount : +amount,
			from
		} } })
		.then(() => {
			res.json({ response });
		});
});
module.exports = router;
