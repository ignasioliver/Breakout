// Object Game
function Game(){
    this.WIDTH_BRICK = 50; this.HEIGHT_BRICK = 25;	// Brick measurements
    this.canvas,  this.context;	// Context to draw the canvas
    this.width, this.height;	// Canvas measurements
    this.LEVELS = new Array();
    this.paddle;
    this.ball;
    this.brick;
    this.t = 0;      // time
    this.start = false;
    this.lifesLeft = 0;
    this.refractionLaw; // Depends on user selection
    this.deleted;
    this.score;
    this.totalScore;
    this.user = "";
    // Keyboard events
    this.key = {
        RIGHT: {code: 39, pressed:false},
        LEFT : {code: 37, pressed:false},
        SPACEBAR: {code: 32, pressed:false}
    };
}

Game.prototype.initialize = function(level, carryScore){
    this.canvas = document.getElementById("game");
    this.width = this.WIDTH_BRICK * 15;
    this.canvas.width = this.width;
    this.height = this.HEIGHT_BRICK * 25;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
    // Create the paddle and the ball;
    this.paddle = new Paddle();
    this.ball = new Ball();
    this.readLevels();
    // Create and build the wall of bricks
    this.wall = new Wall();
    this.wall.build(level);
    this.score = 0;
    this.totalScore = carryScore;
    this.deleted = 0;	// Restart the deleted value at 0 each level/game
    // jQuery events
    $(document).on("keydown", {game: this}, function (e) {
        if (e.keyCode == e.data.game.key.RIGHT.code) {
            e.data.game.key.RIGHT.pressed = true;
        } else if (e.keyCode == e.data.game.key.LEFT.code) {
            e.data.game.key.LEFT.pressed = true;
        } else if (e.keyCode == e.data.game.key.SPACEBAR.code) {{}
            var user = $("#userName").val();
            if(user == ""){	// If the user has not inserted any name
                alert("Please insert your usename.")
            } else {
                game.user = user;
                game.start = true;
            }
        }
    });
    $(document).on("keyup", {game: this}, function (e) {
        if (e.keyCode == e.data.game.key.RIGHT.code) {
            e.data.game.key.RIGHT.pressed = false;
        } else if (e.keyCode == e.data.game.key.LEFT.code) {
            e.data.game.key.LEFT.pressed = false;
        }
    });
    this.t = new Date().getTime();	// Start time
    requestAnimationFrame(mainLoop);
}
Game.prototype.draw = function(){
    this.context.clearRect(0, 0, this.width, this.height);
    this.wall.draw(this.context);
    this.paddle.draw(this.context);
    this.ball.draw(this.context);
};
Game.prototype.update = function(){
    // Seconds since the last update
    var dt = Math.min((new Date().getTime() -this.t)/1000, 1);
    this.t = new Date().getTime();
    this.paddle.update();
    this.ball.update(dt);
};
// Read levels
Game.prototype.readLevels = function(){
    this.LEVELS = [
        {
            colors: {
                t: "#F77",
                c: "#4CF",
                v: "#8D1",
                e: "#D30",
                l: "#00D",
                r: "#F7B",
                p: "#BBB"
            },
            bricks: [
                "",
                "",
                "       p    ",
                "     ttttt  ",
                "    ccccccc ",
                "   vvvvvvvvv",
                "   eeeeeeeee",
                "   lllllllll",
                "   r r r r r"
            ]
        },
        {
            colors: {
                t: "#F77",
                c: "#4CF",
                v: "#8D1",
                e: "#D30",
                l: "#00D",
                r: "#F7B",
                g: "#F93",
                p: "#BBB"
            },
            bricks: [
                "",
                "",
                "  ppp     ppp",
                "  tt      tt ",
                "  cc      cc ",
                "  vv      vv ",
                "  eeeeeeeeeee",
                "  lllllllllll",
                "   r r r r r ",
                "      ggg    "
            ]
        },
        {
            colors: {
                b: "#FFF",
                t: "#F77",
                c: "#4CF",
                v: "#8D1",
                e: "#D30",
                l: "#00D",
                r: "#F7B",
                g: "#F93",
                p: "#BBB",
                d: "#FB4"
            },
            bricks: [
                "",
                " ddd",
                " pppp",
                " ttttt",
                " cccccc",
                " vvvvvvv",
                " eeeeeeee",
                " lllllllll",
                " rrrrrrrrrr",
                " ggggggggggg",
                " bbbbbbbbbbbb ",
                " ddddddddddddd "
            ]
        },
        {
            colors: {
                r: "#D40000",
                g: "#6D8902",
                y: "#EBAD00"
            },
            bricks: [
                "",
                "    rrrrrr   ",
                "   rrrrrrrrr ",
                "   gggyygy   ",
                "  gygyyygyyy ",
                "  gyggyyygyyy",
                "  ggyyyygggg ",
                "    yyyyyyy  ",
                "   ggrggg    ",
                "  gggrggrggg ",
                " ggggrrrrgggg",
                " yygryrryrgyy",
                " yyyrrrrrryyy",
                "   rrr  rrr  ",
                "  ggg    ggg ",
                " gggg    gggg "
            ]
        },
        {
            colors: {
                f: "#D30"
            },
            bricks: [
                "",
                "    f     f ",
                "     f   f",
                "    fffffff ",
                "   ff fff ff",
                "  fffffffffff",
                "  f fffffff f",
                "  f f     f f",
                "     ff ff"
            ]
        },
        {
            colors: {
                b: "#FFF",
                l: "#000000",
                n: "#8b5252",
                r: "#F99",
                f: "#900",
                g: "#FF0"

            },
            bricks: [
                "",
                "      nnn",
                "    nnrrrnn",
                "   nrrrrrrrn",
                "  nrrrrrrrrrn",
                "  nrblrrrblrn",
                " nrfllrrrllfrn",
                " nrffrrrrrffrn",
                " nrrrrrnrrrrrn",
                " nrrrrrrrrrrrn",
                " nrrrfrrrfrrrn",
                " nrrrrfffrrrrn",
                "  nrrrrrrrrrn",
                "   nrrrrrrrn",
                "    nnnnnnn"
            ]
        }];
}

