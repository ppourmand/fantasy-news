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
        //for(let i = 0; i < articles.length; i++){
        //    console.log(articles[i]);
        //}
        let main = document.getElementById("main");

        articles.forEach((a) => {
            let new_row = document.createElement("div");
            new_row.setAttribute("class", "row");

            let player = document.createElement("div");
            player.setAttribute("class", "col-2 border border-primary");
            player.innerHTML = "Tom Brady";

            let article = document.createElement("div");
            article.setAttribute("class", "col-10 border border-primary");
            article.innerHTML = a["title"];
            
            new_row.appendChild(player);
            new_row.appendChild(article)

            main.appendChild(new_row)
            console.log(a["description"])
            console.log(a["author"]);
            console.log(a["url"]);
            console.log(a["title"]);
        });
    }));

    
}

getNews("Tom Brady");
