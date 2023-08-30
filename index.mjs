 import chalks from 'chalk';
//const {Mongoclient} = require('mongodb');
import {MongoClient} from 'mongodb'
const uri = "mongodb://0.0.0.0:27017";

const client = new MongoClient(uri);
const db = client.db("MiniProject")
const createCollection = async (db, collectionName) =>{
    try{
        await client.connect();
        const collection = await db.createCollection(collectionName);
        console.log(chalks.green("Collection Created", collection.collectionName));

    }
    catch{
        console.log(chalks.red("Error Creating Collection"));
    }
    finally{
        await client.close();
    }
}

createCollection(db,"Notes App" )

