
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
        // let supTags = element.getElementsByTagName("sup")
        // // remove sup elements 
        // while (supTags[0]) supTags[0].parentNode.removeChild(supTags[0])
        // get all p elements 
        let contents = element.getElementsByClassName("mw-parser-output")[0].childNodes
        let text = "";
        for (let i = 0; i < contents.length; i++){
            if (contents[i].tagName == 'P') {
                let cont = contents[i].innerText
                if (!(/^\s*$/g.test(cont))){
                    cont = cont.replace("\n", " ")
                    cont = cont.replace(/\.(\[[\w\s\d]*\])+(\w)*/g, ".")
                    cont = cont.replace(/(\[[\w\s\d]*\])+/g, "")
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
                console.log(builtFrom[i])
                let cleaned = cleanContent(data)
                let res = loadJSON((contentUrl + builtFrom[i].secondUrl), (data) => {
                    console.log(builtFrom[i])
                    let cleaned2 = cleanContent(data)
                    //console.log(cleaned + "\n" + cleaned2)
                    sourceTexts.push({'first': {'source': builtFrom[i].firstUrl, 'content': cleaned, 'name':builtFrom[i].first}, 
                                      'second': {'source': builtFrom[i].secondUrl, 'content': cleaned2, 'name':builtFrom[i].second},
                                      'name': newPhilosophies[i]} );
                }, 'jsonp')
            }, 'jsonp')
        }
    }
}



function setup(){

    //console.log(sourceTexts);
    let jsonToSave = []

    for (let i = 0; i < sourceTexts.length; i++){
        let data1 = sourceTexts[i].first.content
        let data2 = sourceTexts[i].second.content

        let acctual1 = sourceTexts[i].first.name 
        let accutal2 = sourceTexts[i].second.name 

        let firstWord1 = ""
        let firstWord2 = ""

        if (acctual1.split(" ").length > 1) {
            let splitted = data1.split(" ")
            firstWord1 = splitted[0] + splitted[1]
        } else {
            firstWord1 = data1.split(" ")[0]
        }
        // get the first word or two words in the article 
        if (accutal2.split(" ").length > 1) {
            let splitted = data2.split(" ")
            firstWord2 = splitted[0] + splitted[1]
        } else {
            firstWord2 = data2.split(" ")[0]
        }

        
        let title1a = sourceTexts[i].first.source.split("_(")[0].toLowerCase()
        let title2a = sourceTexts[i].second.source.split("_(")[0].toLowerCase()
        let title1b = sourceTexts[i].first.source.split("_(")[0]
        let title2b = sourceTexts[i].second.source.split("_(")[0]
        title1a = title1a.replace("_", " ")
        title2a = title2a.replace("_", " ")
        title1b = title1b.replace("_", " ")
        title2b = title2b.replace("_", " ")

        // compare first words to acctual title (as opposed to page title)
        if (acctual1 == firstWord1) {
            title1a = acctual1.toLowerCase()
            title1b = acctual1
        }

        if (accutal2 == firstWord2) {
            title2a = accutal2.toLowerCase()
            title2b = accutal2
        }

        let newTitle = sourceTexts[i].name

        let data1Split = data1.split(". ")[0]
        let data2Split = data2.split(". ")[0]
        let data2More = data2.split(". ")[1]
        if (data2More == undefined) {data2More = ""}
        let data1More = data1.split(". ")[1]
        if (data1More == undefined) {data1More = ""}

        let first = ""
        if (data1Split.indexOf(' is ') != -1){
            first = data1Split.substr(data1Split.indexOf(' is ')+1);
        } else if (data1Split.indexOf(' was ') != -1) {
            first = data1Split.substr(data1Split.indexOf(' was ')+1);
        }
        let second = ""
        if (data2Split.indexOf(' is ') != -1){
            second = data2Split.substr(data2Split.indexOf(' is ')+4);
        } else if (data2Split.indexOf(' was ') != -1) {
            second = data2Split.substr(data2Split.indexOf(' was ')+5);
        }

        // console.log("Looking for... ")
        // console.log(title1b + ", " + title1a + ", " +  title1b.replace('ism', 'ists') + ", " + title1a.replace('ism', 'ists'))
        // console.log(title2b + ", " + title2a + ", " +  title2b.replace('ism', 'ists') + ", " +  title2a.replace('ism', 'ists'))

        first = first.replace(title1b, newTitle) // upper case 
        first = first.replace(title1a, newTitle) // lower case 
        first = first.replace(title1b.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // upper case -ists
        first = first.replace(title1a.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // lower case -ists

        data1More = data1More.replace(title1b, newTitle) // upper case 
        data1More = data1More.replace(title1a, newTitle) // lower case 
        data1More = data1More.replace(title1b.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // upper case -ists
        data1More = data1More.replace(title1a.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // lower case -ists

        second = second.replace(title2b, newTitle) // upper case 
        second = second.replace(title2a, newTitle) // lower case 
        second = second.replace(title2b.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // upper case -ists
        second = second.replace(title2a.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // lower case -ists

        data2More = data2More.replace(title2b, newTitle) // upper case 
        data2More = data2More.replace(title2a, newTitle) // lower case 
        data2More = data2More.replace(title2b.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // upper case -ists
        data2More = data2More.replace(title2a.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // lower case -ists

        let joined = "";
        if (first != ""){
            joined = " " + first + ". It is " + second + ". " + data2More + ". " + data1More + ". "
        } else{
            joined = " is " + second + ". " + data2More + ". " + data1More + ". "
        }
        let ind = 2
        let firstUsed = true
        let split1 = data1.split(". ")
        let split2 = data2.split(". ")
        while (joined.length < 750 && ind < split1.length && ind < split2.length) {
            if (split1[ind] != undefined && split1[ind] != "" && firstUsed) {
                let data = split1[ind]
                data = data.replace(title1b, newTitle) // upper case 
                data = data.replace(title1a, newTitle) // lower case 
                data = data.replace(title1b.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // upper case -ists
                data = data.replace(title1a.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // lower case -ists
                joined = joined + data + ". "
                firstUsed = false
            } else if (split2[ind] != undefined && split2[ind] != "" && !firstUsed) {
                let data = split2[ind]
                data = data.replace(title2b, newTitle) // upper case 
                data = data.replace(title2a, newTitle) // lower case 
                data = data.replace(title2b.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // upper case -ists
                data = data.replace(title2a.replace('ism', 'ists'), newTitle.replace('ism', 'ists')) // lower case -ists
                joined = joined + data + ". "
                firstUsed = true
            }
            ind += 1
        }
        joined = newTitle + joined
        joined = joined.replace(/\u2013|\u2014/g, "-");
        joined = joined.replace(/[^\x00-\x7F]/g, "");

        //console.log(joined.length)
        jsonToSave.push({'title': newTitle, 'text': joined})

        let el = document.createElement("div")
        el.innerHTML = joined + "<br><br>"
        document.getElementById("div1").appendChild(el);
    }
    //saveJSON(jsonToSave, 'newPhilosophies.json')
    
}





