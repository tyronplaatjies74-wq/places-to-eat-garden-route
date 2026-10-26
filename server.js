const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const makeLinks = (lat,lng) => ({
  google: `https://maps.google.com/?q=${lat},${lng}`,
  waze: `https://waze.com/ul?ll=${lat},${lng}`,
  apple: `https://maps.apple.com/?q=${lat},${lng}`,
  embed: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
});

const restaurants = [
  { id: 1, town: "knysna", name: "34 South", food: "Seafood, sushi", desc: "Waterfront seafood with Knysna oysters", phone: "+27 44 382 7331", address: "Shop 19 Knysna Quays, Waterfront Dr", lat: -34.0422, lng: 23.0476 },
  { id: 2, town: "knysna", name: "Drydock Food Co", food: "Seafood, fusion", desc: "Two-story lagoon-side restaurant", phone: "+27 44 382 7310", address: "Knysna Waterfront", lat: -34.0418, lng: 23.0481 },
  { id: 3, town: "knysna", name: "East Head Cafe", food: "Seafood, burgers", desc: "Landmark on Eastern Head with Heads view", phone: "+27 44 384 0933", address: "25 George Rex Drive", lat: -34.035, lng: 23.075 },
  { id: 4, town: "knysna", name: "Freshline Fisheries", food: "Fresh seafood, braai", desc: "Rustic sand-floor BYOB seafood", phone: "+27 44 382 3131", address: "Railway Siding Dockyard", lat: -34.0415, lng: 23.049 },
  { id: 5, town: "knysna", name: "Tapas & Oysters", food: "Tapas, oysters", desc: "Vibrant tapas on Thesen Island", phone: "+27 44 382 7196", address: "31 Sawtooth Lane, Thesen Island", lat: -34.045, lng: 23.043 },
  { id: 6, town: "knysna", name: "Ile de Pain", food: "Bakery, breakfast", desc: "Artisan bakery on Thesen", phone: "+27 44 302 5705", address: "The Boatshed, Thesen Harbour Town", lat: -34.0445, lng: 23.045 },
  { id: 7, town: "knysna", name: "Blend Country Restaurant", food: "Country pub, pizza", desc: "Forest garden with fairy lights", phone: "+27 44 384 0493", address: "18 George Rex Dr, Hunters Home", lat: -34.033, lng: 23.048 },
  { id: 8, town: "knysna", name: "Col'Cacchio Knysna", food: "Italian, pizza", desc: "Thin base pizzas since 1992", phone: "+27 44 302 5750", address: "33 Sawtooth Lane, Thesen Harbour Town", lat: -34.0455, lng: 23.044 },
  { id: 9, town: "knysna", name: "Chatters Bistro", food: "Pizza, wood-fired", desc: "Famous thin-n-crispy pizzas", phone: "+27 44 382 0203", address: "9A Gray St, Knysna", lat: -34.0362, lng: 23.047 },
  { id: 10, town: "knysna", name: "Oldes Pub & Grill", food: "Pub, burgers", desc: "Local pub since 1998", phone: "+27 44 382 6514", address: "14 Gray Street", lat: -34.0368, lng: 23.0472 },
  { id: 11, town: "knysna", name: "African Bean", food: "South African, roti", desc: "Cape Malay curry in handmade roti", phone: "+27 44 382 2845", address: "29 Main Road", lat: -34.0355, lng: 23.0485 },
  { id: 12, town: "knysna", name: "Blackwaters River Lodge - Earth & Fire", food: "Farm-to-table", desc: "Ex tractor shed, farm restaurant", phone: "+27 44 383 0105", address: "N2 Highway, Goukamma", lat: -34.031, lng: 22.97 },
  { id: 13, town: "sedgefield", name: "Pili Pili Beach Restaurant", food: "Beach bar, pizza", desc: "Myoli Beach institution, shoes off", phone: "+27 44 343 3087", address: "Myoli Beach, Sedgefield", lat: -34.023, lng: 22.789 },
  { id: 14, town: "sedgefield", name: "Montecello", food: "Espetada, steak", desc: "Legendary espetada spot", phone: "+27 44 343 1780", address: "Main Rd, Sedgefield", lat: -34.026, lng: 22.798 },
  { id: 15, town: "sedgefield", name: "Filo's Restaurant", food: "Family, pizza", desc: "Family restaurant since 1990", phone: "+27 44 343 1380", address: "30 Main Road, Sedgefield", lat: -34.027, lng: 22.799 },
  { id: 16, town: "sedgefield", name: "Trattoria da Vinci", food: "Italian, pizza", desc: "Best pizza in Sedgefield", phone: "+27 44 343 1443", address: "Main Road, Sedgefield", lat: -34.025, lng: 22.8 },
  { id: 17, town: "sedgefield", name: "Upstairs at Rosie's", food: "Steak, seafood", desc: "Best steak ever, upstairs", phone: "+27 44 343 1093", address: "Main Road, Sedgefield", lat: -34.0265, lng: 22.799 },
  { id: 18, town: "sedgefield", name: "Lake View Restaurant", food: "Steak, seafood", desc: "Lake Pleasant Hotel with lake views", phone: "+27 67 239 9976", address: "Lake Pleasant Hotel, Groenvlei Road", lat: -34.03, lng: 22.795 },
  { id: 19, town: "sedgefield", name: "VDM Bistro", food: "Bistro", desc: "At Plumtree Trading Post", phone: "+27 60 738 3693", address: "52 Main Road, Sedgefield", lat: -34.025, lng: 22.8 },
  { id: 20, town: "sedgefield", name: "Mr Kaai's Fish and Chips", food: "Fish and chips", desc: "BYOB chippy opposite Steam Whistle", phone: "+27 74 756 8103", address: "Uil St, Sedgefield", lat: -34.028, lng: 22.797 },
  { id: 21, town: "sedgefield", name: "The Cowshed at Portland Manor", food: "Country, pizza", desc: "Rustic farm, wood-fired ovens", phone: "+27 83 260 6644", address: "Portland Manor, Rheenendal", lat: -33.98, lng: 22.75 },
  { id: 22, town: "wilderness", name: "Pomodoro", food: "Italian, pizza", desc: "Locals favourite, wood oven pizza", phone: "+27 44 877 1403", address: "Wilderness Village", lat: -33.987, lng: 22.579 },
  { id: 23, town: "wilderness", name: "The Girls on the Square", food: "Seafood curry, prawn curry", desc: "Garden courtyard, famous prawns", phone: "+27 44 877 1648", address: "4 Sarah Baartman Cres", lat: -33.986, lng: 22.58 },
  { id: 24, town: "wilderness", name: "The Blind Pig", food: "Burgers, pub, craft beer", desc: "Pub with live music", phone: "+27 78 860 4820", address: "Palms Garden Square", lat: -33.9865, lng: 22.5805 },
  { id: 25, town: "wilderness", name: "Serendipity", food: "Fine dining", desc: "Award winning fine dining by Touws River", phone: "+27 44 877 0433", address: "Touws River, Wilderness", lat: -33.99, lng: 22.575 },
  { id: 26, town: "wilderness", name: "Zucchini", food: "Organic, breakfast", desc: "Organic cafe at Timberlake Village", phone: "+27 44 004 0183", address: "Timberlake Village, N2", lat: -34, lng: 22.65 },
  { id: 27, town: "wilderness", name: "Oysters R Us", food: "Wild oysters", desc: "Rustic dune, all-you-can-eat wild oysters", phone: "+27 82 578 6817", address: "N2 8km towards Knysna", lat: -33.99, lng: 22.6 },
  { id: 28, town: "wilderness", name: "Figtree Bakehouse", food: "Sourdough, tapas", desc: "Sourdough sandwiches, Pause coffee", phone: "+27 44 004 0183", address: "Timberlake Village, N2", lat: -34.001, lng: 22.651 },
  { id: 29, town: "plettenberg bay", name: "Ristorante Enrico", food: "Italian, seafood, beach", desc: "Beachfront Italian in Keurboomstrand", phone: "+27 44 535 9818", address: "296 Main St, Keurboomstrand", lat: -34.05, lng: 23.36 },
  { id: 30, town: "plettenberg bay", name: "Nineteen 89", food: "Modern, steak, brunch", desc: "Main Street with Indian Ocean view", phone: "+27 81 306 2618", address: "Upperdeck Centre, Main St", lat: -34.052, lng: 23.371 },
  { id: 31, town: "plettenberg bay", name: "The Palms at Ivory House", food: "Contemporary, cocktails", desc: "Trendy coastal cocktail spot", phone: "+27 72 927 2304", address: "Ivory House, Plett", lat: -34.055, lng: 23.373 },
  { id: 32, town: "plettenberg bay", name: "Barrington's", food: "Smokehouse, brewery", desc: "First craft brewery in Plett, garden", phone: "+27 44 050 3767", address: "Piesang Valley Road", lat: -33.994, lng: 23.356 },
  { id: 33, town: "plettenberg bay", name: "Moby Dick's", food: "Seafood, family", desc: "Seafood institution in Plett", phone: "+27 44 533 3682", address: "Main Street, Plett", lat: -34.053, lng: 23.371 },
  { id: 34, town: "plettenberg bay", name: "Sotto Restaurant", food: "Breakfast, all-day", desc: "Beacon Isle convenience centre", phone: "+27 44 020 0464", address: "Shop B3 Beacon Isle Dr", lat: -34.058, lng: 23.375 },
  { id: 35, town: "plettenberg bay", name: "Ice Dream Land", food: "Italian, pizza, gelato", desc: "Italian family farm, makes mozzarella", phone: "+27 82 448 5795", address: "A15 Airport Road", lat: -33.995, lng: 23.33 },
  { id: 36, town: "plettenberg bay", name: "Dough & Co", food: "Bakery, coffee", desc: "Fresh baked at Plett Quarter", phone: "+27 72 792 8006", address: "The Plett Quarter, 5 Main Street", lat: -34.0535, lng: 23.372 },
  { id: 37, town: "george", name: "101 Meade Street Restaurant", food: "Contemporary, European", desc: "Simple, Seasonal & Social philosophy", phone: "+27 44 874 0343", address: "101 Meade Street, George", lat: -33.961, lng: 22.461 },
  { id: 38, town: "george", name: "The Pink Olive", food: "Cafe, brunch", desc: "Trendy cafe", phone: "+27 44 451 2360", address: "George Mall", lat: -33.963, lng: 22.463 },
  { id: 39, town: "george", name: "Tribes", food: "Pan-African", desc: "African spices, live music", phone: "+27 44 732 3633", address: "George", lat: -33.965, lng: 22.465 },
  { id: 40, town: "george", name: "Bianca's Ristorante", food: "Italian fine dining, seafood linguine", desc: "Best Italian in George", phone: "+27 44 231 3912", address: "George", lat: -33.962, lng: 22.464 },
  { id: 41, town: "george", name: "Portobello Italian Kitchen", food: "Italian, cheese balls", desc: "All-you-can-eat pasta Tuesdays", phone: "+27 44 630 0401", address: "104 Meade Street, George", lat: -33.9625, lng: 22.462 },
  { id: 42, town: "george", name: "Milk & Honey", food: "Breakfast, tramazinis", desc: "Light lunches, specialty coffees", phone: "+27 82 445 5447", address: "10 Memorium St, George", lat: -33.96, lng: 22.46 },
  { id: 43, town: "george", name: "Nina's Cafe", food: "Bakery, gin shop", desc: "Husband and wife cafe, 80 seater", phone: "+27 44 873 5414", address: "45 York Street, George", lat: -33.959, lng: 22.459 },
  { id: 44, town: "george", name: "De Vette Mossel Groot Brak", food: "Seafood, mussels", desc: "Weskus style at Souwesia Beach", phone: "+27 79 339 0170", address: "Souwesia Beach, Groot Brak", lat: -34.045, lng: 22.23 },
  { id: 45, town: "george", name: "Outeniqua Farmers Market", food: "Market, street food", desc: "150 stalls Saturdays", phone: "+27 82 465 2952", address: "N2 opposite Garden Route Mall", lat: -33.98, lng: 22.47 },
  { id: 46, town: "mossel bay", name: "Cafe Gannet", food: "Seafood House, international", desc: "At Protea Hotel, famous seafood", phone: "+27 44 691 3738", address: "Corner Church & Market Sts, Mossel Bay", lat: -34.181, lng: 22.131 },
  { id: 47, town: "mossel bay", name: "Bahia Bleu", food: "Cocktails, ocean views", desc: "Diaz Beach renovated", phone: "+27 44 692 8400", address: "1 Beach E Blvd, Die Voor Bay", lat: -34.185, lng: 22.13 },
  { id: 48, town: "mossel bay", name: "Delfinos Seaside Restaurant", food: "Beachfront, breakfast", desc: "Early to late with deck", phone: "+27 44 690 5247", address: "Point Rd, The Point, Mossel Bay", lat: -34.182, lng: 22.133 },
  { id: 49, town: "mossel bay", name: "Kaai 4 Braai Restaurant", food: "Braai, meat, open fire", desc: "Seaside wood beams venue", phone: "+27 44 691 0056", address: "Quay 4, Harbour, Mossel Bay", lat: -34.18, lng: 22.135 },
  { id: 50, town: "mossel bay", name: "Mossel Bay Oyster Bar", food: "Oysters, seafood, wagyu", desc: "Harbour oyster bar", phone: "+27 44 333 0202", address: "Quay 4, Mossel Bay Harbour", lat: -34.179, lng: 22.134 },
  { id: 51, town: "mossel bay", name: "Hennie's Mossel Bay", food: "Pub & Grill, steak", desc: "Pub with events", phone: "+27 84 632 0405", address: "Bay View Centre, Da Gama St", lat: -34.178, lng: 22.132 },
  { id: 52, town: "mossel bay", name: "Cape St Blaize Restaurant", food: "Coffee, deck", desc: "Coffee with view", phone: "+27 72 138 3911", address: "2 Montagu Street, Mossel Bay", lat: -34.18, lng: 22.1315 },
  { id: 53, town: "mossel bay", name: "Stars Restaurant", food: "Seafood, family", desc: "Bayview Centre", phone: "+27 44 690 3045", address: "Bayview Centre, Marsh St", lat: -34.1815, lng: 22.132 },
  { id: 54, town: "mossel bay", name: "Coffee @ Work", food: "Coffee, light meals", desc: "65 Marsh St", phone: "+27 71 692 1641", address: "65 Marsh St, Mossel Bay", lat: -34.182, lng: 22.131 },
  { id: 55, town: "mossel bay", name: "La Peron Visskerm", food: "Fish and chips", desc: "Old Station, Church St", phone: "+27 71 137 1893", address: "Old Station, Church St, Mossel Bay", lat: -34.18, lng: 22.13 },
  { id: 56, town: "mossel bay", name: "Fynbos Shoppe Coffee Shop", food: "Coffee, breakfast", desc: "31 Marsh St", phone: "+27 44 691 1366", address: "31 Marsh St, Mossel Bay", lat: -34.181, lng: 22.1335 },
  { id: 57, town: "mossel bay", name: "Salt & Copper", food: "Gourmet, breakfast", desc: "R102 Hartenbos, gourmet dishes", phone: "+27 44 150 0054", address: "R102, Hartenbos, Mossel Bay", lat: -34.12, lng: 22.11 },
  { id: 58, town: "mossel bay", name: "Spekbos Restaurant", food: "Burgers, ribs, game drive", desc: "Botlierskop dam view", phone: "+27 44 696 6055", address: "Botlierskop, Mossel Bay", lat: -34.21, lng: 22.08 },
  { id: 59, town: "mossel bay", name: "Oh Hey Cafe & Bakery", food: "Coffee, bakery", desc: "25 Marsh Street", phone: "+27 79 286 6080", address: "25 Marsh Street, Mossel Bay", lat: -34.1825, lng: 22.1325 },
  { id: 60, town: "mossel bay", name: "Carola Ann's Food For Life", food: "Breakfast, wholesome", desc: "Great ambience for groups", phone: "+27 64 154 6393", address: "12 Church St, Mossel Bay", lat: -34.18, lng: 22.13 }
];

