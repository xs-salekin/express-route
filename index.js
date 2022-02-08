import express from 'express';
import cors from 'cors'
import { webScrape } from './webScrape.js';
import { middleware } from './middleware.js';
import { schemas } from './schemas.js';
import { callback } from './callback.js';

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());



async function run() {
    try {

        app.get('/', callback.home)

        
        app.post('/user', middleware(schemas.user), callback.user)





        app.get('/webscrape', async (req, res) => {

            let dynamic = new webScrape();

            dynamic.setUrl = req.query.url

            let data = await dynamic.content

            res.send(data);
        });

    } catch (e) {
        console.log(e);
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('running app')
});

app.listen(port, () => {
    console.log('running on port ', port);
});