let config = require('./config.js');
const shell = require('electron').shell;

// installing jquery, bootstrap, and popper (for dropdown menu)
global.jQuery = require('jquery');
require('popper.js');
require('bootstrap');

// global array of news articles
let articles = [];

// call the news api w/ proper parameters, set the data on the screen
function getNews(playerName, source) {
    // get todays date
    let currentDate = new Date(Date()).toISOString().substring(0,10);
    console.log(currentDate);
    var url = 'https://newsapi.org/v2/everything?' +
            'q="' + playerName + '"&' +
            //'from=2017-01-09&' +
            //'to='+ currentDate + "&" +
            'sortBy=relevancy&' +
            'sources='+ source + "&" + 
            'apiKey='+ config.secrets.MY_KEY;

    var req = new Request(url);
    fetch(req).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        let news = res.data["articles"];
        /* Keys:
           author
           description
           publishedAt
           title
           url
           urlToImage
         */
        
        news.forEach((a) => {
            let lol = new NewsArticle(a["title"], a["publishedAt"], "", a["source"]["name"], a["url"]);
            articles.push(lol);
            console.log(articles)
        });
        displayDataToScreen();
    }));
}

function displayDataToScreen() {
    
    articles.forEach((a) => {
        let main = document.getElementById("main");

        let newRow = document.createElement("div");
        newRow.setAttribute("class", "row mt-2 mb-2 pt-4 pb-4");
        newRow.setAttribute("id", "article-row");

        let dateDiv = document.createElement("div");
        let sourceDiv = document.createElement("div");
        let flairDiv = document.createElement("div");
        let titleDiv = document.createElement("div")
        
        dateDiv.setAttribute("class", "col-2 ml-auto");
        sourceDiv.setAttribute("class", "col-2 ml-auto");
        flairDiv.setAttribute("class", "col-2 ml-auto");
        titleDiv.setAttribute("class", "col-6 ml-auto");

        let dateText = document.createTextNode(a.date.substring(0,10));
        let sourceText = document.createTextNode(a.source);
        let flairText = document.createTextNode(a.flair);
        let titleText = document.createTextNode(a.title);
        let titleLink = document.createElement("a")
        titleLink.href = a.url;
        titleLink.appendChild(titleText);

        dateDiv.appendChild(dateText);  
        sourceDiv.appendChild(sourceText);
        flairDiv.appendChild(flairText);
        titleDiv.appendChild(titleLink);

        newRow.appendChild(dateDiv);
        newRow.appendChild(sourceDiv);
        newRow.appendChild(flairDiv);
        newRow.appendChild(titleDiv);

        main.appendChild(newRow);
    });
    
}

// on clicking submit button, call news API 
// clear the window if existing articles
document.getElementById("submit-button").addEventListener("click", function(){
    if(document.getElementById("main") !== null){
        console.log("clearing main div");
        document.getElementById("main-container").removeChild(document.getElementById("main"));
        let main = document.createElement("div");
        main.setAttribute("id", "main");
        document.getElementById("main-container").appendChild(main);

        // remember to clear the articles array
        articles = [];
    }
    let playerText = document.getElementById("player-name-form").value;
    getNews(playerText.split(' ').join('%20'), "bleacher-report");
    getNewsFromReddit(playerText);
});

// open links in browser instead of app
// from: https://github.com/electron/electron/issues/1344#issuecomment-339585884
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault()
    shell.openExternal(event.target.href)
  }
});


// using reddit api, grab json of hot posts on r/nfl and grab the posts tagged as rumor
function getNewsFromReddit(playerName) {
    console.log(playerName);
    playerName = playerName.toLowerCase()
    //console.log("reddit output:");

    jQuery.getJSON("https://www.reddit.com/r/nfl/.json?sort=hot", function(res){
        let posts = res["data"]["children"]
        bgColor = 0;
        
        //console.log(posts)
        // useful keys
        // title
        // permalink
        // url
        // link_flair_text 
        // if the title has the players named that we searched in it, display it on screen
        posts.forEach((p) => {
            let flair = p["data"]["link_flair_text"];
            let title = p["data"]["title"].toLowerCase();
            let permalink = "https://reddit.com" + p["data"]["permalink"];
            let redditUrl = p["data"]["url"];

            if(flair === "Rumor" || flair === "Roster Move" || title.includes(playerName)) {
                if(title.includes(playerName)){
                    let a = new NewsArticle(title, "2018-03-13", flair, "Reddit", permalink);
                    articles.push(a); 
                }
            }
        });
        displayDataToScreen();
    });

}


class NewsArticle {
    constructor(title, publishedDate, flair, source, url){
        this.title = title;
        this.date = publishedDate;
        this.flair = flair;
        this.source = source;
        this.url = url;
    }
}