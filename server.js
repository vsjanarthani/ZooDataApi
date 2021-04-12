const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('client'));


// Get data by quering params
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


// get data by animals 
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//   Function to get data by ID

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

// Post request by animals

app.post('/api/animals', (req, res) => {
    console.log(`Line 84: ${req.body}`);
    req.body.id = animals.length.toString();

    if (!validataAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }

});

// Function to validate animal from post request
const validataAnimal = animal => {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
};

// Function to add new animal to the data
const createNewAnimal = (newanimal, animalsArray) => {
    animalsArray.push(newanimal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return newanimal;
}

// Sending index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
});

// Sending animals.html file
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './client/animals.html'));
});

// Sending zookeepers.html file
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './client/zookeepers.html'));
});

// Sending index.html for any route that wasn't previously defined. 
// The app.get request for wildcard "*" should always come last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/index.html'));
  });


  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}!`);
});