// Start program
var game;
var noSound = true;
$(document).ready(function(){
    $("#picSound").click(function(){
        if(noSound){ // Play
            $(this).attr("src","images/audioOn.gif");
            noSound = false;
        }
        else{  // Pause
            $(this).attr("src","images/audioOff.gif");
            noSound = true;
        }
    });
});

function mainLoop(){
    game.update();
    game.draw();
    requestAnimationFrame(mainLoop);
}

// Paddle
function Paddle(){
    this.width = 300;
    this.height = 20;
    this.x = game.width / 2 - this.width / 2;
    this.y = game.height - 50;
    this.vx = 10; // Velocity of the paddle
    this.color = "#450004";
}
Paddle.prototype.update = function(){
    if (game.key.RIGHT.pressed) {
        this.x = Math.min(game.width - this.width, this.x + this.vx);
    } else if (game.key.LEFT.pressed) {
        this.x = Math.max(0, this.x - this.vx);
    }
}
Paddle.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#333";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
};

// Ball
function Ball(){
    this.x = 375;	// Center - relatively - of the screen
    this.y = 550;
    // Velocity of the ball:
    this.vx = 300;
    this.vy = 310;
    this.radius = 10;
    this.color = "#333";
}
Ball.prototype.update = function(dt){
    if(game.start) {
        var dtImpact;	// Time until impact
        var impact = false;	// True if there is impact in the current dt
        var k; 	// Proportion of "trajectory" that surpasses the level
        var trajectory = {};
        trajectory.p1 = {x: this.x, y: this.y};

        // Impact with the game walls
        // New ball position:
        trajectory.p2 = {x: this.x + this.vx * dt, y: this.y + this.vy * dt};

        // Check all possible impacts
        // Bottom:
        if (trajectory.p2.y + this.radius > game.height) {
            k = (trajectory.p2.y + this.radius - game.height) / this.vy;
            // New position: almost touching right side
            this.x = trajectory.p2.x - k * this.vx;
            this.y = game.height - this.radius;
            dtImpact = k * dt;	// Remaining time
            this.vy = -this.vy;
            impact = true;
            if (!noSound){
                var playBottom = new Audio ("sound/bottom.WAV");
                playBottom.play();
            }
        }

        // Top:
        if (trajectory.p2.y - this.radius < 0) {
            k = (trajectory.p2.y - this.radius) / this.vy;	// k always positive
            // New position: almost touching top
            this.x = trajectory.p2.x - k * this.vx;
            this.y = this.radius;
            this.vy = -this.vy;
            dtImpact = k * dt;	// Remaining time
            impact = true;
        }

        // Right side:
        if (trajectory.p2.x + this.radius > game.width) {
            k = (trajectory.p2.x + this.radius - game.width) / this.vx;
            this.x = game.width - this.radius;
            this.y = trajectory.p2.y - k * this.vy;
            this.vx = -this.vx;
            dtImpact = k * dt;
            impact = true;
        }

        // Left side:
        if (trajectory.p2.x - this.radius < 0) {
            k = (trajectory.p2.x - this.radius) / this.vx;
            this.x = this.radius;
            this.y = trajectory.p2.y - k * this.vy;
            this.vx = -this.vx;
            dtImpact = k * dt;
            impact = true;
        }

        var pImpact = Utilities.intersectionSegmentRectangle(trajectory, {
            p: {x: game.paddle.x - this.radius, y: game.paddle.y - this.radius},
            w: game.paddle.width + 2 * this.radius,
            h: game.paddle.height + 2 * this.radius
        });


        // Lost (bottom impact):
        if (this.y >= (game.canvas.height-game.paddle.height)) {
            this.x = 375;
            this.y = 550;
            game.lifesLeft++;
            game.start = false;
            if(game.lifesLeft == 1) {
                $("#heart4").fadeOut();
            } if(game.lifesLeft == 3) {
                $("#heart3").fadeOut();
            } if(game.lifesLeft == 5){
                $("#heart2").fadeOut();
            } if(game.lifesLeft == 7) {
                $("#heart1").hide();
                Utilities.results();
            }
        }

        // If the user has selected to apply the law of refraction,
        // apply it to effectively change the speed of the ball:
        if (game.refractionLaw) {
            if (pImpact) {
                this.vx = (((this.x - (game.paddle.x + (game.paddle.width / 2))) /
                (game.paddle.x + (game.paddle.width / 2))) * 1000);
            }
        }

        // If the law of refraction has been selected and the ball impacted the paddle:
        if (pImpact) {
            if (!noSound){
                var playPaddle = new Audio ("sound/paddle.mp3");
                playPaddle.play();
            }
            impact = true;
            this.x = pImpact.p.x;
            this.y = pImpact.p.y;
            switch (pImpact.edge) {
                case "superior":
                    this.vy = -this.vy;
                    break;
                case "inferior": // If the ball touches the bottom, life lost, stop
                    break;
                case "left":
                case "right"   :
                    this.vx = -this.vx;
                    break;
            }
            dtImpact = (Utilities.distance(pImpact.p, trajectory.p2) / Utilities.distance(trajectory.p1, trajectory.p2)) * dt;
        } else {	// Check if there has been an impact with any brick:
            for (var i = 0; i < game.wall.bricks.length; i++) { // Check all bricks
                if (!game.wall.bricks[i].touched) {
                    pImpact = Utilities.intersectionSegmentRectangle(trajectory, {
                        p: {x: game.wall.bricks[i].x - this.radius, y: game.wall.bricks[i].y - this.radius},
                        w: game.wall.bricks[i].w + 2 * this.radius,
                        h: game.wall.bricks[i].h + 2 * this.radius
                    });
                }
                if (pImpact) Utilities.deleteBrick(i);
                if (pImpact) break;
            }
            if (pImpact) {
                impact = true;
                this.x = pImpact.p.x;
                this.y = pImpact.p.y;
                switch (pImpact.edge) {
                    case "superior":
                    case "inferior":
                        this.vy = -this.vy;
                        break;
                    case "left":
                    case "right"   :
                        this.vx = -this.vx;
                        break;
                }
                dtImpact = (Utilities.distance(pImpact.p, trajectory.p2) / Utilities.distance(trajectory.p1, trajectory.p2)) * dt;
            }
        }

        // Update the ball position:
        if (impact) {
            this.update(dtImpact);
        } else {
            this.x = trajectory.p2.x;
            this.y = trajectory.p2.y;
        }
    }
};
Ball.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);	// Rounded ball
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

