window.onload = () => {

    let height = window.innerHeight;
    let width = window.innerWidth;

    if (colored-1 >= 0) {
        // highlight the whisper added by the user 
        encoded[colored-1].creep = luni.tools.creepify.decode(encoded[colored-1].creep)
        let el =  document.getElementById(encoded[colored-1].id);
        el.style.color = "#e8c904";
    } 
/*
    for (let i = 0; i < encoded.length; i++){

        for (let j = 0; j < 6; j++){

            let text = luni.tools.creepify.decode(encoded[j].creep);
            let ind = Math.floor(Math.random() * text.length);
            let mutated = luni.tools.flip.encode(text.charAt(ind));
            encoded[j].creep = text.substr(0, ind) + mutated + text.substr(ind + 1);
        }
        for (let k = 0; k < 4; k++){

            let text = luni.tools.creepify.decode(encoded[k].creep);
            let ind = Math.floor(Math.random() * text.length);
            let mutated = luni.tools.roundsquares.encode(text.charAt(ind));
            encoded[k].creep = text.substr(0, ind) + mutated + text.substr(ind + 1);
        }
        encoded[i].creep = luni.tools.creepify.encode(encoded[i].creep);
    } */

    function changeWhisperEncoding(){
        // reset the weird ASCII stuff on the letters 
        for (let i = 0; i < encoded.length; i++) {

            let creep = encoded[i].creep;
            let text = luni.tools.creepify.decode(creep);
            text = luni.tools.creepify.encode(text);
            encoded[i].creep = text;

            let el =  document.getElementById(encoded[i].id);
            el.innerHTML = encoded[i].creep;
        }
    }

    // overall time taken to make one iteration of all the whispers 
    let timePerLoop = encoded.length * 4000;

    let i = 0, iterations = encoded.length;

    // changes the text's encoding 
    //setInterval(() => {
       // changeWhisperEncoding();
    //}, 1000);

    // loop that pauses for 3 seconds between iterations 
    // https://stackoverflow.com/a/3583754
    function whispersFloatDown() {

        let el =  document.getElementById(encoded[i].id);
        el.style.marginTop = "-30vh";
        el.style.opacity = 0;
        el.innerHTML = encoded[i].creep;

        let elem = $("#" + encoded[i].id );

        let randomCenterOp = Math.floor(Math.random() * 10) + 40;
        let pos = randomCenterOp + "vh";

        elem.animate({
            marginTop: pos,
            opacity: 1,
        }, 9000, () => {

            window.setTimeout(()=> {

                elem.animate({
                    marginTop: "130vh",
                    opacity: 0,
                }, 9000);

            }, 3000);
        });

        i++;
        if (i < iterations){
            setTimeout(whispersFloatDown, 3000);
        } else {
            i = 0;
        }
    }

    whispersFloatDown();

    // repeat the loop every time the whisper iteration completes 
    setInterval(()=>{
        whispersFloatDown();
    }, timePerLoop);

}