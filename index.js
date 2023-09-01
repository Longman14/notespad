 import chalks from 'chalk';
import mongodb, { ObjectId } from 'mongodb'
import {ListCollectionsCursor, MongoClient} from 'mongodb'
import yargs from 'yargs';
import {hideBin} from "yargs/helpers";
import {readFile, writeFile} from 'fs';
const uri = "mongodb://0.0.0.0:27017";
import fs from 'fs';

const client = new MongoClient(uri);
const db = client.db("MiniProject");




console.log(chalks.yellow("Welcome to Notes. Allow me to take down your thoughts and tasks"));




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

//createCollection(db,"Notes App", {title: title} )

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

////////////////////////////////
//Using Yargs to obtain the inputs from the CLi and Parsing it into the database

yargs(hideBin(process.argv))
    .command("add", "Add a new note",  {task:{type:'string'}}, (argv)=> 
    {
        const title = argv.title;
        const body = argv.body;
        const commandz = yargs(process.argv.slice(2)).argv;

let findPos = commandz._;

        const note = {
            title: title,
            body: body
        };
        const noteString = note.toString();
        const options = {encoding: 'utf8'};
        if(findPos == "add"){
            console.log(chalks.blue("Adding a new note"));
           fs.writeFile('Notes app.txt', noteString, options ,(err)=>{
            if(err) throw err;
            console.log(chalks.green(`file has been created and ${title} added`));
           })
            insertNote(db, "Notes App", note);
            console.log(chalks.green(`${title} has been added successfully`));
        } else{
            console.log("something is wrong")
        }
    }) 
        
    .parse();
        
   
