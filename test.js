import { webScrape } from './services/content-parser/webScrape.js';



(async() => {

    let url = 'https://wedevs.com/blog/400428/how-to-create-a-sports-marketplace-using-dokan';
    //declare object for the class
    let dynamic = new webScrape();

    dynamic.setUrl = url
    let data = await dynamic.content

    console.log(data)

})().catch(err => {
    console.error(err);
});