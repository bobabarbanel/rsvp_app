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
router.get("/report", function(req, res, next) {
	res.render("report");
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
router.get("/api/count", function(req, res, next) {
	collection
		.find()
		.sort({ lastName: 1, firstName: 1 })
		.toArray()
		.then(cards => {
			const group = { yes: [], no: [], maybe: [] };

			for (let p of cards) {
				if (p.email !== "?") {
					group[p.response === "" ? "maybe" : p.response].push(p);
				}
			}
			group['count']['yes'] = group['yes'].length;
			group['count']['no'] = group['no'].length;
			group['count']['maybe'] = group['maybe'].length;
			res.json(group);
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

module.exports = router;
