document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    if(!canvas) return; 
    const ctx = canvas.getContext("2d");

    let frames = 0;
    let score = 0;
    let gameOver = false;
    let gameStarted = false;

    // --- YEŞİL ADAM YERİNE MAVİ ADAMI ÇAĞIRIYORUZ ---
    const playerImg = new Image();
    playerImg.src = 'assets/greenman.png'; //greenman.png -> blueman.png oldu.

    const player = {
        x: 150,
        y: 150,
        width: 40, 
        height: 40, 
        velocity: 0,
        gravity: 0.25,
        jump: -5.5,
        draw: function() {
            ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
        },
        update: function() {
            if(!gameStarted) return; 
            this.velocity += this.gravity;
            this.y += this.velocity;
            if (this.y + this.height >= canvas.height || this.y <= 0) {
                gameOver = true;
            }
        },
        flap: function() {
            this.velocity = this.jump;
        }
    };

    const obstacles = {
        items: [],
        dx: 3,
        gap: 130, 
        draw: function() {
            for (let i = 0; i < this.items.length; i++) {
                let p = this.items[i];
                let pipeGradient = ctx.createLinearGradient(p.x, 0, p.x + p.width, 0);
                pipeGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
                pipeGradient.addColorStop(0.5, "rgba(122, 188, 255, 0.8)"); 
                pipeGradient.addColorStop(1, "rgba(255, 255, 255, 0.4)");

                ctx.fillStyle = pipeGradient;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
                ctx.lineWidth = 2;

                ctx.fillRect(p.x, 0, p.width, p.top);
                ctx.strokeRect(p.x, 0, p.width, p.top);
                ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
                ctx.strokeRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
            }
        },
        update: function() {
            if(!gameStarted) return; 

            if (frames % 100 === 0) {
                let minHeight = 50;
                let maxHeight = canvas.height - this.gap - minHeight;
                let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
                this.items.push({
                    x: canvas.width,
                    width: 60,
                    top: topHeight,
                    bottom: canvas.height - (topHeight + this.gap),
                    passed: false 
                });
            }

            for (let i = 0; i < this.items.length; i++) {
                let p = this.items[i];
                p.x -= this.dx;

                if (player.x + player.width > p.x && player.x < p.x + p.width &&
                    (player.y < p.top || player.y + player.height > canvas.height - p.bottom)) {
                    gameOver = true;
                }

                if (p.x + p.width < player.x && !p.passed) {
                    score++;
                    p.passed = true;
                }

                if (p.x + p.width <= 0) {
                    this.items.shift();
                    i--;
                }
            }
        }
    };

    // Kontroller
    canvas.addEventListener("click", () => {
        if (gameOver) resetGame();
        else {
            if(!gameStarted) gameStarted = true;
            player.flap();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            if (gameOver) resetGame();
            else {
                if(!gameStarted) gameStarted = true;
                player.flap();
            }
            e.preventDefault(); 
        }
    });

    function resetGame() {
        player.y = 150;
        player.velocity = 0;
        obstacles.items = [];
        score = 0;
        frames = 0;
        gameOver = false;
        gameStarted = true; 
        player.flap();
        // DÜZELTME: loop() buradan kaldırıldı, aksi takdirde oyun her resetlendiğinde 2 kat hızlanıyordu!
    }

    // --- YENİ: 60 FPS HIZ SABİTLEYİCİ ---
    let lastTime = 0;
    const fpsInterval = 1000 / 60; // Oyunu saniyede 60 kareye kilitler

    function loop(timestamp) {
        requestAnimationFrame(loop); // Döngüyü daima canlı tut

        if (!timestamp) timestamp = performance.now();
        let deltaTime = timestamp - lastTime;

        // Eğer 1/60 saniye (yaklaşık 16.6ms) geçtiyse kareyi çiz. (120Hz ekranlar bu anı beklemek zorunda kalır)
        if (deltaTime >= fpsInterval) {
            lastTime = timestamp - (deltaTime % fpsInterval);

            // Ekranı temizle
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (gameOver) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "white";
                ctx.font = "30px Tahoma";
                ctx.fillText("Game Over!", 320, 180);
                ctx.fillText("Score: " + score, 340, 220);
                ctx.fillText("Click to Restart", 300, 260);
                return;
            }

            player.update();
            obstacles.update();
            obstacles.draw();
            player.draw();

            ctx.fillStyle = "white";
            ctx.font = "bold 24px Tahoma";
            ctx.fillText("Score: " + score, 20, 40);

            if(!gameStarted) {
                ctx.fillStyle = "white";
                ctx.font = "20px Tahoma";
                ctx.fillText("Click or Space to Start", 300, 200);
            }

            if(gameStarted) frames++;
        }
    }

    // Görsel yüklendiğinde oyunu başlat
    playerImg.onload = () => {
        requestAnimationFrame(loop);
    };
});