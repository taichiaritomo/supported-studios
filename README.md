# Supported Studios

The primary data source for this project is the [Supported Studios List on Google Maps](https://www.google.com/maps/@48.1899742,-5.0788186,3z/data=!3m1!4b1!4m3!11m2!2sYeuExMXUQNS2O309PS1KYA!3e3?entry=ttu)

## Data Preparation

Unfortunately, there is not yet an effective way to scrape the places directly from a list of places on Google Maps. [People have tried](https://stackoverflow.com/questions/50964713/obtain-list-of-my-places-from-google-maps), but I couldn't get it to work with this list.

This project uses a cleaner approach. Although it takes a little more manual effort in the beginning, the data we get at the end is neater. First, we need to get the Place IDs of each place, and then use that to get more information from the Google Maps Places API.

### Setup:
1. Obtain a [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key).
2. Create the file `/prep/.env`. This file will contain your *environment variables* for running the script. Environment variables keep credentials like the API Key out of the Github repository, so others don't find it.
3. Paste `MAPS_API_KEY="<your-api-key>"` into `/prep/.env`, where `<your-api-key>` is replaced with the actual API Key. You can refer to `/prep/.env.example` as a template for `.env`.

### Adding a place to our dataset:
1. [Search for the Place ID](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Add the Place ID to a new line in `/prep/data/input/place_IDs.txt`
3. In the terminal, navigate to the `/prep` directory by running `cd prep`.
4. Run the data prep script in the terminal: `npm run start`. This will generate the file `/prep/data/output/placeDetails.json` and `/prototype/data/placeDetails.js`
5. The prototype will load the placeDetails from placeDetails.json!

## Prototype
