let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let contentUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=';

function preload() {
    let query = searchUrl + "Glossary_of_philosophy"
    loadJSON(query, handleData, 'jsonp')

    function handleData(data){
        let title = data[1][0];
        title = title.replace(/\s+/g, '_');
        let page = contentUrl + title
        let res = loadJSON(page, cleanContent, 'jsonp')
    }

    function cleanContent(data) {
        
        let element = document.createElement("div")
        element.innerHTML = data.parse.text["*"]
        let dfns = element.getElementsByTagName('dfn');
        let all = [];

        for (let i = 0; i< dfns.length; i++) {
            let aContent = dfns[i].getElementsByTagName('a');
            if (aContent[0] != undefined){
                let content = aContent[0].textContent
                let url = aContent[0].getAttribute("href")
                url = url.replace(/(\/wiki\/)/g, "")
                content = content.replace(/\[[0-9][0-9]?\]/g, "");
                all.push({'cont': content, 'url': url})
            }
            
        }
        console.log(all)
        saveJSON(all, 'isms.json');
    }
}

function setup() {
    console.log("done")
}