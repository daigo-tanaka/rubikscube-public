let csR;
function exportPO() {
    let converted = convert(facecolor, convConst);
    if (converted == null) {
        console.log(
            "入力された状態が正しくありません。面の色をチェックしてください"
        );
        return;
    } else {
        console.log(converted);
    }
}
function cross() {
    let r = convert(facecolor, convConst);
    // let r = new RubiksCubeFlat();
    // r.cp = c[0];
    // r.co = c[1];
    // r.ep = c[2];
    // r.eo = c[3];
    let inputAsObject = document.getElementById("scramble");
    inputAsObject.value = crossSolve(r).history.replaceAll("K", "");
    // let r = scInput.value();
    // csR = r;
}
function exeScramble() {
    console.log(scInput.value());
    rubik1.startanimates(scInput.value());
}
function importFaces() {
    rubik1.importFaces(facecolor);
}
function exportFaces() {
    let exportedFace = rubik1.exportFaces();
    for (let l = 0; l < 6; l += 1) {
        for (let i = 0; i < 3; i += 1) {
            for (let j = 0; j < 3; j += 1) {
                faces[l][i][j].fillcolor = exportedFace[l][i][j];
                facecolor[l][i][j] = faces[l][i][j].fillcolor;
            }
        }
    }
}
function scrOutput() {
    let scramble = generateScramble();
    let myInputAsObject = document.getElementById("seq");
    // let myScrambleAsObject = document.getElementById("scr");
    myInputAsObject.value = scramble;
    // myScrambleAsObject.value = scramble;
}
function solve() {
    // background(220)
    let r = convert(facecolor, convConst);
    console.log(r);
    // let cubeForInput = new RubiksCubeFlat();
    // cubeForInput.seq_operation(scInput.value());
    let crosseSolved = crossSolve(r);
    console.log(crosseSolved.history);
    let f2lSolved = f2lSolve(crosseSolved, f2l);
    console.log(f2lSolved.history);
    let ollSolved = ollSolve(f2lSolved, oll);
    console.log(ollSolved.history);
    let pllSolved = pllSolve(ollSolved, pll);
    console.log(pllSolved.history);
    let inputAsObject = document.getElementById("scramble");
    inputAsObject.value = pllSolved.history.replaceAll("K ", "");
}
function threeMinuteCooking() {
    let presFace = [
        [
            [2, 1, 3],
            [3, 0, 1],
            [3, 3, 3],
        ],
        [
            [4, 2, 0],
            [0, 1, 5],
            [5, 4, 0],
        ],
        [
            [4, 1, 4],
            [3, 2, 0],
            [2, 4, 2],
        ],
        [
            [1, 5, 1],
            [5, 3, 4],
            [2, 2, 3],
        ],
        [
            [1, 3, 5],
            [0, 4, 1],
            [0, 2, 4],
        ],
        [
            [0, 5, 5],
            [2, 5, 0],
            [1, 4, 5],
        ],
    ];
    for (let l = 0; l < 6; l += 1) {
        for (let i = 0; i < 3; i += 1) {
            for (let j = 0; j < 3; j += 1) {
                faces[l][i][j].fillcolor = presFace[l][i][j];
            }
        }
    }
}
let faces = [];
let facecolor = [];
let colordict;
let poslist1 = [];
let e_len = 20;
let gap = 5;
let sgap = 1.5;
let currentcolor = -1;
let cbutton;
let convbutton;
let convConst;
let solveButton;
let scInput;
let scExe;

let rubik1;
let cam;
let input1;
let button1;
let button2;

