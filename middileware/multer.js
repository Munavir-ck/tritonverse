const multer = require("multer");

const fileStorageEngine=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'public/uploadImage') 
    },
    filename:(req,file,callback)=>{
        callback(null,Date.now()+'--'+file.originalname)
    }
    

});

const upload=multer({storage:fileStorageEngine});

const storeImage=upload.array('image',3)
module.exports={storeImage}