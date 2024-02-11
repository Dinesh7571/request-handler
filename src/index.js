import express from "express";
import admin from 'firebase-admin'

import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://deployment-server-a0601.appspot.com'
  });

const app = express();
const bucket = admin.storage().bucket();





app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
   // console.log(`filee name =>>>${filePath}`)
    try {
        const file = bucket.file(`build/${id}${filePath}`);
        
       // const file = bucket.file(`Name/zb33g/index.html`);

        const fileContent = await file.download();
        console.log(fileContent)
        const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";

        res.set("Content-Type", type);
        res.send(fileContent.Body);
        } catch (error) {
        console.error('Error retrieving file from Firebase Storage:', error);
        res.status(500).send('Internal Server Error');
    }
})
app.get("/test", async (req, res) => {
   res.send("resquest handler running")
})

app.listen(3001,()=>{
    console.log("server is running on port: 30001")
});