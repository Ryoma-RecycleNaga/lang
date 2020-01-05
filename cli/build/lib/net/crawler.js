"use strict";
/**
 * This example demonstrates how to use [`PuppeteerCrawler`](../api/puppeteercrawler)
 * in combination with [`RequestQueue`](../api/requestqueue) to recursively scrape the
 * <a href="https://news.ycombinator.com" target="_blank">Hacker News website</a> using headless Chrome / Puppeteer.
 * The crawler starts with a single URL, finds links to next pages,
 * enqueues them and continues until no more desired links are available.
 * The results are stored to the default dataset. In local configuration, the results are stored as JSON files in `./apify_storage/datasets/default`
 *
 * To run this example on the Apify Platform, select the `Node.js 10 + Chrome on Debian (apify/actor-node-chrome)` base image
 * on the source tab of your actor configuration.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Apify = require('apify');
function crawler(url = 'https://community.preciousplastic.com/how-to') {
    return __awaiter(this, void 0, void 0, function* () {
        // Apify.openRequestQueue() is a factory to get a preconfigured RequestQueue instance.
        // We add our first request to it - the initial page the crawler will visit.
        const requestQueue = yield Apify.openRequestQueue();
        yield requestQueue.addRequest({ url: url });
        // Create an instance of the PuppeteerCrawler class - a crawler
        // that automatically loads the URLs in headless Chrome / Puppeteer.
        const crawler = new Apify.PuppeteerCrawler({
            requestQueue,
            // Here you can set options that are passed to the Apify.launchPuppeteer() function.
            launchPuppeteerOptions: {
                // For example, by adding "slowMo" you'll slow down Puppeteer operations to simplify debugging
                slowMo: 500,
                headless: false
            },
            // Stop crawling after several pages
            maxRequestsPerCrawl: 10,
            // This function will be called for each URL to crawl.
            // Here you can write the Puppeteer scripts you are familiar with,
            // with the exception that browsers and pages are automatically managed by the Apify SDK.
            // The function accepts a single parameter, which is an object with the following fields:
            // - request: an instance of the Request class with information such as URL and HTTP method
            // - page: Puppeteer's Page object (see https://pptr.dev/#show=api-class-page)
            handlePageFunction: ({ request, page }) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Processing ${request.url}...`);
                /*
                // A function to be evaluated by Puppeteer within the browser context.
                const pageFunction = ($posts) => {
                    const data = [];
    
                    // We're getting the title, rank and URL of each post on Hacker News.
                    $posts.forEach(($post) => {
                        data.push({
                            title: $post.querySelector('.title a').innerText,
                            rank: $post.querySelector('.rank').innerText,
                            href: $post.querySelector('.title a').href,
                        });
                    });
    
                    return data;
                };
                const data = await page.$$eval('.athing', pageFunction);
    
                // Store the results to the default dataset.
                await Apify.pushData(data);
    
                // Find a link to the next page and enqueue it if it exists.
                const infos = await Apify.utils.enqueueLinks({
                    page,
                    requestQueue,
                    selector: '.morelink',
                });
    
                if (infos.length === 0) {
                    console.log(`${request.url} is the last page!`);
                }
                */
            }),
            // This function is called if the page processing failed more than maxRequestRetries+1 times.
            handleFailedRequestFunction: ({ request }) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Request ${request.url} failed too many times`);
                yield Apify.pushData({
                    '#debug': Apify.utils.createRequestDebugInfo(request),
                });
            }),
            gotoFunction: ({ session, page, request }) => __awaiter(this, void 0, void 0, function* () {
                console.log('goto ' + request.url);
                return page.goto(request.url, {
                    waitUntil: 'domcontentloaded'
                });
            })
        });
        // Run the crawler and wait for it to finish.
        yield crawler.run();
        console.log('Crawler finished.');
    });
}
exports.crawler = crawler;
;
//# sourceMappingURL=crawler.js.map