require ('./style.css');

let CurDisplayed = 0;
const blockNews = 5;
const maxDisplayed = 40;

const NewsList = document.getElementById("news-list");
const SourcesList = document.getElementById("sources-list");

document.getElementById("load-more-btn").onclick = LoadMore;

const apiKey = "89f3e06559f34cdfbfbf3d3c2f6f2ff0";
const header = "https://newsapi.org/v2/";
let CurRequest = header + `top-headlines?country=us&apiKey=${apiKey}`;

DisplaySources(header + `sources?apiKey=${apiKey}`);
DisplayBlockNews(CurRequest);

document.getElementById("sources-list").addEventListener("click", (e) =>{
    RemoveNews();
    CurRequest = header + `top-headlines?sources=${e.target.id}&apiKey=${apiKey}`;
    DisplayBlockNews(CurRequest);
});

document.getElementById("filter-btn").addEventListener("click", (e) =>{
    RemoveNews();
    const keywords = document.getElementById("filter-input").value;

    if (keywords.trim() != ""){
        CurRequest = header + `top-headlines?q=${keywords}&sortBy=popularity&apiKey=${apiKey}`;
    }else{
        CurRequest = header + `top-headlines?country=us&apiKey=${apiKey}`;
    }
    DisplayBlockNews(CurRequest);
});

document.getElementById("filter-input").addEventListener("keyup", function(e) {
    if (e.keyCode == 13) document.getElementById("filter-btn").click();
});

function RemoveNews(){
    let news = document.getElementsByClassName("news");

    while(news.length - 1) 
        news[1].parentNode.removeChild(news[1]);

    CurDisplayed = 0;
}

async function DisplaySources(url){
    const response = await fetch(url);
    let CurSources = await response.json();

    CurSources.sources.forEach(function(source){
        let node = document.getElementById("source-btn").cloneNode(true);

        node.textContent = source.name;
        node.id = source.id;
        
        SourcesList.appendChild(node);
    });
}

async function DisplayBlockNews(url){
    if (CurDisplayed < maxDisplayed){
        const response = await fetch(url);
        let CurNews = await response.json();
        
        if (CurNews.totalResults){
            for (i = 0; i < blockNews; i++){
                LoadArticle(CurNews.articles[CurDisplayed++]);
                if (CurNews.articles.length == CurDisplayed){
                    document.querySelector(".load-more-btn").style.display = 'none';
                    return;
                }else{
                    document.querySelector(".load-more-btn").style.display = 'unset';
                }
            }
        }else{
            
            let node = document.getElementById("news").cloneNode(true);
            
            node.querySelector(".news-headline").textContent = "Not found :(";
            
            NewsList.appendChild(node);
            
            document.querySelector(".load-more-btn").style.display = 'none';
        }
    }
}

function LoadArticle(data){
    let node = document.getElementById("news").cloneNode(true);
    
    node.querySelector(".news-picture").style.backgroundImage = `url("${data.urlToImage}")`;
    node.querySelector(".news-link").setAttribute("href", data.url);
    node.querySelector(".news-headline").textContent = data.title;
    node.querySelector(".news-source").textContent = data.source.name;
    node.querySelector(".news-description").textContent = data.description;
    
    NewsList.appendChild(node);
}

function LoadMore(){
    DisplayBlockNews(CurRequest);
}