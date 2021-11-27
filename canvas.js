class Canvas {
    constructor(element, bulletColor, cannonColor, radius = 20, height = 400, width = 700) {
        this.element = element;
        this.bulletColor = bulletColor;
        this.cannonColor = cannonColor;
        this.mouse = {}
        this.isMouseDown = false;
        this.hasCannon = false;
        this.cannon = new Cannon();
        this.radius = radius;
        this.height = height;
        this.width = width;
        this.bullets = [];
    }

    createCanvas() {
        const { el, c } = this._createCanvasOnElement(this.element, this.width, this.height);
        const ctx = c.getContext("2d")

        c.addEventListener("mousemove", (e) => this._handleMousemove(e, c))

        c.addEventListener("mousedown", (e) => this._handleMouseDown(e, el, ctx))

        c.addEventListener("mouseup", (e) => this._handleMouseUp(e, el, ctx))

        return el
    }
    _createCanvasOnElement(element, width, height) {
        const el = document.createElement(element);
        const c = document.createElement("canvas");
        el.style.width = width + "px"
        el.style.height = height + "px"
        el.my = {}
        el.my.width = width
        el.my.height = height
        c.width = el.my.width;
        c.height = el.my.height;
        c.style.border = "2px solid " + this.cannonColor;
        el.appendChild(c);


        return { el, c }
    }
    _handleMouseDown(e, el, ctx) {
        this.isMouseDown = true;
        //console.log("this.isMouseDown: ", this.isMouseDown);
        //console.log("this.hasCannon: ", this.isMouseDown);
        if (this.isMouseDown && !this.hasCannon) {
            //console.log("Create cannon");
            this.cannon = new Cannon(this.radius, this.cannonColor, this.mouse)
            this.cannon.draw(ctx, el)
            this.hasCannon = true
        }
        else if (this.isMouseDown && this.hasCannon) {
            if (ctx.isPointInPath(this.cannon.circle, this.mouse.x, this.mouse.y)) {
                //console.log("Remove Cannon");
                this.cannon.remove(e, ctx, el, this.hasCannon);
                this.hasCannon = false;
                this.bullets = []
            }
            else {
                const angle = Math.atan2(
                    this.mouse.y - this.cannon.coordinates.y,
                    this.mouse.x - this.cannon.coordinates.x)
                //console.log(angle);
                const velocity = {
                    x: Math.cos(angle),
                    y: Math.sin(angle),
                }
                // const buls = [];
                this.bullets.push(new Bullet(this.bulletColor, this.cannon, this.mouse, velocity));
                //this.bullets.forEach(bul => bul.animate(ctx, el, this.bullets))
                new Bullet(this.bulletColor, this.cannon, this.mouse, velocity).animate(ctx, el, this.bullets)
            }
        }

    }
    _handleMouseUp(e, el, ctx) {
        this.isMouseDown = false;
    }
    _handleMousemove(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        this.mouse = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }
}

class Cannon {
    constructor(radius, cannonColor, mouse) {
        this.radius = radius;
        this.cannonColor = cannonColor;
        this.coordinates = mouse;
        this.circle = new Path2D();
    }
    draw(ctx, el) {
        ctx.beginPath();
        this.circle.arc(this.coordinates.x, this.coordinates.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.cannonColor;
        ctx.fill(this.circle);
    }
    remove(e, ctx, el) {
        ctx.clearRect(0, 0, el.my.width, el.my.height);
    }
}

class Bullet {
    constructor(bulletColor, cannon, coordinates, velocity) {
        this.bulletColor = bulletColor;
        this.cannon = cannon;
        this.mouse = coordinates;
        this.bullet = new Path2D();
        this.x = this.cannon.coordinates.x
        this.y = this.cannon.coordinates.y
        this.velocity = velocity
    }

    draw(ctx, el) {
        ctx.beginPath();
        this.bullet.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.bulletColor;
        ctx.fill(this.bullet);
    }

    update(ctx, el) {
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.draw(ctx, el)
    }

    animate(ctx, el, bullets) {
        requestAnimationFrame(() => this.animate(ctx, el, bullets))
        ctx.clearRect(0, 0, el.my.width, el.my.height);
        this.cannon.draw(ctx, el)
        this.update(ctx, el)
        bullets.forEach(bul => bul.update(ctx, el))
    }
}

function main() {
    let c = new Canvas("div", "blue", "red")
    document.getElementById("myDiv").appendChild(c.createCanvas());

}