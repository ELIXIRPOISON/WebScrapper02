const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const url = "https://books.toscrape.com";

async function scrapeProducts() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const products = [];

        $('.product_pod').each((_, element) => {
            const productName = $(element).find('h3 a').attr('title').trim();
            const price = $(element).find('.price_color').text().trim();
            const availability = $(element).find('.instock.availability').text().trim();
            const rating = $(element).find('.star-rating').attr('class').split(' ')[1]; // Extract rating class

            products.push({
                Product_Name: productName,
                Price: price,
                Availability: availability,
                Rating: rating,
            });
        });

        console.log(products);

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(products);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Products");
        xlsx.writeFile(workbook, "Products.xlsx");
        console.log("Excel file saved: Products.xlsx");

    } catch (error) {
        console.error("Error scraping products:", error.message);
    }
}

scrapeProducts();
