let ctx = document.getElementById('graphCanvas').getContext('2d');

const clamp = (value, max, min) => {
    return (value > max) ? max : (value < min) ? min : value;
}

const lerpNumber = (a, b, t) => {
    t = (t > 1) ? 1 : (t < 0) ? 0 : t;
    return a + (t * (b - a));
}


class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vec2) {
        let x = this.x;
        let y = this.y;
        x += vec2.x;
        y += vec2.y;
        return new Vector2(x, y);
    }

    scale(scalar) {
        let x = this.x;
        let y = this.y;
        x += scalar;
        y += scalar;
        return new Vector2(x, y);
    }

    scale(xScalar, yScalar) {
        let x = this.x;
        let y = this.y;
        x *= xScalar;
        y *= yScalar;
        return new Vector2(x, y);
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    getFillColor() {
        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }
}

class GraphBar {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }

    //Scale Bar Relative to Canvas Size - Scalars are Relative Graph Units
    scaleBar(xScalar, yScalar) {
        return new Vector2(xScalar, yScalar * value);
    }

    draw(ctx, position, graphScale) {
        ctx.fillStyle = color.getFillColor();
        let scaledBar = scaleBar(graphScale.x, graphScale.y);
        ctx.fillRect(position.x - (scaledBar.x / 2), position.y - scaledBar.y, scaledBar.x, scaledBar.y);
    }
}

class BarGraph {
    constructor() {
        
    }
}