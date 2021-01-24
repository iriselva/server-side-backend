//requiering express and initializing the app:
const app = require('express')();
//requiering the cors middleware:
const cors = require('cors');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://iriselva:Vefthrounbakendi3@cluster0.qjdyc.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const bodyParser = require('body-parser')
  
// create application/json parser
const jsonParser = bodyParser.json()

app.use(cors());//telling express to use the cors middleware

app.get('/', (req,res)=>{ //listen to a get request
  client.connect(async err => {
    const collection = client.db("test").collection("devices");
    //perform actions on the collection object
    //find everything in the collection and turn it into an array:
    const data = await collection.find().toArray();
    
    //now we turn our data into a string and send it over to the client
    //remember that our data is an array of objects (in this case only one object) but JSON.stringify turns it into a string 
    res.send(JSON.stringify(data));
  });
})

app.get('/project/types', (req,res)=>{ 
    client.connect(async err => {
        const collection = client.db("test").collection("types");
        const data = await collection.find().toArray();
    
        res.send(JSON.stringify(data));
      });
})

app.get('/projects', (req,res)=>{
    client.connect(async err => {
        console.log('HALLLO IRIS!')
        const collection = client.db("test").collection("projects");
        const data = await collection.find().toArray();

        res.send(JSON.stringify(data));
      });
})
  
app.post('/projects', jsonParser, (req, res)=>{
    client.connect(async err => {
        console.log(Object.keys(req))
        var newProject = {
            name: req.body.name,
            type: req.body.type,
            yarn: req.body.yarn,
            date: req.body.date,
        };
        console.log(newProject)
        /* Inserting new object through form */
        client.db("test").collection("projects").insertOne(newProject);
       
        res.send(JSON.stringify(newProject));
      });
})

app.delete('/projects/:id', (req, res)=> {
    client.connect(async err => {
        var id = req.params.id;
        /* Deleting object from collection through id */
        client.db("test").collection("projects").deleteOne({_id: new mongodb.ObjectID(id)});

        res.send();
    });
})
  
app.listen(port, ()=>{ //listen to the port we chose above
    //print to the console that the server is listening
    console.log("listening to port: " + port);
})