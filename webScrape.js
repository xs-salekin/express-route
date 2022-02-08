import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const webScrape = class webScrape {
    set setUrl(url) {
        this.url = url;
    }
    get content() {
        return this.#getResult();
    }

    #isValidUrl = (string) => {
        const matchPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
        return matchPattern.test(string);
    }
    #cleanText = (str) => {
        str = str.replaceAll('\t', ' '); //replacing all tabs into one space
        str = str.replace(/  +/gm, ' '); //replacing multiple space into one
        str = str.replace(/\n+/gm, '\n'); //replacing multiple new line into one [use <br> for page render]
        str = str.replace(/<[^>]+>/gm, ''); //stripping text from html tags
        return str.trim();
    }

    #getResult = async() => {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        let result = {};
        try {
            const page = await browser.newPage();
            await page.goto(this.url);
            let html = await page.content();

            const $ = cheerio.load(html, null, false);
            result.title = $('title').text();
            result.description = $('meta[name="description"]').attr('content');
            result.url = this.url;
            result.favicon = $('link[rel="icon"]').attr('href');

            $('form, nav, header, footer, script, figure, img, iframe, link, noscript').remove();

            if (!this.#isValidUrl(result.favicon)) {
                //removing trailing slash
                if (this.url.slice(-1) === '/')
                    this.url = this.url.slice(0, -1)

                //removing starting slash
                if (result.favicon.slice(0, 1) === '/')
                    result.favicon = result.favicon.slice(1);

                result.favicon = this.url + '/' + result.favicon;
            }

            result.content = [];

            let headings = $('h1, h2, h3, h4, h5, h6');

            for (let i = 0; i < headings.length; i++) {
                let newObj = {};
                //preparing title from heading
                newObj.title = this.#cleanText($(headings[i]).text());

                //tag name of the heading
                newObj.tag = $(headings[i])[0].name;

                //getting html markup as string between current heading and next one
                if (i === headings.length - 1)
                    newObj.text = $(headings[i]).nextAll().toString();
                else
                    newObj.text = $(headings[i]).nextUntil($(headings[i + 1])).toString();

                //stripping text from tags except p|li|div then stripping text with line break for rest of them
                newObj.text = newObj.text.replace(/<(\/?(p|li|div)|>)[^>]*>/gm, '\n');
                //cleaning text by removing unnecessary contents
                newObj.text = this.#cleanText(newObj.text);

                result.content.push(newObj)
            }


            await browser.close();
        } catch (error) {
            console.log(error);
        } finally {
            await browser.close();
        }

        return result;
    }
}

export { webScrape }