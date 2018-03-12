let config = require('./config.js');
const shell = require('electron').shell;

// installing jquery, bootstrap, and popper (for dropdown menu)
global.jQuery = require('jquery');
require('popper.js');
require('bootstrap');

// call the news api w/ proper parameters, set the data on the screen
function getNews(playerName, source) {
    var url = 'https://newsapi.org/v2/everything?' +
            'q=' + playerName + "&" +
            'from=2017-01-09&' +
            'to=2018-03-04&' +
            'sortBy=popularity&' +
            'sources='+ source + "&" + 
            'apiKey='+ config.secrets.MY_KEY;

    var req = new Request(url);
    fetch(req).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        articles = res.data["articles"];
        /* Keys:
           author
           description
           publishedAt
           title
           url
           urlToImage
         */
        
        // create the main div
        let main = document.createElement("div");
        main.setAttribute("class", "container-fluid");
        main.setAttribute("id", "main");
        
        let player = document.createElement("div");
        player.setAttribute("class", "col-2 border border-primary");
        player.innerHTML = playerName;
        
        articles.forEach((a) => {
            let newRow = document.createElement("div");
            newRow.setAttribute("class", "row");

            // let player = document.createElement("div");
            // player.setAttribute("class", "col-2 border border-primary");
            // player.innerHTML = playerName;

            let articleDiv = document.createElement("div");
            articleDiv.setAttribute("class", "col-10 border border-primary");

            let article = document.createElement("a");
            let articleTitle = document.createTextNode(a["title"]);

            article.href = a["url"];
            article.appendChild(articleTitle);
            articleDiv.appendChild(article);
            
            newRow.appendChild(articleDiv);
            main.appendChild(newRow);
        });
        document.body.appendChild(main);
    }));
}

// on clicking submit button, call news API 
// clear the window if existing articles
document.getElementById("submit-button").addEventListener("click", function(){
    if(document.getElementById("main") !== null){
        document.body.removeChild(document.getElementById("main"));
    }
    let playerText = document.getElementById("player-name-form").value.replace(/ /g,"%20");;
    let source = getUserSourceChoice();
    getNews(playerText, source);
});

// open links in browser instead of app
// from: https://github.com/electron/electron/issues/1344#issuecomment-339585884
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault()
    shell.openExternal(event.target.href)
  }
});

function getUserSourceChoice() {
   let choice = document.getElementById("dropdownMenuButton").textContent;

   if(choice === "NFL.com ") {
       return "nfl-news";
   }
   else if(choice === "ABC via ESPN ") {
       return "espn";
   }
   else if(choice === "Fox Sports ") {
       return "fox-sports";
   }
   else {
        return "bleacher-report";
   }
}

// Changes the dropdown menu text to whatever the user clicks
jQuery(".dropdown-menu a").click(function(){
  jQuery(this).parents(".dropdown").find('.btn').html(jQuery(this).text() + ' <span class="caret"></span>');
  jQuery(this).parents(".dropdown").find('.btn').val(jQuery(this).data('value'));
});