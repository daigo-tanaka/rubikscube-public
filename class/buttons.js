class InputButton {
    constructor(p, x, y, e_len, colordict) {
        this.p = p;
        this.fillcolor = 6;
        this.colordict = colordict;
        this.e_len = e_len;
        this.x = x;
        this.y = y;
        this.ispressed = false;
    }
    display() {
        this.p.fill(this.colordict[`${this.fillcolor}`]);
        this.p.rect(this.x, this.y, this.e_len, this.e_len);
        this.ispressed =
            this.p.mouseIsPressed &&
            this.x <= this.p.mouseX &&
            this.p.mouseX <= this.x + this.e_len &&
            this.y <= this.p.mouseY &&
            this.p.mouseY <= this.y + this.e_len;
    }
}
class Choosecolor {
    constructor(p, x, y, colordict, e_len, gap) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.colorcode = 0;
        this.colordict = colordict;
        this.e_len = e_len;
        this.gap = gap;
        this.poslist = [
            [10 + x, y],
            [35 + this.gap + x, y],
            [60 + 2 * this.gap + x, y],
            [85 + 3 * this.gap + x, y],
            [110 + 4 * this.gap + x, y],
            [135 + 5 * this.gap + x, y],
            // [160 + 6 * this.gap + x, y],
        ];
    }
    display() {
        for (let i = 0; i < 6; i += 1) {
            let code = i;
            this.p.fill(this.colordict[`${code}`]);
            this.p.rect(
                this.poslist[i][0],
                this.poslist[i][1],
                this.e_len,
                this.e_len
            );
            if (
                this.p.mouseIsPressed &&
                this.poslist[i][0] <= this.p.mouseX &&
                this.p.mouseX <= this.poslist[i][0] + this.e_len &&
                this.poslist[i][1] <= this.p.mouseY &&
                this.p.mouseY <= this.poslist[i][1] + this.e_len
            ) {
                this.colorcode = code;
            }
        }
        this.p.fill(this.colordict[this.colorcode]);
        this.p.circle(this.p.mouseX, this.p.mouseY, 5);
    }
}
