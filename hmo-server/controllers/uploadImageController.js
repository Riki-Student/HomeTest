const db = require('../models/index')
const Patient = db.patient
const path = require ('path')
const {v4:uuid} = require("uuid")
const fsPromises =require("fs").promises


const uploadImage = async (req,res)=>{

    const{id}=req.params;
 
    if(!id)
    {
        res.status(400).send("please send id")
    }
    if(!req.file){
        res.status(500).send("No file")
    }

    const file = req.file
    const folder = path.join(__dirname, "..", "public", "images")
    const filename = `${uuid()}_${req.file.originalname}`
    const fileUrl  =`${folder}/${filename}`

    try{
        await fsPromises.writeFile(fileUrl, req.file.buffer)
        await Patient.update({img:filename},{where:{patientID:id}})
        const patient = await Patient.findByPk(id)
        console.log(patient)
        res.json({location: fileUrl, name:filename })
    }
    catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).send(err.message);
    }
}

module.exports = {
    uploadImage
}
