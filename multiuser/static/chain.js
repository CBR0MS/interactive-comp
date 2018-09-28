window.onload = () => {

    let $whispers = $(".flow");

    // amount of time each whisper takes to change opacity 
    let time = 1300;
    // total time drawing 
    let timeDrawing = $whispers.length * time;

    // fade in each whisper 
    $whispers.each(function() {

        setTimeout(() => { 
            $(this).animate({
                opacity: 1,
            }, 1300)
        }, time)

        time += 1300;
  });

    // start fading text
    setTimeout(() => {
        
        $whispers.each(function() {
            $(this).animate({
                opacity: 0
            }, 4000)
        });

    }, timeDrawing + 2000)

    // redirect after drawing time plus six seconds 
    setTimeout(() => {
        // redirect to main page 
        window.location.href = '../'
    }, timeDrawing + 6000)
}

