let config = require('./config.js')

function getNews(playerName) {
    var url = 'https://newsapi.org/v2/everything?' +
            'q=' + playerName + "&" +
            'from=2017-01-09&' +
            'to=2018-03-04&' +
            'sortBy=popularity&' +
            'sources=espn&' + 
            'apiKey='+ config.secrets.MY_KEY;

    var req = new Request(url);
    fetch(req).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(res => {
        articles = res.data["articles"];

        // iterate through the articles
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

        articles.forEach((a) => {
            let newRow = document.createElement("div");
            newRow.setAttribute("class", "row");

            let player = document.createElement("div");
            player.setAttribute("class", "col-2 border border-primary");
            player.innerHTML = playerName;

            let article = document.createElement("div");
            article.setAttribute("class", "col-10 border border-primary");
            article.innerHTML = a["title"];
            
            newRow.appendChild(player);
            newRow.appendChild(article);

            main.appendChild(newRow);
            // console.log(a["description"]);
            // console.log(a["author"]);
            // console.log(a["url"]);
            // console.log(a["title"]);
        });

        document.body.appendChild(main);
    }));

    
}

document.getElementById("submit-button").addEventListener("click", function(){
    if(document.getElementById("main") !== null){
        document.body.removeChild(document.getElementById("main"));
    }
    let playerText = document.getElementById("player-name-form").value;
    getNews(playerText);
    
});
