function lightUp(target) {
    var url=""
    if (target == red) {
        url="tones/DTMF-2.mp3"
    }
    if (target == green) {
        url="tones/DTMF-3.mp3"
    }
    if (target == blue) {
        url="tones/DTMF-1.mp3"
    }
    if (target == yellow) {
        url="tones/DTMF-5.mp3"
    }

    var audio = new Audio(url)
    audio.play()
    target.addClass("lightUp")
    setTimeout(function(){target.removeClass("lightUp")}, 1000)
}

function displayPlayPattern(pattern) {
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] == "green") {
            setTimeout(function(){lightUp(green)}, i * 1100)
        }
        if (pattern[i] == "red") {
            setTimeout(function(){lightUp(red)}, i * 1100)
        }
        if (pattern[i] == "yellow") {
            setTimeout(function(){lightUp(yellow)}, i * 1100)
        }
        if (pattern[i] == "blue") {
            setTimeout(function(){lightUp(blue)}, i * 1100)
        }
    }
}
function random1to4() {
    return Math.floor(Math.random()*4) + 1
}

// add 1 item to the end of the pattern array
function addPattern() {
    var random= random1to4()
    if (random == 1) {
        pattern.push("green")
    }
    if (random == 2) {
        pattern.push("red")
    }
    if (random == 3) {
        pattern.push("yellow")
    }
    if (random == 4) {
        pattern.push("blue")
    }
}

function gameOver() {
        var audio = new Audio("tones/buzzer-fail.mp3")
        audio.play()
        $("body").addClass("gameOver")
        setTimeout(function(){$("body").removeClass("gameOver")}, 1000)
        $("#title").html("Game Over!")
        $(".playButton").html("Play Again?").delay(1000).fadeIn(300)
        playState= false
        pattern= []
        userInput= []
        $(".btn").off("click")
}

function addClickEvent() {
    $(".btn").click((event) => {
        userInput.push(event.target.id)
        if (event.target.id == "green") {
            lightUp(green)
        }
        if (event.target.id == "red") {
            lightUp(red)
        }
        if (event.target.id == "yellow") {
            lightUp(yellow)
        }
        if (event.target.id == "blue") {
            lightUp(blue)
        }
    })
}

function checkUserInput(level) {
    return new Promise((resolve, reject) => {
        addClickEvent()
        setTimeout(() => {
            if ((userInput.length == pattern.length) && (userInput.toString() == pattern.toString())) {
                $(".btn").off("click")
                resolve(true)
            } else resolve(false)
        }, 2 * (level * 1000) + 3000)
        
        // if (userInput.length !== pattern.length) {

        // } else {
        //     if (userInput.toString() == pattern.toString()) {
        //         $(".btn").off("click")
        //         resolve(true)
        //     } else resolve(false)
        // }
    })
}
function lightShow() {
    return new Promise((resolve) => {
        $("#title").html("Are You Ready?")
        lightUp(green)
        setTimeout(function(){lightUp(red)}, 500)
        setTimeout(function(){lightUp(blue)}, 2*500)
        setTimeout(function(){lightUp(yellow)}, 3*500)
        setTimeout(function(){
            lightUp(green)
            lightUp(red)
            lightUp(yellow)
            lightUp(blue)
        }, 2600)
        setTimeout(function(){resolve()}, 5000)
    })
}

function correct() {
    return new Promise((resolve) => {
        $("body").addClass("correct")
        setTimeout(function(){$("body").removeClass("correct")}, 300)
        setTimeout(function(){resolve()}, 500)
    })
}

async function gameStart() {
    await lightShow()
    var level= 1
    playState= true
    while (playState) {
        $("#title").html("Level " + level)
        userInput=[]
        addPattern()
        displayPlayPattern(pattern)
        const userPlayed = await checkUserInput(level)
        if (userPlayed) {
            const answerCorrect = await correct()
            level++
        } else gameOver()
    }
}

var green= $(".btn-success")
var red= $(".btn-danger")
var yellow= $(".btn-warning")
var blue= $(".btn-primary")
var pattern= []
var userInput= []
var playState= false

$(".playButton").click(() => {
    $(".playButton").fadeOut(200)
    gameStart()
    })
