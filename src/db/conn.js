const mongoose = require('mongoose');
const { GridFsStorage } = require("multer-gridfs-storage");

function dbConnect() {
  mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  )
    .then(() => {
      console.log('db connected');
    })
    .catch((err) => {
      console.log('something went wrong', { err });
    });

  // let bucket;
  // mongoose.connection.on("connected", () => {
  //   var db = mongoose.connections[0].db;
  //   bucket = new mongoose.mongo.GridFSBucket(db, {
  //     bucketName: "imageBucket"
  //   });
  //   console.log("bucket");
  // });
}

module.exports = dbConnect;