// Brick:
function Brick(x, y, color){
    this.x = x;
    this.y = y;
    this.w = game.WIDTH_BRICK;
    this.h = game.HEIGHT_BRICK;
    this.color = color;
    this.touched = false;
}
Brick.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle="#333";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
};

// Wall
function Wall(n){
    this.bricks = [];
}
Wall.prototype.build = function (n) {
    var level = game.LEVELS[n];
    // Read the info from the level selected (n)
    for (var i = 0; i < level.bricks.length; i++){
        var line = level.bricks[i];
        for (var j = 0; j < line.length; j++){
            if (line.charAt(j) != " "){
                var brick = new Brick();
                brick.x = j * game.WIDTH_BRICK;
                brick.y = i * game.HEIGHT_BRICK;
                brick.color = level.colors[line.charAt(j)];
                this.bricks.push(brick);
            }
        }
    }
}
Wall.prototype.draw = function(ctx){
    for (var i = 0; this.bricks.length > i; i++){
        var brick = this.bricks[i];
        if (!brick.touched)brick.draw(ctx);
    }

}

// Utilitites:
var Utilities = {};

Utilities.deleteBrick = function(index){
    if (!noSound){
        var playBrick = new Audio ("sound/brick.WAV");
        playBrick.play();
    }
    game.deleted++;
    game.totalScore++;
    $("#deleted").empty();
    $("#deleted").append(game.totalScore);
    game.wall.bricks[index].touched = true;
    // If the level is completed, go to the next level:
    if(game.deleted >= (game.wall.bricks.length)) Utilities.upLevel();
}
Utilities.upLevel = function() {
    if (!noSound){
        var playLevelUp = new Audio ("sound/levelUp.mp3");
        playLevelUp.play();
    }
    game.score += game.deleted;
    game.deleted = 0;
    if (game.thisLevel == 1){ // Fix bug on update Level problem
        alert("Congratulations! Get ready for the next level.");
        game.initialize(1, game.totalScore);
        game.thisLevel = 2;
    } else {
        game.thisLevel++;// Upgrade the level
        if (game.thisLevel == 7) {
            game.thisLevel = 0;	// Restart from the first level
            alert("Congratulations! You completed the last level.\nPlay the first one now!");
            game.initialize(game.thisLevel, game.totalScore);
        } else {
            alert("Congratulations! Get ready for the next level.");
            game.initialize(game.thisLevel - 1, game.totalScore);
        }
    }
}