const enriched = restaurants.map(r => ({ ...r, links: makeLinks(r.lat, r.lng) }));

app.get('/', (req,res) => res.json({ message: "places-to-eat-garden-route - 60 verified real phones", total: enriched.length, endpoints: ["/api/eat/:town", "/api/eat", "/llms.txt"] }));
app.get('/api/eat/:town', (req,res) => {
  const town = req.params.town.toLowerCase();
  const results = enriched.filter(r => r.town.toLowerCase().includes(town));
  res.json({ town, count: results.length, results });
});
app.get('/api/eat', (req,res) => res.json({ total: enriched.length, towns: [...new Set(enriched.map(r=>r.town))], results: enriched }));
app.get('/llms.txt', (req,res) => res.type('text/plain').send(`# places-to-eat-garden-route\n> 60 verified Garden Route restaurants with real phones + GPS\n\nEndpoints:\n- /api/eat/knysna\n- /api/eat/sedgefield\n- /api/eat/wilderness\n- /api/eat/plettenberg bay\n- /api/eat/george\n- /api/eat/mossel bay\n\nOpenAPI: /openapi.json`));
app.get('/openapi.json', (req,res) => res.json({ openapi: "3.0.0", info: { title: "places-to-eat-garden-route", version: "1.0.0" }, servers: [{ url: "https://tyronplaatjie.github.io/places-to-eat-garden-route" }], paths: { "/api/eat/{town}": { get: { summary: "Get by town", parameters: [{ name: "town", in: "path", required: true, schema: { type: "string" } }] } } } }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`60 verified places live on ${PORT}`));
module.exports = { restaurants };
