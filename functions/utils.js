function listIsEquall(list1, list2) {
    if (typeof list1 != typeof list2 && typeof list1 != "object") {
        return;
    }
    return list1.length == list2.length
        ? list1.every((v, i) => v == list2[i])
        : false;
}
function listSum(list) {
    return list.reduce((sum, element) => sum + element, 0);
}
function rangeList(length) {
    return [...Array(length)].map((_, i) => i);
}
function setIsEquall(set1, set2) {
    return set1.isSubsetOf(set2) && set2.isSubsetOf(set1);
}
function permSign(perm) {
    let sign = 0;
    for (let i = 0; i < perm.length; i += 1) {
        for (let j = 0; j < perm.length; j += 1) {
            let s_i = (i - j) * (perm.indexOf(i) - perm.indexOf(j));
            if (s_i < 0) {
                sign += 1;
            }
        }
    }
    return (sign / 2) % 2;
}
function generateScramble() {
    let scramlbeLength = Math.random() * 10 + 30;
    // console.log(scramlbeLength);
    let ops = ["L", "R", "U", "D", "B", "F"];
    let suffs = ["", "'", "2"];
    let s = "k";
    while (s.split(" ").length <= scramlbeLength) {
        let o = ops[Math.floor(Math.random() * 6)];
        let sf = suffs[Math.floor(Math.random() * 3)];
        // console.log(o +" "+ sf )
        if (o != s.split(" ").slice(-1)[0].slice(0, 1)) {
            // console.log(s.split(" ").slice(-1)[0].slice(0,1));
            s += " " + o + sf;
            // console.log(s)
        }
    }
    return s.replace("k ", "");
}
//二つの面の入れ替えを判定できるようにすること
function convert(faces, convConst) {
    let corner = [];
    let edge = [];
    let cp = Array(8).fill(-1);
    let co = Array(8).fill(-1);
    let ep = Array(12).fill(-1);
    let eo = Array(12).fill(-1);
    let cornerColor = convConst["cornerColor"];
    let edgeColor = convConst["edgeColor"];
    let surfaceIndexCorner = convConst["surfaceIndexCorner"];
    let surfaceIndexEdge = convConst["surfaceIndexEdge"];
    for (let i = 0; i < 8; i += 1) {
        let c = surfaceIndexCorner[i];
        corner.push([
            faces[cornerColor[i][0]][c[0][0]][c[0][1]],
            faces[cornerColor[i][1]][c[1][0]][c[1][1]],
            faces[cornerColor[i][2]][c[2][0]][c[2][1]],
        ]);
    }
    for (let i = 0; i < 12; i += 1) {
        let s = surfaceIndexEdge[i];
        edge.push([
            faces[edgeColor[i][0]][s[0][0]][s[0][1]],
            faces[edgeColor[i][1]][s[1][0]][s[1][1]],
        ]);
    }
    for (let i = 0; i < 8; i += 1) {
        let cube = corner[i];
        let c = new Set(cube);
        for (let j = 0; j < 8; j += 1) {
            let color = new Set(cornerColor[j]);
            if (setIsEquall(c, color)) {
                cp[i] = j;
            }
        }
        co[i] = cube.includes(2)
            ? cube.findIndex((val) => val === 2)
            : cube.findIndex((val) => val === 3);
    }

    for (let i = 0; i < 12; i += 1) {
        // print(edge[i])
        let cube = edge[i];
        let c = new Set(edge[i]);
        for (let j = 0; j < 12; j += 1) {
            let color = new Set(edgeColor[j]);
            if (setIsEquall(c, color)) {
                ep[i] = j;
            }
        }
        if (cube.includes(2)) {
            eo[i] = cube.findIndex((val) => val === 2);
        } else if (cube.includes(3)) {
            eo[i] = cube.findIndex((val) => val === 3);
        } else if (cube.includes(4)) {
            eo[i] = cube.findIndex((val) => val === 4);
        } else if (cube.includes(5)) {
            eo[i] = cube.findIndex((val) => val === 5);
        }
    }
    console.log([cp, co, ep, eo]);
    //存在しない色の組み合わせ
    if (
        cp.includes(-1) ||
        ep.includes(-1) ||
        co.includes(-1) ||
        eo.includes(-1)
    ) {
        console.log("色の組み合わせが正しくありません");
        return;
    }
    //coパリティ
    let co_pari = co.reduce((sum, element) => sum + element, 0) % 3 === 0;
    //eoパリティ
    let eo_pari = eo.reduce((sum, element) => sum + element, 0) % 2 === 0;
    //cp,ep奇偶の一致
    let cp_ep_sign = permSign(cp) == permSign(ep);
    if (!co_pari) {
        console.log("エラー：コーナーキューブの向きが正しくありません");
        return;
    }
    if (!eo_pari) {
        console.log("エラー：エッジキューブの向きが正しくありません");
        return;
    }
    if (!cp_ep_sign) {
        console.log("エラー：キューブの位置が正しくありません");
        return;
    }
    let convertedCube = new RubiksCubeFlat();
    convertedCube.cp = cp;
    convertedCube.co = co;
    convertedCube.ep = ep;
    convertedCube.eo = eo;
    return convertedCube;
}
//手順の並びが冗長かどうか判定
function isSeqRedundant(seqOp) {
    let seq = seqOp;
    let opsWithDouble = ["L", "R", "U", "D", "B", "F"]
        .map((op) => [op, op + "w"])
        .flat();
    let opsNoDouble = ["x", "y", "z", "M", "E", "S"];
    let ops = opsWithDouble.concat(opsNoDouble);
    // let suffix = ["", "2", "'"];
    let simpSuffs = {
        0: [
            ["", "'"],
            ["2", "2"],
            ["'", ""],
        ],
        "": [
            ["2", "'"],
            ["'", "2"],
        ],
        2: [
            ["", ""],
            ["'", "'"],
        ],
        "'": [
            ["", "2"],
            ["2", ""],
        ],
    };
    for (let op of ops) {
        for (let sufKey of Object.keys(simpSuffs)) {
            let suffList = simpSuffs[sufKey];
            for (let suffs of suffList) {
                if (seq.includes(op + suffs[0] + " " + op + suffs[1])) {
                    return true;
                }
            }
        }
    }
    return false;
}
//操作の並びがルービックキューブの手順として正しいか判定
function isSeqRegal(seqOp) {
    let opList = seqOp.split(" ").filter();
    let opsWithDouble = ["L", "R", "U", "D", "B", "F"]
        .map((op) => [op, op + "w"])
        .flat();
    let opsNoDouble = ["x", "y", "z", "M", "E", "S"];
    let ops = opsWithDouble.concat(opsNoDouble);
    let opsWithSuffs = ops.map((v) => [v, v + "2", v + "'"]).flat();
    return opList.every((op) => opsWithSuffs.includes(op));
}
//冗長な操作の並びを簡略化
function Simplify(seqOp) {
    let seq = seqOp;
    console.log(seq);
    let opsWithDouble = ["L", "R", "U", "D", "B", "F"]
        .map((op) => [op, op + "w"])
        .flat();
    let opsNoDouble = ["x", "y", "z", "M", "E", "S"];
    let ops = opsWithDouble.concat(opsNoDouble);
    // let suffix = ["", "2", "'"];
    let simpSuffs = {
        0: [
            ["", "'"],
            ["2", "2"],
            ["'", ""],
        ],
        "": [
            ["2", "'"],
            ["'", "2"],
        ],
        2: [
            ["", ""],
            ["'", "'"],
        ],
        "'": [
            ["", "2"],
            ["2", ""],
        ],
    };
    // A +(A||A2||A') 2,3,0
    //A2+(A||A2||A')3,0,1
    //A'+(A||A2||A')0,1,2
    // let isRedundant = false;
    while (isSeqRedundant(seq)) {
        for (let op of ops) {
            for (let sufKey of Object.keys(simpSuffs)) {
                let suffList = simpSuffs[sufKey];
                if (sufKey == 0) {
                    for (let suffs of suffList) {
                        seq = seq.replaceAll(
                            op + suffs[0] + " " + op + suffs[1],
                            ""
                        );
                    }
                } else {
                    for (let suffs of suffList) {
                        seq = seq.replaceAll(
                            op + suffs[0] + " " + op + suffs[1],
                            op + sufKey
                        );
                    }
                }
            }
        }
        seq = seq.replaceAll("  ", " ");
        console.log(isSeqRedundant(seq), seq);
    }
    return seq;
}
