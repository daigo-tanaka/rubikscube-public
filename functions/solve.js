function cross_eq(r1, r2) {
    let i1 = [...Array(4)].map((_, k) => r1.ep.indexOf(k)); //[r1.ep.index(k) for k in range(4)]
    let i2 = [...Array(4)].map((_, k) => r2.ep.indexOf(k));
    let e = [...Array(4)].map((_, k) => r1.eo[i1[k]] == r2.eo[i1[k]]); //[r1.eo[i1[k]] == r2.eo[i2[k]] for k in range(4)]
    let s = i1.every((v, i) => v == i2[i]);
    return s && e.every((_) => _);
}
console.clear();
function crossSolve(inputState) {
    let ops = [
        "L",
        "R",
        "U",
        "D",
        "B",
        "F",
        "L'",
        "R'",
        "U'",
        "D'",
        "B'",
        "F'",
        "L2",
        "R2",
        "U2",
        "D2",
        "B2",
        "F2",
    ];
    let state = [];

    let rubiks1 = new RubiksCubeFlat();
    if (typeof inputState == "string") {
        rubiks1.seq_operation(inputState);
    } else {
        rubiks1 = inputState;
    }
    rubiks1.history = "K ";
    let nr = rubiks1.copy();
    for (let l = 0; l < 4; l += 1) {
        console.log(`cross:${l}`);
        if (nr.isCrossDone(l)) {
            continue;
        }
        state = [nr];
        for (let i = 0; i < 4; i += 1) {
            //4手の間に
            // console.log(i);
            let isout = false;
            let new_s = [];
            for (let j = 0; j < state.length; j += 1) {
                let s = state[j];
                let isend = false;
                for (op of ops.filter((v) => v != s.history.split(" ")[-1])) {
                    let r = s.copy();
                    r.seq_operation(op);
                    if (!state.concat(new_s).some((v) => cross_eq(v, r))) {
                        new_s.push(r);
                        if (r.isCrossDone(l)) {
                            // console.log(r, r.history);
                            nr = r.copy();
                            isend = true;
                            isout = true;
                            break;
                        }
                    }
                }
                if (isend) {
                    break;
                }
            }
            state = state.concat(new_s);
            if (isout) {
                break;
            }
        }
    }
    console.log("cross done");
    return nr;
}

function f2lSolve(state, f2l) {
    let cubeForCheck = state.copy();
    cubeForCheck.seq_operation("z2 y'");
    for (let i = 0; i < 4; i += 1) {
        // console.log(i);
        if (cubeForCheck.isF2lDone(i)) {
            continue;
        }
        if (!cubeForCheck.isF2lRegular(i)) {
            cubeForCheck = f2lNormalize(cubeForCheck, i);
        } else {
            console.log("regular");
        }
        let found = false;
        for (let uAdj of ["", "U", "U'", "U2"]) {
            for (let f2lOp of f2l) {
                let cubeForF2l = cubeForCheck.copy();
                // console.log(op)
                cubeForF2l.seq_operation(uAdj + " " + f2lOp);
                if (f2lOp == "Rw' U2 R2 U R2' U Rw") {
                    // console.log(uAdj)
                    // console.log(`f2l:${f2l.indexOf(f2lOp)}`, cubeForF2l);
                }
                if (cubeForF2l.isF2lDone(i)) {
                    found = true;
                    console.log(`found:${uAdj + " " + f2lOp}`);
                    // console.log(uAdj + " " + f2lOp);
                    cubeForCheck = cubeForF2l.copy();
                }
            }
        }
        if (!found) {
            console.log("f2l not found");
            // console.log(cubeForCheck);
        }
        // console.log(cubeForCheck);
        // console.log(cubeForCheck.history);
        cubeForCheck.seq_operation("y");
    }
    console.log("cross done")
    return cubeForCheck;
}
function f2lNormalize(state, index) {
    if (state.isF2lRegular(index)) {
        return state;
    }
    // console.log("not regular");
    let adjList = [
        "",
        "R U R'",
        "R U' R'",
        "R U2 R'",
        "L U L'",
        "L U' L'",
        "L U2 L'",
        "F U F'",
        "F U' F'",
        "F U2 F'",
        "B U B'",
        "B U' B'",
        "B U2 B'",
    ];
    let cubeForNormalize = new RubiksCubeFlat();
    let adjFound=false
    for (let adjOp1 of adjList) {
        for (let adjOp2 of adjList) {
            let foradj = state.copy();
            foradj.seq_operation(adjOp1 + " " + adjOp2);
            if (foradj.isF2lRegular(index)) {
                cubeForNormalize = foradj;
                adjFound=true
            }
        }
    }
    if (!adjFound){
        console.log("adj not found")
    }
    return cubeForNormalize;
}

function ollSolve(state, OLL) {
    let cubeForOll;
    // let OLL = loadJSON("data/oll.json");
    for (let ollOp of OLL) {
        // console.log(o)
        for (let t of ["", "U", "U2", "U'"]) {
            let forAdj1 = state.copy();
            forAdj1.seq_operation(t + " " + ollOp);
            for (let uAdj of ["", "U", "U2", "U'"]) {
                let forAdj2 = forAdj1.copy();
                forAdj2.seq_operation(uAdj);
                if (!forAdj2.isAllF2lDone()) {
                    // console.log(ollOp);
                }
                if (forAdj2.isOllDone()) {
                    //s1.isOllDone()) {
                    // console.log("found");
                    cubeForOll = forAdj2.copy();
                }
            }
        }
    }
    if (!cubeForOll.isOllDone()) {
        // console.log("not found");
        console.log(cubeForOll.history);
        return null;
    }
    console.log("oll done")
    return cubeForOll;
}
function pllSolve(state, PLL) {
    let nr;
    // let PLL = loadJSON("data/pll.json");
    for (let p of PLL) {
        for (let t of ["", "U", "U2", "U'"]) {
            let s = state.copy();
            s.seq_operation(t + " " + p);
            for (let a of ["", "U", "U2", "U'"]) {
                let s1 = s.copy();
                s1.seq_operation(a);
                // console.log(
                //     listSum(s1.co) == 0 &&
                //         listIsEquall(s1.cp, rangeList(8)) &&
                //         listSum(s1.eo) == 0 &&
                //         listIsEquall(s1.ep, rangeList(12))
                //         ? p
                //         : ""
                // );
                if (
                    listSum(s1.co) == 0 &&
                    listIsEquall(s1.cp, rangeList(8)) &&
                    listSum(s1.eo) == 0 &&
                    listIsEquall(s1.ep, rangeList(12))
                ) {
                    nr = s1.copy();
                    console.log("pll done")
                }
            }
        }
    }
    return nr;
}
