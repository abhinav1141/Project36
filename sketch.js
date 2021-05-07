//Create variables here
var dog, happyDog; 
var database;
var foodS, foodStock;
var readStock, feed;
var feedPet, addFood, addFoods, foodObj;
var fedTime, lastFed; 
var changeState, readState;
var bedroom, garden, washroom,currentTime;
function preload()
{
  //load images here
  dogImage = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
}

function setup() {
  
  database = firebase.database();
  
  createCanvas(500, 500);
  dog = createSprite(400, 250, 20, 20);
  dog.addImage(dogImage);
  dog.scale = .2;
  input=createInput("Pet Name");
 input.position(550,120);

 button=createButton("Confirm");
 button.position(550,145);
 button.mousePressed(createName);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  readState=database.ref('gameState');
  readState.on("value",function(data){
  gameState=data.val();
  });

    feed = createButton("Feed the dog");
  feed.position(625, 95);
  feed.mousePressed(feedPet);

  addFood = createButton("Add Food");
  addFood.position(725, 95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  currentTime=hour();

if(currentTime===lastFed+1){
  gameState="playing";
  updateGameState();
  foodObj.garden();
}
else if(currentTime===lastFed+2){
  gameState="sleeping";
  updateGameState();
  foodObj.bedroom();
}
else if(currentTime>lastFed+2&&currentTime<=lastFed+4){
  gameState="sleeping";
  updateGameState();
  foodObj.washroom();
}
else{
  gameState="hungry";
  updateGameState();
  foodObj.display();
}
  background(46, 139, 87);
  
    foodObj.display();
    fedTime=database.ref('FeedTime'); 
    fedTime.on("value",function(data){ lastFed=data.val(); });


    drawSprites();
    }


function readStock(data){
foodS = data.val();
console.log("Hi");
console.log(foodS);
foodObj.updateFoodStock(foodS);
}

function writeStock(x){

if(x<=0){
x=0;
}
else{
  x=x-1;
}


database.ref('/').update({
Food:x 
})

}

function addFoods(){
  console.log(foodS)
  foodS++;
  database.ref('/').update({
  Food:foodS
})
}

function feedPet(){
  dog.addImage(happyDog);

 foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
Food:foodObj.getFoodStock(),
  FeedTime:hour()
})

}
async function hour(){
  var site=await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
  var siteJson=await site.json();
  var dateTime=siteJson.dateTime;
var hourTime=dateTime.slice(11,13);
return hourTime;
}
function createName(){
  input.hide();
  button.hide();

  name=input.value();
  var greeting=createElement("h3");
  greeting.html("Pet's name "+name);
  greeting.position(width/2+350,height/2+200);
}
function updateGameState(){
  database.ref("/").update({
    gameState:gameState
  })
}



