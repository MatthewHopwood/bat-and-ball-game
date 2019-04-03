var GameCanvas
var DrawContext


var Player1; 
var Player2;
var RectBall = [];

function Bat(x, y, speed, width, height, AI)
{
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.difficulty = 0;
    this.score = 0;
    this.AI = AI;
    this.update = function()
    {
        if (!this.AI)
        {
            if (QKeyDown)
            {
                this.x -= this.speed;
                if (this.x < 50)
                {
                    this.x = 50;
                }
            }
            if (EKeyDown)
            {
                this.x += this.speed;
                if (this.x > 550)
                {
                    this.x = 550;
                }
            } 
        }
        else
        {
            this.updateAI();   
        }
        this.doCollision();
        this.draw();    
    }
    this.updateAI = function()
    {
        var ChosenBall = this.nearestball();

        if (this.y < 250)
        {
            if (RectBall[ChosenBall].vy > 0)
            {
                return;
            }
        }
        else
        {
            if (RectBall[ChosenBall].vy < 0)
            {
                return;
            }
        }
    
        var dx = RectBall[ChosenBall].x - this.x;
        var tolerance = 10;
        
        if (dx < -tolerance)
        {
            this.x -= this.difficulty;
        }
        else if (dx > tolerance)
        {
            this.x += this.difficulty;
        }
    }
    this.doCollision = function()
    {
        for (var t = 0; t < RectBall.length; t++)
        {
            var total_width = RectBall[t].width + this.width;
            var total_height = RectBall[t].height + this.height;
        
            var dx = Math.abs(RectBall[t].x - this.x);
            var dy = Math.abs(RectBall[t].y- this.y);
        
            var MaxV = 400;
            var InitalV = 500;
        
        
            if (dx <= total_width / 2 && dy <= total_height / 2)
            {
                //inverts velocity
                RectBall[t].vy = -RectBall[t].vy;
                RectBall[t].vx += Math.random() * InitalV - InitalV / 2;
        
                if (RectBall[t].vx < - MaxV)
                {
                    RectBall[t].vx = - MaxV;
                }
                if (RectBall[t].vx > MaxV)
                {
                    RectBall[t].vx = MaxV;
                }
                if (this.y < 250)
                {
                    RectBall[t].y = this.y + this.height;
                }
                else
                {
                    RectBall[t].y = this.y - this.height;
                } 
            }
        
        }
    }
    this.draw = function()
    {
        var ctx = DrawContext;
        if (this.y < 250)
        {
            ctx.fillStyle ='rgb(0, 255, 0)';
        }
        else
        {
            ctx.fillStyle ='rgb(0, 0, 255)'; 
        }
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }    
    this.nearestball = function()
    {
        var NearestBall = 0;
        var SmallestDY = 1000;

        for (var t = 0; t < RectBall.length; t++)
        {
            var dy = 0;
            if (this.y < 250)
            {
                dy = RectBall[t].y - this.y;
            }
            else
            {
                dy = this.y - RectBall[t].y;
            }
            if (dy > this.height / 4 && dy < SmallestDY)
            {
                NearestBall = t;
                SmallestDY = dy;
            }
        }
        return NearestBall;
    }   
};

function Ball(x, y, width, height, vx, vy)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = vx;
    this.vy = vy;
    this.update = function()
    {

        // Move Ball
        this.x += this.vx * (1 / 60);
        this.y += this.vy * (1 / 60);
        
        //Ball collision with x and y of canvas
        if (this.x < 0)
        {
            this.vx = -this.vx;
        }
        if (this.x > 600)
        {
            this.vx = -this.vx;
        }
        if (this.y < 0)
        {
            Player2.score += 1;
            this.y = 250;
        }
        if (this.y > 500)
        {
            Player1.score +=1;
            this.y = 250;
            //this.vy = -this.vy;
        }
        this.draw();
    }
    this.draw = function()
    {
        var ctx = DrawContext;

        ctx.fillStyle ='rgb(255, 0, 0)';
        ctx.fillRect(this.x - this.width /2, this.y - this.height / 2, this.width, this.height);
    }
};

var QKeyDown = false
var EKeyDown = false

function StartGame()
{
    window.addEventListener("keydown", HandleKeyDownEvent, true);
    window.addEventListener("keyup", HandleKeyUpEvent, true);
    
    GameCanvas = document.getElementById("game_canvas");
    DrawContext = GameCanvas.getContext("2d");

    Player1 = new Bat(300, 25 ,10, 100, 25, true);
    Player2 = new Bat(300 ,475, 10 ,100, 25, false);
    //Player2.difficulty = 15;
    Player1.difficulty = 8;
    for (var t = 0; t < 1; t++)
    {
        RectBall[t] = new Ball(300, 250, 10, 10, 0, -600);
    }

    MainLoop();
}

function HandleKeyDownEvent(key_event)
{
	if (key_event.key == "q")
	{
		QKeyDown = true;
	}
	else if (key_event.key == "e")
	{
		EKeyDown = true;
	}
	
}

function HandleKeyUpEvent(key_event)
{
	if (key_event.key == "q")
	{
		QKeyDown = false;
	}
	else if (key_event.key == "e")
	{
        EKeyDown = false;
    }
}

function DrawScores()
{
    var ctx = DrawContext;
    ctx.font = '30px Arial';
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillText(Player1.score, 10, 30);
    ctx.fillText(Player2.score, 10, 490);
}

function MainLoop()
{
    var ctx = DrawContext;

    ctx.clearRect(0, 0, 600, 500);
    
    Player1.update();
    Player2.update();
    for (var t = 0; t < RectBall.length; t++)
    {
        RectBall[t].update();
    }
    DrawScores();
    

    setTimeout(MainLoop, 16);
}

window.onload = function (e)
{
    console.log('Game Started');
    StartGame();
}
