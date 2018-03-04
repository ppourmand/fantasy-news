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
        for(let i = 0; i < articles.length; i++){
            console.log(articles[i]["description"]);
        }
    }));

    let lol = document.getElementById("testing");
    lol.innerHTML = "lolcakes!";
}

getNews("Tom Brady");