Utilities.results = function(){
    game.start = false;
    var winner = false;
    var top = localStorage.getItem('Top1');
    // Check if the ended game is one of the top 3 in order to put them locally in the ranking:
    if(top < game.totalScore){
        if (!noSound){
            var playTop3 = new Audio ("sound/top3.mp3");
            playTop3.play();
        }
        var user1 = localStorage.getItem('User1');
        var pt2 = localStorage.getItem('Top2');
        var user2 = localStorage.getItem('User2');
        localStorage.setItem('User1', (game.user + ": " + game.totalScore + " pts"));
        localStorage.setItem('Top1', game.totalScore);
        if (user1 != null){ // If there was already a number 1 player
            localStorage.setItem('Top2', top);
            localStorage.setItem('User2', user1);
            if (user2 != null){
                localStorage.setItem('Top3', pt2);
                localStorage.setItem('User3', user2);
            }
        }
        winner = true;
        alert("CONGRATULATIONS! With " + game.totalScore + " points, you just crowned yourself as the best player!");
    } else {
        top = localStorage.getItem('Top2');
        if(top < game.totalScore){
            if (!noSound){
                var playTop3 = new Audio ("sound/top3.mp3");
                playTop3.play();
            }
            var user2 = localStorage.getItem('User2');
            localStorage.setItem('User2', (game.user + ": " + game.totalScore + " pts"));
            localStorage.setItem('Top2', game.totalScore);
            if (user2 != null){
                localStorage.setItem('Top3', top);
                localStorage.setItem('User3', user2);
            }
            winner = true;
            alert("Great game! With " + game.totalScore + " points, you are the second best player to ever play here!");
        } else {
            top = localStorage.getItem('Top3');
            if (top < game.totalScore) {
                if (!noSound){
                    var playTop3 = new Audio ("sound/top3.mp3");
                    playTop3.play();
                }
                localStorage.setItem('User3', (game.user + ": " + game.totalScore + " pts"));
                localStorage.setItem('Top3', game.totalScore);
                winner = true;
                alert("Well done! With " + game.totalScore + " points, you just climbed to the 3rd spot of the ranking!");
            }
        }
    }
    if (!winner){
        if (!noSound){
            var playGameOver = new Audio ("sound/gameOver.mp3");
            playGameOver.play();
        }
        alert("GAME OVER!\nYou scored " + game.totalScore + " points.\nPlay again!");
    }
    $("#heart1").show();
    $("#heart2").show();
    $("#heart3").show();
    $("#heart4").show();
    game.lifesLeft = 0;
    gameStart(0);
}

