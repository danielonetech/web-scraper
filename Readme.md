Explanation of Index.js
This code sets up a web scraper using Puppeteer and Cheerio to fetch and parse hotel information from a specified URL. It handles CAPTCHAs using the puppeteer-extra-plugin-recaptcha and includes random delays to avoid rate limiting. The extracted information is filtered and sorted to find and display the cheapest 5-star hotel in a given city.


Importing Libraries:
axios: A promise-based HTTP client for making HTTP requests.
cheerio: A fast, flexible, and lean implementation of core jQuery designed specifically for the server, which helps in parsing HTML.
puppeteer-extra: An add-on to puppeteer that allows for plugins.
puppeteer-extra-plugin-recaptcha: A plugin for puppeteer-extra that helps in solving reCAPTCHAs automatically.

Configuring the reCAPTCHA Plugin:
puppeteer.use: Integrates the reCAPTCHA plugin into puppeteer.
RecaptchaPlugin: Configures the plugin with the 2Captcha service, using your API key for solving CAPTCHAs.
visualFeedback: Provides visual feedback for solved CAPTCHAs.

Fetching HTML Using axios and cheerio:
async function fetchHTML(url): An asynchronous function that fetches the HTML of a given URL.
axios.get(url): Makes a GET request to the URL.
cheerio.load(data): Loads the fetched HTML into cheerio for parsing and manipulating.

Main Function to Get Hotel Information:
searchUrl: Constructs the URL for searching hotels based on the given city.

Puppeteer Browser and Page Setup:
puppeteer.launch({ headless: false }): Launches a new browser instance. Setting headless: false opens the browser visibly.
browser.newPage(): Opens a new page/tab in the browser.

Navigating to the Search URL:
page.goto(searchUrl, { waitUntil: 'networkidle2' }): Navigates to the search URL and waits until there are no more than 2 network connections for at least 500 ms.

Solving CAPTCHAs if Present:
page.solveRecaptchas(): Solves reCAPTCHAs on the page.
captchas: Array of detected captchas.
solved: Array of solved captchas.
console.log: Logs the number of solved captchas.

Extracting Hotel Information:
page.content(): Gets the HTML content of the page.
cheerio.load(content): Loads the HTML content into cheerio for parsing.
hotelInfo: Initializes an array to store hotel information.

Parsing Hotel Listings:
$('div.hotel-listing').each: Loops through each hotel listing.
name: Extracts the hotel name.
rating: Extracts the hotel rating.
price: Extracts and cleans the hotel price, converting it to a number.
hotelInfo.push: Adds the extracted hotel information to the array.

Closing the Browser and Sorting Hotels:
browser.close(): Closes the browser.
hotelInfo.filter: Filters the hotels to include only those with a 5-star rating.
sort((a, b) => a.price - b.price): Sorts the hotels by price in ascending order.
return: Returns the cheapest 5-star hotel or null if none are found.

Main Function with Random Delay:
city: Sets the city for the search.
delay: Creates a delay function that returns a promise resolved after a specified time.

Fetching and Displaying Hotel Information
await delay: Introduces a random delay between 2-7 seconds to avoid rate limiting.
const hotel = await getHotelInfo(city): Fetches the hotel information.
console.log: Prints the hotel details or a message if no hotels are found.
catch (error): Logs any errors that occur during the fetching process.