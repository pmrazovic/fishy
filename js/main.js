window.onload = function () {
	// Set the name of the hidden property and the change event for visibility
	var hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") {
	  hidden = "hidden";
	  visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
	  hidden = "mozHidden";
	  visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
	  hidden = "msHidden";
	  visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
	  hidden = "webkitHidden";
	  visibilityChange = "webkitvisibilitychange";
	}

	// Back key event listener
	document.addEventListener('tizenhwkey', function(e) {
	  if (e.keyName === "back") {
	      try {
	          tizen.application.getCurrentApplication().exit();
	      } catch (ignore) {}
	  }
	});

	// Visibility change event listener
	document.addEventListener(visibilityChange, function () {
	  if (document[hidden]){
	  	pause = true;
	      document.removeEventListener('click', action);
	      document.removeEventListener('rotarydetent', move);
	  } else {
	    pause = false;
	    countP = 0;
	    document.addEventListener('click', action);
	    document.addEventListener('rotarydetent', move);
	  }
	}, false);
	// tap event
	document.addEventListener('click', action);
    
    // Setting up the canvas
    var canvas = document.getElementById('canvas'),
        ctx    = canvas.getContext('2d'),
        cH     = ctx.canvas.height = 360,
        cW     = ctx.canvas.width  = 360;

    //General sprite load
    var imgHeart = new Image();
    imgHeart.src = 'images/heart.png';
    var imgRefresh = new Image();
    imgRefresh.src = 'images/refresh.png';
    var imgSafe = new Image();
    imgSafe.src = 'images/safe.png';
    var spriteExplosion = new Image();
    spriteExplosion.src = 'images/explosion.png';

    var imgFish1 = new Image();
    imgFish1.src = 'images/fish_1.png';
    var imgFish2 = new Image();
    imgFish2.src = 'images/fish_2.png';
    var imgFish3 = new Image();
    imgFish3.src = 'images/fish_3.png';
    var imgFish4 = new Image();
    imgFish4.src = 'images/fish_4.png';
    var imgFish5 = new Image();
    imgFish5.src = 'images/fish_5.png';
    var imgFish6 = new Image();
    imgFish6.src = 'images/fish_6.png';
    var imgFish7 = new Image();
    imgFish7.src = 'images/fish_7.png';
    var imgFish8 = new Image();
    imgFish8.src = 'images/fish_8.png';
    var imgFish = new Image();
    imgFish.src = 'images/fish.png';

    //Game
    var points     = 0,
        lives      = 4,
        count      = 0,
        pause      = false,
        countP     = 0,
        playing    = false,
        gameOver   = false,
    	starting = true,
        speed = 2,
        frame = 0;

    var record = localStorage.getItem("record");
    record = record === null ? 0 : record;
    
    //Player
    var player = new _player(cW/2-5, cH/2-5, "start");

    function move(e) {
    	if (e.detail.direction === "CW") { 
            player.changeDirection('up');
        } else {
            player.changeDirection('down');
        }

    }

    function check_direction() {
        if(player.y >= 325){
          player.changeY(325);
        }
        if(player.y <= 5){
          player.changeY(5);
        }
        var ny;
        if(player.direction === 'up'){
          ny = player.y + 1;
          player.changeY(ny);
        }else if(player.direction === 'down'){
          ny = player.y - 1;
          player.changeY(ny);
        }
    }

    // Enemies
    var enemies = [];

    function action(e) {
        e.preventDefault();
        if(gameOver) {
            if(e.type === 'click') {
                gameOver   = false;
                starting = true;
                playing = false;
                count      = 0;
                points = 0;
                lives = 4;
                speed = 2;
                enemies = [];
                player = new _player(cW/2-5, cH/2-5, "start");
                document.removeEventListener('rotarydetent', move);
            } 
        } else if (starting) {
        	if(e.type === 'click') {
        		starting = false;
                playing = true;
                enemies = [];
                document.addEventListener('rotarydetent', move);
        	}
        } else if (playing) {
            if(e.type === 'click') {
                playing = true;
                document.addEventListener('rotarydetent', move);
            }
        }
        
    }

    function _player(x,y,direction) {
        this.x = x;
        this.y = y;
        this.size = 0.3;
        this.width = 146 * this.size;
        this.height = 78 * this.size;
        this.alpha = 1;
        this.alphaDecrease = true;
        this.direction = direction;
        this.dead = false;
        this.deadForFrames = 0;
        this.changeX = function(nx){
          this.x = nx;
        };
        this.changeY = function(ny){
          this.y = ny;
        };
        this.changeDirection = function(nd){
            this.direction = nd;
        };
    }

    function _enemy(x, y, direction){
        this.x = x;
        this.y = y;
        this.state = 0;
        this.stateX = 0;
        this.destroyed = false;
        this.alpha = 1;
        this.alphaDecrease = true;
        this.eatedForFrames = 0;
        this.eated = false;
        this.direction = direction;
        this.type = random(1,8);
        this.size = random(2,10)/20;

        switch(this.type){
            case 1:
                this.img = imgFish1;
                this.width = 150 * this.size;
                this.height = 73 * this.size;
                break;
            case 2:
                this.img = imgFish2;
                this.width = 153 * this.size;
                this.height = 87 * this.size;
                break;
            case 3:
                this.img = imgFish3;
                this.width = 144 * this.size;
                this.height = 90 * this.size;                
                break;
            case 4:
                this.img = imgFish4;
                this.width = 138 * this.size;
                this.height = 88 * this.size;                
                break;
            case 5:
                this.img = imgFish5;
                this.width = 136 * this.size;
                this.height = 100 * this.size;                
                break;
            case 6:
                this.img = imgFish6;
                this.width = 158 * this.size;
                this.height = 84 * this.size;                
                break;
            case 7:
                this.img = imgFish7;
                this.width = 146 * this.size;
                this.height = 78 * this.size;                
                break;
            case 8:
                this.img = imgFish8;
                this.width = 142 * this.size;
                this.height = 89 * this.size;                
                break;
        }

        this.changeX = function(nx){
          this.x = nx;
        };
        this.changeY = function(ny){
          this.y = ny;
        };
        this.changeDirection = function(nd){
          this.direction = nd;
        };
      }

    function start() {
        if (pause) {
            if (countP < 1) {
                countP = 1;
            }
        } else if (playing) {
        	//Clear
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();
            
            check_direction();

            // Drawing player

            if (player.alphaDecrease) {
                player.alpha -= 0.05;
            } else {
                player.alpha += 0.05;
            }
            if (player.alpha >= 1) {
                player.alphaDecrease = true;
            } else if (player.alpha <= 0.5) {
                player.alphaDecrease = false;
            }
            ctx.globalAlpha = player.alpha;
            ctx.drawImage(
                imgFish,
                player.x,
                player.y,
                player.width,
                player.height
            );
            ctx.globalAlpha = 1;

            // Drawing enemies
            var eated = [];
            for(i=0; i < enemies.length; i++){
                if(enemies[i].x > 360){
                    var ne = enemies.indexOf(enemies[i]);
                    enemies.splice(ne, 1);
                    points++;
                }

                if (!enemies[i].destroyed && !enemies[i].eated) {
                    speed = 1 + points/300;
                    if (speed > 10) {
                    	speed = 10;
                    }

                    var nx = enemies[i].x + speed;
                    enemies[i].changeX(nx);

                    ctx.drawImage(
                        enemies[i].img,
                        enemies[i].x,
                        enemies[i].y,
                        enemies[i].width,
                        enemies[i].height
                    );
                } else if (enemies[i].eated) {
                    var alpha = 1;
                    var up = 0;
                    if (enemies[i].eatedForFrames > 0) {
                        alpha = 1 - enemies[i].eatedForFrames/30;
                        up = enemies[i].eatedForFrames/5; 
                    } else {
                        eated.push(i);
                    }
                    enemies[i].eatedForFrames -= 1;
                    ctx.font = "bold 18px Helvetica";
                    ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
                    ctx.textAlign = "center";
                    ctx.textBaseline = 'middle';
                    ctx.fillText("+" + Math.round(enemies[i].size*100), enemies[i].x + enemies[i].width, enemies[i].y + enemies[i].height - up);  
                } else if (enemies[i].destroyed) {
                    speed = 1 + points/300;
                    if (speed > 10) {
                    	speed = 10;
                    }

                    var nx = enemies[i].x + speed;
                    enemies[i].changeX(nx);

                   if (enemies[i].alphaDecrease) {
                        enemies[i].alpha -= 0.1;
                    } else {
                        enemies[i].alpha += 0.1;
                    }
                    if (enemies[i].alpha >= 1) {
                        enemies[i].alphaDecrease = true;
                    } else if (enemies[i].alpha <= 0.2) {
                        enemies[i].alphaDecrease = false;
                    }
                    ctx.globalAlpha = enemies[i].alpha;
                    ctx.drawImage(
                        enemies[i].img,
                        enemies[i].x,
                        enemies[i].y,
                        enemies[i].width,
                        enemies[i].height
                    );
                    ctx.globalAlpha = 1;                    
                }
            }

            for(i=0; i < eated.length; i++){
                enemies.splice(eated[i],1);
            }

            // Checking collision
            for(i=0;i<enemies.length;i++){
              var en = enemies[i];
              if(!en.destroyed && !en.eated && player.x + 5 < en.x + en.width && player.x + player.width - 5 > en.x && player.y + 5 < en.y + en.height && player.y + player.height - 5 > en.y){
                if (en.size >= player.size) {
                    player.dead = true;
                    player.deadForFrames = 10;
                    lives--;
                    enemy_loop = null;
                    en.destroyed = true;
                } else {
                    en.eated = true;
                    en.eatedForFrames = 30;
                    points += Math.round(enemies[i].size*100);
                    player.size += 0.01;
                    if (player.size > 0.4) {
                        player.size = 0.4;
                    }
                    player.width = 146 * player.size;
                    player.height = 78 * player.size;
                }
              }
            }

            if (lives === -1) {
                gameOver = true;
                playing  = false;
                canvas.removeEventListener('rotarydetent',move);
            }

            if (player.dead) {
                if (player.deadForFrames <= 10 && player.deadForFrames > 0 ) {
                    ctx.fillStyle = 'rgba(255,0,0,0.4)';
                    ctx.rect(0,0, cW,cH);
                    ctx.fill();
                } else {
                    player.dead = false;
                }
                player.deadForFrames -= 1;
            }

            // Draw HUD
            ctx.font = "18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillText(points, cW/2,cH/2 + 150);

            ctx.font = "10px Helvetica";
            ctx.fillStyle = "white";
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText('Record: '+record+'', cW/2,cH/2 - 150);

            var startX = 130;
            for (var i = 0; i < lives; i++) {
                ctx.drawImage(
                    imgHeart,
                    startX,
                    40,
                    20,
                    20
                );
                startX += 25;
            }

        	
        } else if(starting) {
            //Clear
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();

            ctx.font = "bold 25px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["title"], cW/2,cH/2 - 120);

            ctx.font = "bold 18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["tap_to_play"], cW/2,cH/2 - 90);     
              
            ctx.font = "bold 18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["instructions"], cW/2,cH/2 + 80);
              
            ctx.font = "13px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            wrapText(TIZEN_L10N["become"], cW/2,cH/2 + 105, 220, 15);
            
            ctx.drawImage(
                    imgFish2,
                    cW/2 - 77,
                    cH/2 - 50
                );
            
        } else if(count < 1) {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0,0, cW,cH);
            ctx.fill();

            ctx.font = "bold 25px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Game over",cW/2,cH/2 - 100);

            ctx.font = "18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["score"] + ": "+ points, cW/2,cH/2 + 100);

            record = points > record ? points : record;
            localStorage.setItem("record", record);

            ctx.font = "18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["record"] + ": "+ record, cW/2,cH/2 + 125);

            ctx.drawImage(imgRefresh, cW/2 - 23, cH/2 - 23);
        }
    }

    var enemy_loop = setInterval(function(){
        if (!pause) {
            var rnd = Math.random()*360;
            var e = new _enemy(-100, rnd, 'left');
            enemies.push(e);
        }
    }, 400);

    function init() {
        frame += 1;
        frame %= 30;
        ctx.save();
        start();
        ctx.restore();
        window.requestAnimationFrame(init);
    }

    init();

    //Utils
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }
    
    function wrapText(text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
      }


};