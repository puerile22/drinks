var pg = require('pg');
var conString = 'postgres://vagrant:vagrant@localhost:5432/tester';
var client = new pg.Client(conString);
client.connect(function(err){
  if(err){
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() as "theTime"', function(err, result){
    if(err){
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    client.end();
  });
});

var createTables = function() {
  client.query('CREATE TABLE IF NOT EXISTS Cocktail(id SERIAL PRIMARY KEY,name text,category text,glass text,ingredient text,instructions text)');
  client.query('CREATE TABLE IF NOT EXISTS Alcohol(id SERIAL PRIMARY KEY,name text)');
  client.query('CREATE TABLE IF NOT EXISTS Alcohol_Cocktail(id SERIAL PRIMARY KEY,alcohol_id integer REFERENCES Alcohol(id),cocktail_id integer REFERENCES Cocktail(id))');
};

var dropTables = function() {
  client.query('DROP TABLE IF EXISTS Alcohol_Cocktail');
  client.query('DROP TABLE IF EXISTS Alcohol');
  client.query('DROP TABLE IF EXISTS Cocktail');
};

dropTables();
createTables();

var addCocktail = function() {
  var str = "INSERT INTO Cocktail(name,category,glass,ingredient,instructions) VALUES ('"+recipe[1]+"','"+recipe[2]+"','"+recipe[4]+"','"+recipe[5]+"','"+recipe[6]+"');";
  client.query(str,function(err,data){
  });
};


var fs = require('fs');
fs.readFile('../csv/recipe.csv','utf8',function(err,data){
  if (err) {
    console.error(err.message);
  }
  var recipee=[];
  var alcohols=[];
  var recipes = data.replace(/"/g,'').replace(/'/g,"''").split('\n');
  for (var i=1;i<recipes.length;i++) {
    var recipe = recipes[i].split(",");
    recipee.push("INSERT INTO Cocktail(name,category,glass,ingredient,instructions) VALUES ('"+recipe[1]+"','"+recipe[2]+"','"+recipe[4]+"','"+recipe[5]+"','"+recipe.slice(6,recipe.length-1).join(",")+"');");
    var alcohol = recipe[recipe.length-1].split("|");
    for (var j=0;j<alcohol.length;j++) {
      alcohols.push("INSERT INTO Alcohol(name) VALUES('"+alcohol[j]+"');");
    }
  }
  recipee = recipee.join(' ');
  alcohols = alcohols.join(' ');
  //console.log(recipee);
  console.log(alcohols);
  client.query(recipee,function(err,data){
    client.end();
  });
  client.query(alcohols,function(err,data){
    client.end();
  });
    //addAlcohol(recipe[7].split("|"),id);

});

