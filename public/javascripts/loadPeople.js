const { MongoClient, ServerApiVersion } = require("mongodb");
const data = require("../data/people.json");
const uri =
	"mongodb+srv://rabarbanel:iVCwKfBXLrRxzw4C@mcollections.dor0p.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});

client.connect(async () => {
	const collection = client.db("party").collection("rsvp");
	// perform actions on the collection object
    await collection.insertMany(data);

	client.close();
});
