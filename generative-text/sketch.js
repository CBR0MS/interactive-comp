
let contentUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&redirects&page=';

let singleIsms = [], singleIsmsUrls = []
let multipleIsms = [], multipleIsmsUrls = []
let prefixes = []

let generations = 10;

let newPhilosophies = []
let builtFrom = []
let sourceTexts = []

function preload () {

    loadJSON('prefixes.json', loadPrefixes);
    loadJSON('ismsUrls.json', loadIsmsUrls);
    loadJSON('isms.json', loadIsms);

    function cleanContent(data) {
        // get html and make new html element 
        console.log(data)
        let element = document.createElement("div")
        element.innerHTML = data.parse.text["*"]
        // get all sup elements 
        let supTags = element.getElementsByTagName("sup")
        // remove sup elements 
        while (supTags[0]) supTags[0].parentNode.removeChild(supTags[0])
        // get all p elements 
        let contents = element.getElementsByClassName("mw-parser-output")[0].childNodes
        let text = "";
        for (let i = 0; i < contents.length; i++){
            if (contents[i].tagName == 'P') {
                let cont = contents[i].innerText
                if (!(/^\s*$/g.test(cont))){
                    text = text + " " + cont
                }
            } else if (contents[i].id == 'toc') {
                i = contents.length
            }
        }
        return text
    }

    function loadPrefixes(data) {
        for (let i = 0; i < data.length; i++){
            prefixes.push(data[i])
        }
    }

    function loadIsmsUrls(data){
        for (let i = 0; i < data.length; i++) {
            let splitSpace = data[i].split(" ")
            let splitDash = data[i].split("-")
            if (splitSpace.length == 1 && splitDash.length == 1) {
                singleIsmsUrls.push(data[i])
            } else {
                multipleIsmsUrls.push(data[i])
            }
        }
    }

    function loadIsms(data){
        for (let i = 0; i < data.length; i++) {
            let splitSpace = data[i].split(" ")
            let splitDash = data[i].split("-")
            if (splitSpace.length == 1 && splitDash.length == 1) {
                singleIsms.push(data[i])
            } else {
                multipleIsms.push(data[i])
            }
        }
        createNewPhilosophies(generations)
    }

    function createNewPhilosophies(n) {

        for (let i = 0; i < (n / 3); i++) {
            let ind1 = Math.floor(Math.random()*singleIsms.length)
            let ind2 = Math.floor(Math.random()*multipleIsms.length)
            let first = singleIsms[ind1]
            let second = multipleIsms[ind2]
            let seconds = second.split(" ")
            if (seconds.length > 1){
                second = seconds[0]
                for (let i = 1; i < seconds.length; i++){
                    second = second + " " + seconds[i].charAt(0).toUpperCase() + seconds[i].substr(1).toLowerCase()
                }
            }
            
            builtFrom.push({'first': first, 
                            'firstUrl': singleIsmsUrls[ind1], 
                            'second': second, 
                            'secondUrl': multipleIsmsUrls[ind2]})
            first = first.replace("ism", "ist")
            newPhilosophies.push(first + " " + second)
        }

        for (let i = 0; i < (n / 3); i++) {
            let ind1 = Math.floor(Math.random()*singleIsms.length)
            let ind2 = Math.floor(Math.random()*singleIsms.length)
            let first = singleIsms[ind1]
            let second = singleIsms[ind2]
            builtFrom.push({'first': first, 
                            'firstUrl': singleIsmsUrls[ind1], 
                            'second': second, 
                            'secondUrl': singleIsmsUrls[ind2]})
            first = first.replace("ism", "ist")
            newPhilosophies.push(first + " " + second)
        }

        for (let i = 0; i < (n / 3); i++) {
            let ind1 = Math.floor(Math.random()*singleIsms.length)
            let ind3 = Math.floor(Math.random()*singleIsms.length)
            let ind2 = Math.floor(Math.random()*prefixes.length)
            let first = singleIsms[ind1]
            let pre = prefixes[ind2]
            let second = singleIsms[ind3]
            builtFrom.push({'first': first, 
                            'firstUrl': singleIsmsUrls[ind1], 
                            'second': second, 
                            'secondUrl': singleIsmsUrls[ind3]})
            first = first.replace("ism", "ist")
            pre = pre.charAt(0).toUpperCase() + pre.substr(1).toLowerCase()
            newPhilosophies.push(pre + first + " " + second)
        }
        getWikiSummaries()
        console.log(newPhilosophies)
    }

    function getWikiSummaries() {
        for (let i = 0; i < builtFrom.length; i++) {
            let res = loadJSON((contentUrl + builtFrom[i].firstUrl), (data) => {
                let cleaned = cleanContent(data)
                let res = loadJSON((contentUrl + builtFrom[i].secondUrl), (data) => {
                    let cleaned2 = cleanContent(data)
                    sourceTexts.push(cleaned + " " + cleaned2);
                }, 'jsonp')
            }, 'jsonp')
        }
    }
}



function setup(){

    makeMarkov(sourceTexts[0]);

     function makeMarkov(data){
        let rm = new RiMarkov(3);
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





