const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


/*
* Variables
*/
let circles = 5;
let radius = 20;
let circleArray = [];
let particularArray = [];
const colors = ['#FFC900', '#29A4E8', '#FF4100', '#1CE840', '#DD0DFF'];
/*
* Event
*/
// Reload circles
const reload = document.getElementById('reload')
reload.addEventListener('click', function(event){
	init()
})
// Window resize
window.addEventListener('resize', function(event){
	init()
	x = innerWidth / 2;
	y = 0 + radius;
}) 
canvas.addEventListener('click', function(event){
	newCircle(event)
}) 

/*
* Circle Draw
*/
function Circle(x,y,dx,dy,radius, color){
	this.x = x;
	this.y = y;
	this.dx = dx;	
	this.dy = dy;
	this.radius = radius;
	this.color = color;
	this.gravity = 0.98;
	this.frequency = .8;
	this.velocity = {
		x:(Math.random() - .5 ) * 15,
		y:5
	};
}

Circle.prototype.smash = function(){
	this.radius -= 3
	for(var i = 0; i< this.radius; i++){
		particularArray.push(new ParticularCircle(this.x, this.y, 0, 0, this.radius*0.1, this.color))
	}
}

Circle.prototype.draw = function(){
	ctx.save()
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	ctx.fillStyle = this.color;
	ctx.shadowBlur = 0;
	ctx.fill()
	ctx.closePath()
	ctx.restore()
}

Circle.prototype.update = function(){
	this.draw();
	
	if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0){
		this.dx = -this.dx
		this.smash()
	}	
	
	if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0){
		this.dy = -this.dy
	}
	
	if(this.y + this.radius + this.velocity.y > canvas.height || this.y - this.radius < 0){
		this.velocity.y = -this.velocity.y * this.frequency
		this.smash()
	}else{
		this.velocity.y += this.gravity
		this.x -= this.dx * 2
	}
	
	this.y += this.velocity.y
	this.x += this.velocity.x
}

/*
* Particular Circles
*/
function ParticularCircle(x,y, dx, dy, radius,color){
	Circle.call(this, x, y, dx, dy, radius, color);
	this.gravity = 0.5;
	this.frequency = .8;
	this.velocity = {
		x:(Math.random() - .5 ) * 25,
		y:(Math.random() - .5) * 25
	};
	this.timeOut = 50;
}

ParticularCircle.prototype.draw = function(){
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.shadowColor = this.color;
	ctx.shadowBlur = 10;
	ctx.closePath();
	ctx.restore()
}

ParticularCircle.prototype.update = function(){
	this.draw();
	
	if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0){
		 this.dx = -this.dx
	}	
	if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0){
		 this.dy = -this.dy
	}
	
	if(this.y + this.radius + this.velocity.y > canvas.height || this.y - this.radius < 0){
		this.velocity.y = -this.velocity.y * this.frequency		
	}else{
		this.velocity.y += this.gravity
		this.x -= this.dx * 2
	}
	
	this.x += this.velocity.x
	this.y += this.velocity.y
	this.timeOut -= 1
}

/*
* Animation Frame
*/
function animate(){
	requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Draw Circle
	circleArray.forEach((circle, index) => {
		circle.update();
		if(circle.radius <= 0){
			circleArray.splice(index,1)	 
		}
	})	
	particularArray.forEach((miniCircle, index) => {
		miniCircle.update();
		if(miniCircle.timeOut <= 0){
			particularArray.splice(index,1)	 
		}
	})
}

/*
* Create Circle Element
*/
function createCircle(){
	circleArray = []
	particularArray = []
	for(var i = 0; i < circles; i++){
		var x = Math.random() * (innerWidth  - 2 * radius) + radius;
		var y = Math.random() * (innerWidth  - 2 * radius) + radius;
		var dx = 1;
		var dy = 1;
		var color = colors[Math.floor(Math.random() * colors.length)];
		circleArray.push(new Circle(x,y,dx,dy, radius, color));
	}
}

/*
* Mouse down: Add new circle
*/
function newCircle(e){
	var x = e.x;
	var y = e.y;
	var dx = 1;
	var dy = 1;
	var color = colors[Math.floor(Math.random() * colors.length)];
	circleArray.push(new Circle(x,y,dx,dy, radius, color));
}
/*
* Initialization
*/
function init(){
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	createCircle()
}

init();
animate();
createCircle()