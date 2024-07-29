const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: 'YOUR_2CAPTCHA_API_KEY' // Replace with 2Captcha API key
    },
    visualFeedback: true // Colorize reCAPTCHAs (visual feedback)
  })
);

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

async function getHotelInfo(city) {
  const searchUrl = `https://www.example.com/search?city=${encodeURIComponent(city)}&stars=5&guests=2&children=1&childAge=1`;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Solve CAPTCHA if present
  const { captchas, solved } = await page.solveRecaptchas();
  if (captchas.length > 0) {
    console.log(`Solved ${solved.length} captchas`);
  }

  const content = await page.content();
  const $ = cheerio.load(content);

  let hotelInfo = [];

  // Example selector, you need to inspect the website to find the correct selectors
  $('div.hotel-listing').each((i, elem) => {
    const name = $(elem).find('h2.hotel-name').text();
    const rating = $(elem).find('span.hotel-rating').text();
    const price = $(elem).find('span.hotel-price').text().replace('₹', '').trim();
    hotelInfo.push({ name, rating, price: parseFloat(price) });
  });

  await browser.close();

  hotelInfo = hotelInfo.filter(hotel => hotel.rating === '5').sort((a, b) => a.price - b.price);

  return hotelInfo.length > 0 ? hotelInfo[0] : null;
}

async function main() {
  const city = 'Mumbai'; // Change the city as needed

  // Random delay between requests to avoid rate limiting
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  try {
    await delay(Math.floor(Math.random() * 5000) + 2000); // Delay between 2-7 seconds
    const hotel = await getHotelInfo(city);

    if (hotel) {
      console.log(`Cheapest 5-star hotel in ${city} for a 5-night stay:`);
      console.log(`Name: ${hotel.name}`);
      console.log(`Price: ₹${hotel.price}`);
    } else {
      console.log(`No 5-star hotels found in ${city}.`);
    }
  } catch (error) {
    console.error('Error fetching hotel info:', error);
  }
}

main();
