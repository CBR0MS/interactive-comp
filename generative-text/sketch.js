let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let listSearchUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&qlimit=25&srsearch='
let contentUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=';

let cleanedData = "";

function preload () {

    let query = searchUrl + "noam chomsky"
    //let query = listSearchUrl + "aerospace%20engineers"
    loadJSON(query, handleData, 'jsonp')
    // query = searchUrl + "albert einstein";
    // loadJSON(query, handleData, 'jsonp');
    // query = searchUrl + "karl popper";
    // loadJSON(query, handleData, 'jsonp');

    function handleData(data){
        console.log(data);
        let title = data[1][0];
        title = title.replace(/\s+/g, '_');
        console.log(title)
        let page = contentUrl + title
        let res = loadJSON(page, cleanContent, 'jsonp')
        return res;
    }

    function cleanContent(data) {
        console.log(data)
        // get html and make new html element 
        let element = document.createElement("div")
        element.innerHTML = data.parse.text["*"]
        

        // get all sup elements 
        let supTags = element.getElementsByTagName("sup")

        // remove sup elements 
        while (supTags[0]) supTags[0].parentNode.removeChild(supTags[0])

        // get all p elements 
        let paragraphs = element.getElementsByTagName("p")
        let collectedData = [];

        // get the text content of the p elements 
        for (let i = 0; i < paragraphs.length; i++) {
            collectedData.push(paragraphs[i].textContent)
        }

        let allData = "";
        // create one string with the text content 
        for (let i = 0; i < collectedData.length; i++) {
            allData = allData + collectedData[i];
        }

        // create a new html node that contains just the clean text
        // let element1 = document.createElement("div")
        // element1.innerHTML = allData
        // document.getElementById("div1").appendChild(element1);
        cleanedData = cleanedData + allData;
    }
}

function setup(){

    makeMarkov(cleanedData);

     function makeMarkov(data){
        let rm = new RiMarkov(4);
        rm.loadText(data);
        let sentences = rm.generateSentences(12);
        let allSentences = "";

        for (let i = 0; i < sentences.length; i++){
            allSentences = allSentences + " " + sentences[i];
        }

        let element1 = document.createElement("div")
        element1.innerHTML = allSentences
        document.getElementById("div1").appendChild(element1);
    }
}





