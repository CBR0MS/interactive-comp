let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

function setup () {
    let query = searchUrl + "iceland"
    let res = loadJSON(query, handleData, 'jsonp')

    function handleData(data){
        //console.log(data);
        let title = data[1][1];
        title = title.replace(/\s+/g, '_');
        console.log(title)
    }
}