// Intersections:
Utilities.areCut = function(p1,p2,p3,p4){
    function check(p1,p2,p3){
        return (p2.y - p1.y) * (p3.x - p1.x) < (p3.y - p1.y) * (p2.x - p1.x);
    }
    return check(p1, p2, p3) != check(p1, p2, p4) && check(p1, p3, p4) != check(p2, p3, p4);
}
Utilities.intersectionPoint2 = function(p1, p2, p3, p4){ // Not used
    var A1, B1, C1, A2, B2, C2, x, y, d;
    if(Utilities.areCut(p1, p2, p3, p4)){
        A1 = p2.y - p1.y; B1 = p1.x - p2.x; C1 = p1.x * p2.y - p2.x * p1.y;
        A2 = p4.y - p3.y; B2 = p3.x - p4.x; C2 = p3.x * p4.y - p4.x * p3.y;
        d = A1 * B2 - A2 * B1;
        if(d != 0){
            x= (C1 * B2 - C2 * B1) / d;
            y= (A1 * C2 - A2 * C1) / d;
            return {x:x, y:y};
        }
    }
}
Utilities.intersectionPoint = function (p1,p2,p3,p4){
    // Converts segment 1 to the general line form: Ax + By = C:
    var a1 = p2.y - p1.y;
    var b1 = p1.x - p2.x;
    var c1 = a1 * p1.x + b1 * p1.y;

    // Converts segment 2 to the general line form: Ax + By = C:
    var a2 = p4.y - p3.y;
    var b2 = p3.x - p4.x;
    var c2 = a2 * p3.x + b2 * p3.y;

    // Calculate intersection point:
    var d = a1 * b2 - a2 * b1;

    // Parallel lines when "d" is zero:
    if (d == 0) {
        return false;
    }
    else {
        var x = (b2*c1 - b1*c2) / d;
        var y = (a1*c2 - a2*c1) / d;
        var intersectionPoint = {x:x, y:y};	// This point belongs to both straight lines
        if(Utilities.containsPoint(p1,p2,intersectionPoint) && Utilities.containsPoint(p3,p4,intersectionPoint) )
            return intersectionPoint;
    }
}
Utilities.containsPoint = function(p1,p2, punt){
    return (valueInsideInterval(p1.x, punt.x, p2.x) || valueInsideInterval(p1.y, punt.y, p2.y));

    // Internal function:
    function valueInsideInterval(a, b, c) {
        //  Returns true if "b" is between "a" and "b", both excluded:
        if (Math.abs(a - b) < 0.000001 || Math.abs(b-c) < 0.000001) { // Unable to a == b with real numbers
            return false;
        }
        return (a < b && b < c) || (c < b && b < a);
    }
}
Utilities.distance = function(p1,p2){
    return Math.sqrt((p2.x-p1.x) * (p2.x-p1.x) + (p2.y-p1.y) * (p2.y-p1.y));
}
Utilities.intersectionSegmentRectangle = function(seg,rect){
    var pI, dI, pImin, dImin = Infinity, edge;
    pI = Utilities.intersectionPoint(seg.p1, seg.p2,
        {x:rect.p.x, y:rect.p.y}, {x:rect.p.x + rect.w, y:rect.p.y});
    if(pI){
        dI = Utilities.distance(seg.p1, pI);
        if(dI < dImin){
            dImin = dI;
            pImin = pI;
            edge = "superior";
        }
    }
    pI = Utilities.intersectionPoint(seg.p1, seg.p2,
        {x:rect.p.x + rect.w, y:rect.p.y + rect.h}, {x:rect.p.x, y:rect.p.y + rect.h});
    if(pI){
        dI = Utilities.distance(seg.p1, pI);
        if(dI < dImin){
            dImin = dI;
            pImin = pI;
            edge = "inferior";
        }
    }
    pI = Utilities.intersectionPoint(seg.p1, seg.p2,
        {x:rect.p.x, y:rect.p.y+rect.h}, {x:rect.p.x,y:rect.p.y});
    if(pI){
        dI = Utilities.distance(seg.p1, pI);
        if(dI < dImin){
            dImin = dI;
            pImin = pI;
            edge = "left";
        }
    }
    pI = Utilities.intersectionPoint(seg.p1, seg.p2,
        {x:rect.p.x+rect.w, y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y+rect.h});
    if(pI){
        dI = Utilities.distance(seg.p1, pI);
        if(dI < dImin){
            dImin = dI;
            pImin = pI;
            edge = "right";
        }
    }
    if(edge){
        return {p:pImin, edge:edge}
    }
}

