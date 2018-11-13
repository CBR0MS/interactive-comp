
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
    loadJSON('isms.json', loadIsms);

    function cleanContent(data) {
        // get html and make new html element 
        //console.log(data)
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

    function loadIsms(data){
        for (let i = 0; i < data.length; i++) {
            let splitSpace = data[i].cont.split(" ")
            let splitDash = data[i].cont.split("-")
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
            let first = singleIsms[ind1].cont
            let second = multipleIsms[ind2].cont
            let seconds = second.split(" ")
            if (seconds.length > 1){
                second = seconds[0]
                for (let i = 1; i < seconds.length; i++){
                    second = second + " " + seconds[i].charAt(0).toUpperCase() + seconds[i].substr(1).toLowerCase()
                }
            }
            
            builtFrom.push({'first': first, 
                            'firstUrl': singleIsms[ind1].url, 
                            'second': second, 
                            'secondUrl': multipleIsms[ind2].url})
            first = first.replace("ism", "ist")
            newPhilosophies.push(first + " " + second)
        }

        for (let i = 0; i < (n / 3); i++) {
            let ind1 = Math.floor(Math.random()*singleIsms.length)
            let ind2 = Math.floor(Math.random()*singleIsms.length)
            let first = singleIsms[ind1].cont
            let second = singleIsms[ind2].cont
            builtFrom.push({'first': first, 
                            'firstUrl': singleIsms[ind1].url, 
                            'second': second, 
                            'secondUrl': singleIsms[ind2].url})
            first = first.replace("ism", "ist")
            newPhilosophies.push(first + " " + second)
        }

        for (let i = 0; i < (n / 3); i++) {
            let ind1 = Math.floor(Math.random()*singleIsms.length)
            let ind3 = Math.floor(Math.random()*singleIsms.length)
            let ind2 = Math.floor(Math.random()*prefixes.length)
            let first = singleIsms[ind1].cont
            let pre = prefixes[ind2]
            let second = singleIsms[ind3].cont
            builtFrom.push({'first': first, 
                            'firstUrl': singleIsms[ind1].url, 
                            'second': second, 
                            'secondUrl': singleIsms[ind3].url})
            first = first.replace("ism", "ist")
            pre = pre.charAt(0).toUpperCase() + pre.substr(1).toLowerCase()
            newPhilosophies.push(pre + first + " " + second)
        }
        getWikiSummaries()
        console.log(newPhilosophies)
        //console.log(builtFrom)
    }

    function getWikiSummaries() {
        for (let i = 0; i < builtFrom.length; i++) {
            let res = loadJSON((contentUrl + builtFrom[i].firstUrl), (data) => {
                let cleaned = cleanContent(data)
                let res = loadJSON((contentUrl + builtFrom[i].secondUrl), (data) => {
                    let cleaned2 = cleanContent(data)
                    //console.log(cleaned + "\n" + cleaned2)
                    sourceTexts.push({'first': {'source': builtFrom[i].firstUrl, 'content': cleaned}, 
                                      'second': {'source': builtFrom[i].secondUrl, 'content': cleaned2},
                                      'name': newPhilosophies[i]} );
                }, 'jsonp')
            }, 'jsonp')
        }
    }
}



function setup(){

    //console.log(sourceTexts);

    for (let i = 0; i < sourceTexts.length; i++){
        let data1 = sourceTexts[i].first.content
        let data2 = sourceTexts[i].second.content

        let title1a = sourceTexts[i].first.source.split("_(")[0].toLowerCase()
        let title2a = sourceTexts[i].second.source.split("_(")[0].toLowerCase()
        let title1b = sourceTexts[i].first.source.split("_(")[0]
        let title2b = sourceTexts[i].second.source.split("_(")[0]
        title1a = title1a.replace("_", " ")
        title2a = title2a.replace("_", " ")
        title1b = title1b.replace("_", " ")
        title2b = title2b.replace("_", " ")

        let newTitle = sourceTexts[i].name

        let data1Split = data1.split(". ")[0]
        let data2Split = data2.split(". ")[0]
        let data2More = data2.split(". ")[1]
        let data1More = data1.split(". ")[1]

        //let first = data1Split.substr(0, data1Split.indexOf('is')); 
        let first = data1Split.substr(data1Split.indexOf(' is ')+1);
        let second = data2Split.substr(data2Split.indexOf(' is ')+4);

        first = first.replace(title1a, newTitle)
        first = first.replace(title1b, newTitle)

        data1More = data1More.replace(title1a, newTitle)
        data1More = data1More.replace(title1b, newTitle)

        second = second.replace(title2a, newTitle)
        second = second.replace(title2b, newTitle)

        data2More = data2More.replace(title2a, newTitle)
        data2More = data2More.replace(title2b, newTitle)

        let joined = " " + first + ". It is " + second + ". " + data2More + ". " + data1More + "."

        let el = document.createElement("div")
        el.innerHTML = newTitle + joined + "<br><br>"
        document.getElementById("div1").appendChild(el);
    }

    //makeMarkov(sourceTexts[0]);

     function makeMarkov(data){
        let rm = new RiMarkov(3);
        rm.loadText(data);
        let sentences = rm.generateSentences(12);
        let allSentences = "";

        for (let i = 0; i < sentences.length; i++){
            allSentences = allSentences + " " + sentences[i];
        }

        let element1 = document.createElement("div")
        element1.innerHTML = allSentences + "\n"
        document.getElementById("div1").appendChild(element1);
    }
}





