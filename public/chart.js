let graphCanvas = document.getElementById('graphCanvas')
let ctx = graphCanvas.getContext('2d');

//#region Helper Functions

const clamp = (value, max, min) => {
    return (value > max) ? max : (value < min) ? min : value;
}

const lerpNumber = (a, b, t) => {
    t = (t > 1) ? 1 : (t < 0) ? 0 : t;
    return a + (t * (b - a));
}

//#endregion

//#region "Data" Classes

//#region Vector 2

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

//#endregion

//#region Color
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

const colorFromHex = hexCode => {
    let r = parseInt(hexCode.substring(0, 2), 16);
    let g = parseInt(hexCode.substring(2, 4), 16);
    let b = parseInt(hexCode.substring(4), 16);
    return new Color(r, g, b)
}

//#endregion

//#endregion

//#region "Graph" Classes

//#region GraphBar

class GraphBar {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }

    scaleBar(xScalar, yScalar) {
        return new Vector2(xScalar, yScalar * this.value);
    }

    draw(ctx, position, graphScale) {
        ctx.fillStyle = this.color.getFillColor();
        let scaledBar = this.scaleBar(graphScale.x, graphScale.y);
        ctx.fillRect(position.x - (scaledBar.x / 2), position.y - scaledBar.y, scaledBar.x, scaledBar.y);
    }
}

//#endregion

//#region UserInfo

class UserInfo {
    constructor(imgUrl, messageCount) {
        this.imgUrl = imgUrl;
        this.messageCount = messageCount;
    }

    draw(ctx, position, size) {
        var image = new Image();
        image.onload = () => {
            ctx.drawImage(image, position.x - (size / 2), position.y - (size / 2), size, size);
        };
        image.src = this.imgUrl;
    }
}

//#endregion

//#region BarGraph

class BarGraph {
    constructor(ctx, graphCanvas, barWidth, barMargin, barMaxHeight, barXoffset) {
        this.ctx = ctx;
        this.graphCanvas = graphCanvas;
        this.barWidth = barWidth;
        this.barMargin = barMargin;
        this.barMaxHeight = barMaxHeight;
        this.barXoffset = barXoffset;
        this.users = [];
        this.graphBars = [];
    }

    getUserWithMostPosts() {
        let i = 0;
        this.users.forEach(user => {
            i = user.messageCount > i ? user.messageCount : i;
        });
        return i;
    }

    addUser(user) {
        this.users.push(user);
        this.graphBars.push(new GraphBar(user.messageCount, new Color(0, 255, 0)));
    }

    //#region Draw Functions

    drawGraph() {
        let maxMessages = this.getUserWithMostPosts();
        let barYScale = this.barMaxHeight / maxMessages;
        let canvasWidth = this.barXoffset + (this.barWidth * this.users.length) + (this.barMargin * this.users.length) + this.barMargin;
        this.graphCanvas.width = canvasWidth > 500 ? canvasWidth : 500;
        this.graphCanvas.width = canvasWidth > 500 ? canvasWidth : 500;
        ctx.clearRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);
        let barPosition = new Vector2(this.barMargin + this.barWidth / 2 + this.barXoffset, this.barMaxHeight + this.barMargin);
        let barScale = new Vector2(this.barWidth, barYScale);
        this.graphBars.forEach(bar => {
            bar.draw(this.ctx, barPosition, barScale);
            barPosition.x += (this.barWidth + this.barMargin);
        });
        barPosition.x = this.barMargin + this.barWidth / 2 + this.barXoffset;
        barPosition.y += ((graphCanvas.height - this.barMaxHeight) / 2);
        this.users.forEach(user => {
            let imgPosition = new Vector2(barPosition.x, barPosition.y);
            user.draw(this.ctx, imgPosition, this.barWidth);
            barPosition.x += (this.barWidth + this.barMargin);
        });
        this.drawGraphLines();
        this.drawGraphText(maxMessages);
    }

    drawGraphLines() {
        ctx.beginPath();
        ctx.lineWidth = this.barMargin * 1.6;
        let lineStartX = this.barXoffset - ctx.lineWidth;
        let lineStartY = this.barMargin + (ctx.lineWidth / 2);
        ctx.moveTo(lineStartX - this.barXoffset * .2, lineStartY);
        ctx.lineTo(lineStartX, lineStartY);
        ctx.stroke();
        ctx.lineTo(lineStartX, this.barMaxHeight + ctx.lineWidth);
        ctx.stroke();
        ctx.moveTo(lineStartX - this.barXoffset * .2, this.barMaxHeight + ctx.lineWidth);
        ctx.lineTo(this.graphCanvas.width - this.barMargin, this.barMaxHeight + ctx.lineWidth);
        ctx.stroke();
        ctx.moveTo(lineStartX - this.barXoffset * .2, (this.barMaxHeight + ctx.lineWidth) / 2);
        ctx.lineTo(lineStartX, (this.barMaxHeight + ctx.lineWidth) / 2);
        ctx.stroke();
    }

    drawGraphText(maxMessages) {
        let lineStartX = this.barXoffset - ctx.lineWidth;
        let lineStartY = this.barMargin + (ctx.lineWidth / 2);
        ctx.font = "20px Verdana";
        let c = new Color(0, 0, 0);
        ctx.fillStyle = c.getFillColor();
        ctx.textAlign = 'end';
        ctx.fillText(maxMessages, lineStartX - (this.barXoffset * .2) - this.barMargin, lineStartY + 10, this.barXoffset * .3);
        ctx.fillText(maxMessages / 2, lineStartX - (this.barXoffset * .2) - this.barMargin, (this.barMaxHeight + ctx.lineWidth + 10) / 2, this.barXoffset * .3);
        ctx.fillText(0, lineStartX - (this.barXoffset * .2) - this.barMargin, this.barMaxHeight + ctx.lineWidth + 10, this.barXoffset * .3);
        ctx.save();
        ctx.translate(0, 500);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText("Number of Posts Per User", ((2 * this.graphCanvas.height) - this.barMaxHeight) * .5, (this.barXoffset * .25));
        ctx.restore();
    }

    //#endregion

}

//#endregion

//#endregion

//#region Graph Initialization and Drawing

let graph = new BarGraph(ctx, graphCanvas, 40, 5, 420, 100);
userList.users.forEach(user => {
    graph.addUser(new UserInfo(user.imgUrl, user.messageCount));
});

//#region TEST CODE
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
// graph.addUser(new UserInfo("https://www.bing.com/th?id=OIP.eOa7NeLUCu7SuY19m1oA1QHaFj&w=263&h=197&c=7&o=5&pid=1.7", 3));
//#endregion

graph.drawGraph();

//#endregion