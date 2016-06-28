var parser = require("./semantics_grammar.js");
var fs = require("fs");
var _ = require('lodash');

var file = process.argv[2];
var fileContents = fs.readFileSync(file, 'utf-8');

var parsedContents = parser.parse(fileContents);

var possibleVerbSet = _.flowRight(_.uniq, _.values, _.mapValues)(parsedContents, "verb");
var names = _.flowRight(_.uniq, _.values, _.mapValues)(parsedContents, "name");
var people = new Map();

var partitionsOnName = names.map(function (name) {
    return _.head(_.partition(parsedContents, {'name': name}));
});

partitionsOnName.map(function (current) {
    var allChoices = possibleVerbSet.map(function (verb) {
        var partitionOnVerb = _.head(_.partition(current, {'verb': verb}));
        var choiceOnVerb = _.flowRight(_.values, _.mapValues)(partitionOnVerb, "object");
        var choice = {};
        choice[verb] = choiceOnVerb;
        return choice;
    });
    var choices = allChoices.reduce(function (prev, curr) {
        return _.assign(prev, curr)
    });
    people.set(current[0]["name"], choices);
});

var formatChoices = function(choices) {
    if(choices.length <= 2) return choices.join(" and ");
    return _.head(choices) + ', '+ formatChoices(_.tail(choices));
};

people.forEach(function (value, key) {
    return Object.keys(value).forEach(function (choice) {
        console.log(`${key} ${choice} ${formatChoices(value[choice])}`);
    });
});