function sketch1(p) {
    p.preload = function () {
        colordict = {
            0: p.color(255, 125, 0),
            1: p.color(255, 0, 0),
            2: p.color(255, 255, 255),
            3: p.color(255, 255, 0),
            4: p.color(0, 0, 255),
            5: p.color(0, 220, 50),
            6: p.color(90),
        };
        convConst = p.loadJSON("data/convert.json");
        jsonPll = p.loadJSON("data/pll.json");
        jsonOll = p.loadJSON("data/oll.json");
        jsonF2l = p.loadJSON("data/f2l.json");
    };
    p.setup = function () {
        f2l = [...Array(Object.keys(jsonF2l).length)].map(
            (_, i) => jsonF2l[`${i}`]
        );
        oll = [...Array(Object.keys(jsonOll).length)].map(
            (_, i) => jsonOll[`${i}`]
        );
        pll = [...Array(Object.keys(jsonPll).length)].map(
            (_, i) => jsonPll[`${i}`]
        );
        // console.log(f2l)
        let canvas = p.createCanvas(400, 400);
        canvas.parent("container1");
        poslist1 = [
            [10 + 3 * e_len + 2 * sgap + gap, 20],
            [
                10 + 3 * e_len + 2 * sgap + gap,
                20 + (3 * e_len + 2 * sgap + gap) * 2,
            ],
            [10, 20 + (3 * e_len + gap + 2 * sgap) * 1],
            [
                10 + (3 * e_len + 2 * sgap + gap) * 2,
                20 + (3 * e_len + 2 * sgap + gap) * 1,
            ],
            [
                10 + (3 * e_len + 2 * sgap + gap) * 1,
                20 + (3 * e_len + 2 * sgap + gap) * 3,
            ],
            [
                10 + (3 * e_len + 2 * sgap + gap) * 1,
                20 + (3 * e_len + 2 * sgap + gap) * 1,
            ],
        ];
        for (let l = 0; l < 6; l += 1) {
            let face1 = [];
            let face2 = [];
            for (let i = 0; i < 3; i += 1) {
                let row1 = [];
                let row2 = [-1, -1, -1];
                for (let j = 0; j < 3; j += 1) {
                    let b = new InputButton(
                        p,
                        poslist1[l][1] + (e_len + sgap) * i,
                        poslist1[l][0] + (e_len + sgap) * j,
                        e_len,
                        colordict
                    );
                    b.fillcolor = l;
                    row1.push(b);
                }
                face1.push(row1);
                face2.push(row2);
            }
            face1[1][1].fillcolor = l;
            face2[1][1] = l;
            faces.push(face1);
            facecolor.push(face2);
        }
        cbutton = new Choosecolor(p, 0, 250, colordict, e_len, gap);
        p.noStroke();

        // scExe = p.createButton("geberate scramble");
        // scExe.mousePressed(scrOutput);
        // scExe.position(20, p.height - 80);

        // convbutton = p.createButton("convert");
        // convbutton.position(20, p.height - 20);
        // convbutton.mousePressed(exportPO);

        // convbutton = p.createButton("input");
        // convbutton.position(20, p.height - 20);
        // convbutton.mousePressed(threeMinuteCooking);

        solveButton = p.createButton("solve");
        solveButton.position(20, p.height - 40);
        solveButton.mousePressed(solve);

        scInput = p.createInput();
        scInput.position(20, p.height - 60);
        scInput.id("scramble");
    };
    p.draw = function () {
        p.background(155);
        for (let l = 0; l < 6; l += 1) {
            for (let i = 0; i < 3; i += 1) {
                for (let j = 0; j < 3; j += 1) {
                    faces[l][i][j].display();
                    if (faces[l][i][j].ispressed && i * j != 1) {
                        faces[l][i][j].fillcolor = cbutton.colorcode;
                    }
                    facecolor[l][i][j] = faces[l][i][j].fillcolor;
                }
            }
        }
        cbutton.display();
    };
}

function sketch2(p) {
    p.setup = function () {
        let canvas = p.createCanvas(400, 400, p.WEBGL);
        canvas.parent("container2");
        p.background(155);
        p.fill(0);
        p.stroke(255);
        p.strokeWeight(0.5);
        rubik1 = new RubiksCube(colordict, p);
        cam = p.camera(0, -20 * 3, 50 * 3);
        input1 = p.createInput();
        input1.id("seq");
        input1.position(460, 30);
        button1 = p.createButton("import");
        button1.position(460, p.height - 30);
        button1.mousePressed(importFaces);
        button2 = p.createButton("export");
        button2.mousePressed(exportFaces);
        button2.position(460, p.height - 50);
    };
    p.draw = function () {
        p.background(155);
        rubik1.display();
    };
    p.keyPressed = function () {
        if (p.key == "ArrowRight") {
            rubik1.movespeed -= 1;
            if (rubik1.movespeed < 0) {
                rubik1.movespeed = 0;
            }
            console.log(rubik1.movespeed);
        }
        if (p.key == "ArrowLeft") {
            rubik1.movespeed += 1;
            if (rubik1.movespeed > 10) {
                rubik1.movespeed = 10;
            }
            console.log(rubik1.movespeed);
        }
        if (p.key == "Enter") {
            rubik1.startanimates(input1.value());
        }
        if (
            !(
                document.getElementById("seq") === document.activeElement ||
                document.getElementById("scramble") === document.activeElement
            )
        ) {
            let k = "xyzXYZ".includes(p.key)
                ? p.key.toLowerCase()
                : p.key.toUpperCase();
            if (Object.keys(rubik1.operationdict).includes(k)) {
                let c = "";
                if (p.keyIsDown(16)) {
                    let inv = "'";
                    if (p.keyIsDown(87)) {
                        c = k + "w" + inv;
                    } else {
                        c = k + inv;
                    }
                } else if (p.keyIsDown(87)) {
                    c = k + "w";
                } else {
                    c = k;
                }
                // console.log(`cmd:${c}`);
                rubik1.startanimate(c);
            }
        }
    };
}
new p5(sketch1);
new p5(sketch2);
