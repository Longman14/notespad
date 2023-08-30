 import chalks from 'chalk';
//const {Mongoclient} = require('mongodb');
import mongodb, { ObjectId } from 'mongodb'
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
        console.log(chalks.green("Note Added", result.insertedId));
    } catch(err) {
        console.log(chalks.red("Error Adding Note", err));
    }finally{
        await client.close();
    }
}

// insertNote(db, "Notes App", {
//     title: "Monday Tasks",
//     body: "Wake up and the smell the coffee",
//     remark: "Today was a great day"

// })


const findNote = async (db, collectionName, query) => {
    await client.connect();
    const collection = db.collection(collectionName);
    try{
        const result = await collection.find(query).toArray();
        console.log(chalks.green("Note Found", result));
    } catch (err) {
        console.log(chalks.red("Error Finding Note", err));
    }
    finally{
        await client.close();
    }
    
}

// findNote(db, "Notes App", {
//     title:"Monday Tasks"}) 
const updateNote = async (db, collectionName, selectionQuery, updateQuery) =>{
    
        try {
            await client.connect();
            const collection = db.collection(collectionName);
            await collection.updateOne(selectionQuery, {$push: updateQuery});
            console.log(chalks.greenBright("Document updated Successfully"));
    
    
      }
      catch (err){
        console.log("Error updating document", err);
    
      }
    finally {
        await client.close();
    };
      };

//updateNote(db, "Notes App", {_id: new mongodb.ObjectId("64ef1a62318c8eb1920c4f79")}, {remark: "Today was awesome"});

const deleteNote = async (db, collectionName, selectionQuery) =>{
    
    try {
        await client.connect();
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne(selectionQuery);
        console.log(chalks.red("Note deleted Successfully"));
        console.log(chalks.red(`${result.deletedCount} note(s) deleted`));


  }
  catch (err){
    console.log("Error deleting note", err);

  }
finally {
    await client.close();
};
  };

//   deleteNote(db, "Notes App", {_id: new mongodb.ObjectId('64ef1a62318c8eb1920c4f79')} )

//findNote(db, "Notes App", {title: "Monday Tasks"})
