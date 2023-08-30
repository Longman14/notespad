 import chalks from 'chalk';
//const {Mongoclient} = require('mongodb');
import {ListCollectionsCursor, MongoClient} from 'mongodb'
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

//createCollection(db,"Notes App" )

const insertNote = async (db, collectionName, note) => {

    await client.connect();
    const collection = db.collection(collectionName);
    
    try{
        const result = await collection.insertOne(note);
        console.log(chalks.green.bold("Note Added", result.insertedId));
    } catch(err) {
        console.log(chalks.red("Error Adding Note", err));
    }finally{
        await client.close();
    }
}

insertNote(db, "Notes App", {
    title: "Monday Tasks",
    body: "Wake up and the smell the coffee"
})