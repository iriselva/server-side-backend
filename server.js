//requiering express and initializing the app:
const app = require('express')();
//requiering the cors middleware:
const cors = require('cors');

const port = process.env.PORT;
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = process.env.MONGODB_URI;

console.log('JOJO',uri, port)
const client = new MongoClient(uri, { useNewUrlParser: true });

const bodyParser = require('body-parser')
  
// create application/json parser
const jsonParser = bodyParser.json()

app.use(cors());//telling express to use the cors middleware

app.get('/', (req,res)=>{ //listen to a get request
    res.send('Welcome to server side knitting!');
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