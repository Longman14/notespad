 import chalks from 'chalk';

import {MongoClient} from 'mongodb'
import yargs from 'yargs';
import {hideBin} from "yargs/helpers";
const uri = "mongodb://0.0.0.0:27017";
import fs from 'fs';
import {dirname, join}  from 'path';
import { fileURLToPath } from 'url';
import { argv } from 'process';


const client = new MongoClient(uri);
const db = client.db("MiniProject");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)





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



const insertNote = async (db, collectionName, note) => {

    await client.connect();
    const collection = db.collection(collectionName);
    
    try{
        const result = await collection.insertOne(note);
        console.log(chalks.green("Note Added to the Database", result.insertedId));
    } catch(err) {
        console.log(chalks.red("Error Adding Note", err));
    }finally{
        await client.close();
    }
}
const deleteNotedb = async (db, collectionName, doc2delete) => {
    await client.connect();
    const collection = db.collection(collectionName);
    try{
        const result = await collection.deleteOne(doc2delete);
        console.log(chalks.green("Note Deleted from the Database"));
    } catch(err) {
        console.log(chalks.red("Error Deleting Note", err));
    }finally{
        await client.close();
    }
}




const findNote = async (db, collectionName, query) => {
    await client.connect();
    const collection = db.collection(collectionName);
    try{
        const result = await collection.find(query).toArray();
        console.log(chalks.green("Note(s) Found in database", result));
    } catch (err) {
        console.log(chalks.red("Error Finding Note", err));
    }
    finally{
        await client.close();
    }
    
}


    const dataFilePath = join(__dirname, 'Notes_app.json');

    function readEntries(){
        try{
            const data = fs.readFileSync(dataFilePath, 'utf8');
            return JSON.parse(data);
        }
        catch (err){
            return [];
        }
    }

    function saveEntries(entries){
        fs.writeFileSync(dataFilePath, JSON.stringify(entries, null, 2), 'utf8');
    }




////////////////////////////////
//Using Yargs to obtain the inputs from the CLi and Parsing it into the database

yargs(hideBin(process.argv))
    .command("add", "Add a new note",  {task:{type:'string'}}, (argv)=> 
    {
        const title = argv.title;
        const body = argv.body;
        

        const note = {
            title: title,
            body: body
        };
        const noteString = JSON.stringify(note);
        const options = {encoding: 'utf8'};
        

        const entries = readEntries();
        entries.push(note);
        saveEntries(entries);
        console.log(chalks.green('Note Taken'));
        insertNote(db, "Notes App", note);

        
    
    }
    ) 
    
    //List command
.command("list", "List all notes",{task:{type:'string'}}, (argv)=>{
    const entries = readEntries();
    if (entries.length === 0) {
        console.log(chalks.red("No notes found"));
    }else {
        console.log(chalks.green("Notes Found"));
                console.log(chalks.blue(`Notes: `));
                entries.forEach((entry, index)=>{
                   console.log(`${index +1}. Title: ${entry.title}, Body: ${entry.body}` ) ;

                });
    }
     findNote(db, "Notes App", {})
})
//Delete Command
.command("remove", "Remove a note", {task:{type:'string'}}, (argv)=>{
    const entries = readEntries();
        
    const title = argv.title;
    let index = entries.findIndex((entry) => entry.title == title);
    
    if (index<0){
        console.log(chalks.red("Notes Does not Exist"));
    }else{
        const filteredNote = entries.filter((entry) => entry.title != title)
        deleteNotedb(db, "Notes App", {title: title})
    saveEntries(filteredNote);
    console.log(chalks.green(`Deleted Note: ${title}`));
    }
    

})
//List Command
.command('read', 'List a requested note by title', {task:{type:'string'}}, (argv)=>{

    const title = argv.title;
    // const body = argv.body;
    const entries = readEntries();
    const filteredNote = entries.filter((entry) => entry.title == title);
    if (filteredNote.length === 0) {
        console.log(chalks.red("Note Does not Exist"));
    }else {
        findNote(db, "Notes App", {title: title});
        filteredNote.forEach((entry)=>{
            console.log(chalks.green("Search Found!"))
            console.log(`Title: ${entry.title}, Body: ${entry.body}` ) ;

         });
    }

    
    
    
})

    
    
.parse();
        
   
