class RubiksCube extends GenRubiks {
    constructor(dict, p) {
        super(3, dict, p);
        this.operationdict = {
            U: {
                axis: 1,
                num: new Set([0]),
                turn: 1,
            },
            D: {
                axis: 1,
                num: new Set([2]),
                turn: 3,
            },
            R: {
                axis: 0,
                num: new Set([2]),
                turn: 1,
            },
            L: {
                axis: 0,
                num: new Set([0]),
                turn: 3,
            },
            F: {
                axis: 2,
                num: new Set([2]),
                turn: 1,
            },
            B: {
                axis: 2,
                num: new Set([0]),
                turn: 3,
            },
            E: {
                axis: 1,
                num: new Set([1]),
                turn: 3,
            },
            M: {
                axis: 0,
                num: new Set([1]),
                turn: 3,
            },
            S: {
                axis: 2,
                num: new Set([1]),
                turn: 1,
            },
            x: {
                axis: 0,
                num: new Set([0, 1, 2]),
                turn: 1,
            },
            y: {
                axis: 1,
                num: new Set([0, 1, 2]),
                turn: 1,
            },
            z: {
                axis: 2,
                num: new Set([0, 1, 2]),
                turn: 1,
            },
        };
        this.aniOpList = [];
    }
    startanimate(cmd) {
        if (!"LRUDBFEMSxyz".includes(cmd[0])) {
            console.log(`undefined operator:${cmd}`);
            return;
        }
        let op = cmd.slice(0, 1);
        let unit_op = this.operationdict[op];
        let direction = unit_op["turn"];
        if (cmd.length >= 2 && cmd.slice(-1) == "'") {
            direction = (direction + 2) % 4;
        } else if (cmd.length >= 2 && cmd.slice(-1) == "2") {
            direction = 2;
        }
        let Layer2 = cmd.slice(1, 2) == "w" ? new Set([1]) : new Set([]);
        super.startanimate(
            unit_op["axis"],
            unit_op["num"].union(Layer2),
            direction
        );
    }
    startanimates(seq) {
        let s = seq
            .replaceAll("l", "Lw")
            .replaceAll("r", "Rw")
            .replaceAll("u", "Uw")
            .replaceAll("d", "Dw")
            .replaceAll("f", "Fw")
            .replaceAll("b", "Bw");
        this.aniOpList = s.split(" ");
    }
    display() {
        super.display();
        if (!this.isAnimating && this.aniOpList.length > 0) {
            this.startanimate(this.aniOpList[0]);
            this.aniOpList.shift();
        }
    }
    importFaces(face) {
        let faces = face;
        for (let i = 0; i < 3; i += 1) {
            for (let j = 0; j < 3; j += 1) {
                this.body[0][i][j].colorlist[0] = faces[0][j][i];
                this.body[2][i][j].colorlist[1] = faces[1][2 - j][i];
                this.body[i][0][j].colorlist[2] = faces[2][i][j];
                this.body[i][2][j].colorlist[3] = faces[3][i][2 - j];
                this.body[i][j][0].colorlist[4] = faces[4][2 - i][j];
                this.body[i][j][2].colorlist[5] = faces[5][i][j];
            }
        }
    }
    exportFaces() {
        let faces = [];
        for (let l = 0; l < 6; l += 1) {
            let face1 = [];
            for (let i = 0; i < 3; i += 1) {
                let row1 = [-1, -1, -1];
                face1.push(row1);
            }
            faces.push(face1);
        }
        for (let i = 0; i < 3; i += 1) {
            for (let j = 0; j < 3; j += 1) {
                faces[0][j][i] = this.body[0][i][j].colorlist[0];
                faces[1][2 - j][i] = this.body[2][i][j].colorlist[1];
                faces[2][i][j] = this.body[i][0][j].colorlist[2];
                faces[3][i][2 - j] = this.body[i][2][j].colorlist[3];
                faces[4][2 - i][j] = this.body[i][j][0].colorlist[4];
                faces[5][i][j] = this.body[i][j][2].colorlist[5];
            }
        }
        return faces;
    }
}
