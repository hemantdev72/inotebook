const express=require('express');
const router=express.Router();
const Notes=require('../models/Notes');
const fetchuser=require('../middleware/fetchUser');

router.get('/getnotes',fetchuser,async(req,res)=>{
    const notes=await Notes.find({user:req.user.id});
    res.json(notes);
})

router.post('/addnote',fetchuser,async (req,res)=>{
    const{title,description}=req.body
    try{
        if (!title || !description) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        } else{
            const note=new Notes({title,description,user:req.user.id});
            const saveNote=await note.save();
            res.json(saveNote);
        }
    } catch(error){
        res.status(200).json({
            error:'something wrong'
        })
    }


})

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports=router;