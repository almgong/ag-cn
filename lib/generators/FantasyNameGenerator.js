/*
 * Fantasy Name Generator
 *
 * Copyright (c) 2014-2015 Victor Nogueira
 * https://github.com/felladrin/fantasy-name-generator
 *
 * Licensed under the MIT License
 * http://opensource.org/licenses/MIT
 */

/**
 * Generates a fantasy name by joining random letters. Modified slightly by AG 2/17/2017.
 *
 * @param nameLength - length of name desired
 * @param prefix - a prefix that comes before the name, if desired (e.g. Northen Lord). 
 *                  If none provided, one will be generated
 */
var generateName = function(nameLength, prefix)
{
    var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    var consonant = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

    var vowel = ['a', 'e', 'i', 'o', 'u'];

    var name = [];

    // Number of letters of the name to be generated.
    var numLetters = nameLength;

    var selected;

    for (var i = 0; i < numLetters; i++)
    {
        selected = Math.floor(Math.random() * 26);

        if (name.length > 2)
        {
            var lastLetter = name.length - 1;
            var penultLetter = name.length - 2;

            // If the last two letters are equal, the next one should be different.
            while (name[lastLetter] == selected && name[penultLetter] == selected)
                selected = Math.floor(Math.random() * 26);

            // If the last two letters are consonants, the next one must be a vowel.
            if (consonant.indexOf(name[lastLetter]) != -1 && consonant.indexOf(name[penultLetter]) != -1)
            {
                selected = Math.floor(Math.random() * 5);
                name[i] = vowel[selected];
                continue;
            }
        }
        else
        {
            // If the first letter is a vowel, the second must be a consonant, and vice versa.
            if (vowel.indexOf(name[0]) != -1)
            {
                selected = Math.floor(Math.random() * 21);
                name[i] = consonant[selected];
                continue;
            }
            else if (consonant.indexOf(name[0]) != -1)
            {
                selected = Math.floor(Math.random() * 5);
                name[i] = vowel[selected];
                continue;
            }
        }

        name[i] = letter[selected];
    }

    // Name must not finish with two consonants.
    if (consonant.indexOf(name[name.length - 1]) != -1 && consonant.indexOf(name[name.length - 2]) != -1)
    {
        selected = Math.floor(Math.random() * 5);
        name[name.length - 1] = vowel[selected];
    }

    // Converts the array into a string.
    name = name.join('');

    // Capitalizes the first letter .
    name = name.substr(0, 1).toUpperCase() + name.substr(1);

    if (!prefix) {
        prefix = generatePrefix()
    }

    return prefix + " " + name;
};

// returns a prefix that goes before a name, e.g. Northen Lord
var generatePrefix = function() {
    var locationAdjectives = ["Northern", "Eastern", "Southern", "Western", 
    "Divine", "Demonic", "Forgotten", "High", "Subordinate", "Cowardly",
    "Brave", "Nobel Prize Winning", "Rich", "Poor"];
    var titles = ["Lord", "King", "Queen", "Elder", "Priest", "Ghoul", "Emperor",
    "Rascal", "Adventurer", "Knight", "Dwarf", "Elf", "Zombie", "Innkeeper", 
    "Enchantress", "World Boss", "Regional Boss", "Princess", "Prince", "Enrique Clone",
    "Unwary Traveler", "Wild Boar", "Gheyboi Clone"];
    
    return locationAdjectives[Math.floor(Math.random()*locationAdjectives.length)] + " " +
    titles[Math.floor(Math.random()*titles.length)]
};


// name length is optional!
exports.generateCompleteFantasyName = function(nameLength) {
    return generateName((nameLength || Math.ceil(Math.random()*7) + 1));
};