// UI
function gameStart(level){
    // Implement the ranking
    $("#Top_1").empty();
    $( "#Top_1" ).append(localStorage.getItem('User1'));
    $("#Top_2").empty();
    $( "#Top_2" ).append(localStorage.getItem('User2'));
    $("#Top_3").empty();
    $( "#Top_3" ).append(localStorage.getItem('User3'));
    $("#deleted").empty();
    $("#deleted").append('0');
    game = new Game();	// Create the game
    game.thisLevel = $("#levelPicker").val();
    game.initialize(level, 0);
    if ($('#refractionLaw').is(":checked")){
        game.refractionLaw = true;
    }else game.refractionLaw = false;
}
$("#playGame").click(function(e) {
    $("#menu").hide();
    $("#gameMode").show("fade");
    $("#displayGame").show("fade");
    gameStart(0);
});
// Instructions (JQuery):
$("#ins").accordion({
    collapsible: true,
    active: false
});
$("#returnCanvas").click(function(e) {
    $("#displayGame").hide();
    $("#heart1").show();
    $("#heart2").show();
    $("#heart3").show();
    $("#heart4").show();
    game.lifesLeft = 0;
    game.deleted = 0;
    game.start = false;
    $("#menu").fadeIn(400);
});
$("#levelPicker").change(function(e) {
    if($("#levelPicker").val()==0){
        $("#game").hide("fade");
    } else {
        gameStart($("#levelPicker").val() - 1);
        // Lifes restored (new game):
        $("#heart1").show();
        $("#heart2").show();
        $("#heart3").show();
        $("#heart4").show();
        $("#game").show("fade");
    }
});
// Code by Ignasi Oliver under the MIT License
