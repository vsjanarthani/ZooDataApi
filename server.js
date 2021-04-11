const { query } = require('express');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const { animals } = require('./data/animals.json');

// Get data by query
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        const query = req.query;
        console.log(query);
        results = filterByQuery(query, results);
    }
        res.json(results);
});


// Function to filter data by query

const filterByQuery = (query, animalsArray) => {
    let filteredResults = animalsArray;
    let personalityTraitsArray = [];
    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // For each loop to get check for the matching trait as query
        personalityTraitsArray.forEach(trait => {
            trait = trait.replace(/\s+/g, "").toLowerCase();
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        query.diet = query.diet.replace(/\s+/g, "").toLowerCase();
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.id) {
        query.id = query.id.replace(/\s+/g, "").toLowerCase();
        filteredResults = filteredResults.filter(animal => animal.id === query.id);
    }
    if (query.species) {
        query.species = query.species.replace(/\s+/g, "").toLowerCase();
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        query.name = query.name.replace(/\s+/g, "").toLowerCase();
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}




app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}!`);
});