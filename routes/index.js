var express = require("express");
var router = express.Router();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
	`mongodb+srv://rabarbanel:${process.env.MONGO_PASS}` +
	`@mcollections.dor0p.mongodb.net/` +
	`?retryWrites=true&w=majority`;
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
	collection
		.find()
		.sort({ lastName: 1, firstName: 1 })
		.toArray()
		.then(cards => {
			const group = {
				yes: { count: 0, names: [] },
				no: { count: 0, names: [] },
				maybe: { count: 0, names: [] }
			};
			for (let p of cards) {
				if (p.email !== "?") {
					let r = p.response;
					if (r === "") r = "maybe";
					let g = group[r];
					let name = p.lastName + ", " + p.firstName;
					g.count++;
					g.names.push(name);
				}
			}
			res.render("report", { group });
		});
});

router.get("/:id", function(req, res, next) {
	res.render("indexid", { id: req.params.id });
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
	collection
		.updateOne(query, { $set: { response, date: new Date() } })
		.then(() => {
			res.json({ response });
		});
});

module.exports = router;
