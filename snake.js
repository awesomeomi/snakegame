function init() {
    var canvas = document.getElementById('mycanvas');
    var W = canvas.width = 500;
    var H = canvas.height = 450;
    var pen = canvas.getContext("2d");
    var gameover = false;
    var score = 5;
  
    var foodimg = new Image();
    foodimg.src = "E:/Courses/New folder/assets/apple.png";
  
    var trophy = new Image();
    trophy.src = "E:/Courses/New folder/assets/trophy.png";
  
    var cs = 33;
    var food = randomfood();
    var snake = {
      init_len: 5,
      color: 'blue',
      cells: [],
      direction: "right",
  
      createsnake: function () {
        for (var i = this.init_len; i > 0; i--) {
          this.cells.push({ x: i, y: 0 });
        }
      },
  
      drawsnake: function () {
        for (var i = 0; i < this.cells.length; i++) {
          pen.fillStyle = this.color;
          pen.fillRect(this.cells[i].x * cs, this.cells[i].y * cs, cs - 2, cs - 2);
        }
      },
  
      updatesnake: function () {
        var headx = this.cells[0].x;
        var heady = this.cells[0].y;
  
        if (headx === food.x && heady === food.y) {
          food = randomfood();
          score++;
        } else {
          this.cells.pop();
        }
  
        var nextX, nextY;
        if (this.direction === "right") {
          nextX = headx + 1;
          nextY = heady;
        } else if (this.direction === "left") {
          nextX = headx - 1;
          nextY = heady;
        } else if (this.direction === "down") {
          nextX = headx;
          nextY = heady + 1;
        } else {
          nextX = headx;
          nextY = heady - 1;
        }
        this.cells.unshift({ x: nextX, y: nextY });
  
        var lastx = Math.round(W / cs);
        var lasty = Math.round(H / cs);
  
        if (this.cells[0].x < 0 || this.cells[0].y < 0 || this.cells[0].x >= lastx || this.cells[0].y >= lasty) {
          gameover = true;
        }
  
        if (this.checkCollision()) {
          gameover = true;
        }
      },
  
      checkCollision: function () {
        var head = this.cells[0];
  
        for (var i = 1; i < this.cells.length; i++) {
          if (head.x === this.cells[i].x && head.y === this.cells[i].y) {
            return true;
          }
        }
        return false;
      },
    };
  
    snake.createsnake();
  
    function keypressed(e) {
      if (e.key === "ArrowRight" && snake.direction !== "left") {
        snake.direction = "right";
      } else if (e.key === "ArrowLeft" && snake.direction !== "right") {
        snake.direction = "left";
      } else if (e.key === "ArrowDown" && snake.direction !== "up") {
        snake.direction = "down";
      } else if (e.key === "ArrowUp" && snake.direction !== "down") {
        snake.direction = "up";
      }
    }
  
    document.addEventListener('keydown', keypressed);
  
    function draw() {
        pen.clearRect(0, 0, W, H);
        snake.drawsnake();
        pen.fillStyle = "red";
        pen.drawImage(foodimg, food.x * cs, food.y * cs, cs, cs);
        pen.drawImage(trophy, 15, 15, cs, cs);
        pen.fillStyle = "black";
        pen.font = "15px roboto";
        pen.fillText("Score: " + score, 50, 45);
        pen.fillText("Weather: " + weather, 50, 65); 
      }
      
  
    function update() {
      snake.updatesnake();
    }
  
    function randomfood() {
      var foodx = Math.round(Math.random() * (W - cs) / cs);
      var foody = Math.round(Math.random() * (H - cs) / cs);
      var food = {
        x: foodx,
        y: foody,
        color: "red",
      };
      return food;
    }
  
    function getWeather(city) {
        
        var url = `https://api.weatherapi.com/v1/current.json?key=e4481f89b33f4df6942223341230307&q=${city}`;
        
        fetch(url)
          .then(response => response.json())
          .then(data => {
            weather = data.current.condition.text; 
          })
          .catch(error => {
            console.log(error);
          });
      }
      
  
    function gameloop() {
      if (gameover) {
        clearInterval(f);
        alert("Game Over");
        return;
      }
      draw();
      update();
    }
  
    var f = setInterval(gameloop, 100);
  

    getWeather('Mumbai');
}

init();
