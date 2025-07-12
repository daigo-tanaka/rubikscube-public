class SubCube {
    constructor(p, id, colorlist, colordict, size) {
        this.p = p;
        this.id = id;
        this.colorlist = colorlist;
        this.colordict = colordict;
        this.size = size;
        this.turnperm = {
            0: [2, 4, 3, 5],
            1: [0, 4, 1, 5],
            2: [0, 2, 1, 3],
        };
    }
    #permutation(array, perm, power = 1) {
        let permed = [...array];
        for (let i = 0; i < perm.length; i += 1) {
            let p_index = perm[(i + power) % perm.length];
            permed[p_index] = array[perm[i]];
        }
        return permed;
    }

    turn(num, axis) {
        this.colorlist = this.#permutation(
            this.colorlist,
            this.turnperm[axis],
            num
        );
    }
    display() {
        this.p.push();
        // noStroke()
        this.p.rectMode(this.p.CENTER);
        this.p.strokeWeight(0.3);
        this.p.fill(0, 0, 0);
        for (let k = 0; k < 6; k += 1) {
            this.p.push();
            if (this.p.floor(k / 2) == 0) {
                this.p.rotateY(this.p.PI / 2);
                this.p.translate(-this.size / 2, this.size / 2, 0);
            } else if (this.p.floor(k / 2) == 1) {
                this.p.rotateX(-this.p.PI / 2);
                this.p.translate(this.size / 2, -this.size / 2, 0);
            } else if (this.p.floor(k / 2) == 2) {
                this.p.translate(this.size / 2, this.size / 2, 0);
            }
            if (k % 2 == 1) {
                this.p.translate(0, 0, this.size);
            }
            if (this.colorlist[k] != 6) {
                this.p.fill(this.colordict[this.colorlist[k]]);
            }
            if (this.colorlist[k] == 6) {
                this.p.noFill();
            }
            this.p.rect(0, 0, this.size);
            this.p.pop();
        }
        this.p.pop();
    }
    copy() {
        return new SubCube(
            this.p,
            this.id,
            [...this.colorlist],
            this.colordict,
            this.size
        );
    }
}
