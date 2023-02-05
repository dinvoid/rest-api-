const {ObjectId } = require('mongodb')
const express = require('express');

const {connectToDb,getDb}=require('./Db')
//init app &middleware
const app = express();

app.use(express.json());


//db connection
let db
connectToDb((err)=>{
 if(!err){
 	app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
    db=getDb()
 }
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});


//routes
//GET ALL DATA 
app.get('/books', (req, res) => {
  let books=[]
  db.collection('books')
  	.find()
  	.sort({author:1})
  	.forEach(book =>books.push(book))
  	.then(()=>{
  		res.status(200).json(books)
  	})
  	.catch(()=>{
  		res.status(500).json({error:'Could not fetch documents'})
  	})
});

//GET DATA FROM ID
app.get('/books/:id',(req,res)=>{
	if(ObjectId.isValid(req.params.id)){
      db.collection('books')
        .findOne({_id: ObjectId(req.params.id)})
        .then(doc=>{
        	res.status(200).json(doc)
        })
        .catch(err=>{
   	        res.status(500).json({error:'Culd not fetch doucment'})
        })

    } else {
    	 res.status(500).json({error:'Not a Valid'})
    }
});

//POST OR ADD BOOKS
app.post('/books',(req,res)=>{
 const book = req.body;
 	 db.collection('books')
 	 	.insertOne(book)
 	 	.then(result=>{
 	 		res.status(201).json(result)
 	 	})
 	 	.catch(err=>{
 	 		res.status(500).json({err:'Could not create a new document'})
 	 	})  
});

//DELETE BOOKS FROM DOCUMENTS USING ID
app.delete('/books/delete/:id',(req,res)=>{
	if(ObjectId.isValid(req.params.id)){
      db.collection('books')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result=>{
        	res.status(200).json(result)
        })
        .catch(err=>{
   	        res.status(500).json({error:'Could not delete document'})
        })

    } else {
    	 res.status(500).json({error:'Not a Valid document ID'})
    }
})

//UPDATE BOOKS
app.patch('/books/:id',(req,res)=>{
 const updates = req.body;
	if(ObjectId.isValid(req.params.id)){
      db.collection('books')
        .updateOne({_id: ObjectId(req.params.id)},{$set:updates})
        .then(result=>{
        	res.status(200).json(result)
        })
        .catch(err=>{
   	        res.status(500).json({error:'Could not update document'})
        })

    } else {
    	 res.status(500).json({error:'Not a Valid document ID'})
    }
})







