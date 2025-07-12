class RubiksCubeFlat {
    constructor() {
        //変更されないもの
        // 単位操作
        this.unit_ops = {
            U: {
                c_perm: [0, 1, 2, 3],
                e_perm: [0, 1, 2, 3],
                c_tws: [0, 0, 0, 0, 0, 0, 0, 0],
                e_tws: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            D: {
                c_perm: [4, 7, 6, 5],
                e_perm: [8, 11, 10, 9],
                c_tws: [0, 0, 0, 0, 0, 0, 0, 0],
                e_tws: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            R: {
                c_perm: [0, 3, 7, 4],
                e_perm: [3, 7, 11, 4],
                c_tws: [2, 0, 0, 1, 1, 0, 0, 2],
                e_tws: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            L: {
                c_perm: [1, 5, 6, 2],
                e_perm: [1, 5, 9, 6],
                c_tws: [0, 1, 2, 0, 0, 2, 1, 0],
                e_tws: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            F: {
                c_perm: [0, 4, 5, 1],
                e_perm: [0, 4, 8, 5],
                c_tws: [1, 2, 0, 0, 2, 1, 0, 0],
                e_tws: [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
            },
            B: {
                c_perm: [3, 2, 6, 7],
                e_perm: [6, 10, 7, 2],
                c_tws: [0, 0, 1, 2, 0, 0, 2, 1],
                e_tws: [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0],
            },
        };
        // 持ち替えのためのcenterの番号付け
        this.num_to_center = { 0: "L", 1: "R", 2: "U", 3: "D", 4: "B", 5: "F" };
        this.center_to_num = { F: 5, B: 4, D: 3, U: 2, R: 1, L: 0 };

        // 持ち替えによるcenterの置換
        this.unit_rotation = {
            x: [2, 4, 3, 5],
            y: [0, 4, 1, 5],
            z: [0, 2, 1, 3],
        };
        // 持ち替えのためのsliceMoveの番号付け
        this.num_to_slice = {
            0: "M",
            1: "M'",
            2: "E",
            3: "E'",
            4: "S",
            5: "S'",
        };
        this.slice_to_num = { "S'": 5, S: 4, "E'": 3, E: 2, "M'": 1, M: 0 };
        // 2層回しのため
        this.double_rotate = ["x", "y", "z"];

        // 持ち替えによるsliceMoveの置換
        this.perm_slice = {
            x: [2, 4, 3, 5],
            y: [0, 5, 1, 4],
            z: [0, 3, 1, 2],
        };
        //以下変更されるもの
        // コーナーキューブの位置
        this.cp = [...Array(8)].map((_, i) => i);
        // コーナーキューブの向き
        this.co = Array(8).fill(0);
        // エッジキューブの位置
        this.ep = [...Array(12)].map((_, i) => i);
        // エッジキューブの向き
        this.eo = Array(12).fill(0);
        // 持ち替えの置換
        this.center = [...Array(6)].map((_, i) => i);
        this.history = "";
    }
    _permutation(array, perm, power = 1) {
        let permed = [...array];
        for (let i = 0; i < perm.length; i += 1) {
            let p_index = perm[(i + power) % perm.length];
            permed[p_index] = array[perm[i]];
        }
        return permed;
    }

    _cyclic_op(array, cycles, mod) {
        let zipped = [...Array(array.length)].map((_, i) => [
            array[i],
            cycles[i],
        ]);
        let operated = zipped.map((value) => (value[0] + value[1]) % mod);
        return operated;
    }

    unit_operation(cmd) {
        let times = 0;
        let raw_op = cmd[0];
        // console.log(cmd)
        if (cmd.length == 1) {
            times = 1;
        } else if (cmd.slice(-1) == "2") {
            times = 2;
        } else if (cmd.slice(-1) == "'") {
            times = 3;
        } else {
            console.log(`unkonwn suffix:${cmd.slice(1, cmd.length)}`);
            return;
        }
        if ("UFRDBL".includes(raw_op)) {
            // 持ち替えの状態によって操作が変わる
            // console.log(raw_op);
            let str_op =
                this.num_to_center[this.center[this.center_to_num[raw_op]]];
            // console.log(str_op)
            let op = this.unit_ops[str_op];
            // console.log(op);
            for (let i = 0; i < times; i += 1) {
                this.cp = this._permutation(this.cp, op["c_perm"]);
                this.ep = this._permutation(this.ep, op["e_perm"]);
                this.co = this._permutation(this.co, op["c_perm"]);
                this.co = this._cyclic_op(this.co, op["c_tws"], 3);
                this.eo = this._permutation(this.eo, op["e_perm"]);
                this.eo = this._cyclic_op(this.eo, op["e_tws"], 2);
            }
        }
    }
    cube_rotate(cmd) {
        let raw_op = cmd[0];
        let times = 0;
        if (cmd.length == 1) {
            times = 1;
        } else if (cmd.slice(-1) == "2") {
            times = 2;
        } else if (cmd.slice(-1) == "'") {
            times = 3;
        } else {
            console.log(`unkonwn suffix:${cmd[1]}`);
            return;
        }
        this.center = this._permutation(
            this.center,
            this.unit_rotation[raw_op],
            times
        );
    }
    slice_operation(cmd) {
        // let raw_op = cmd;
        let op = cmd;
        // this.num_to_slice[this.sliceMove[this.slice_to_num[raw_op]]] +
        // (cmd.length > 1 ? cmd[1] : "");
        // print(op)
        if (op == "E") {
            this.unit_operation("U");
            this.unit_operation("D'");
            this.cube_rotate("y");
        } else if (op == "M") {
            this.unit_operation("R");
            this.unit_operation("L'");
            this.cube_rotate("x'");
        } else if (op == "S") {
            this.unit_operation("F'");
            this.unit_operation("B");
            this.cube_rotate("z");
        } else if (op == "E'") {
            this.unit_operation("U'");
            this.unit_operation("D");
            this.cube_rotate("y'");
        } else if (op == "M'") {
            this.unit_operation("R'");
            this.unit_operation("L");
            this.cube_rotate("x");
        } else if (op == "S'") {
            this.unit_operation("F");
            this.unit_operation("B'");
            this.cube_rotate("z'");
        } else if (op == "E2") {
            this.unit_operation("U2");
            this.unit_operation("D2");
            this.cube_rotate("y2");
        } else if (op == "M2") {
            this.unit_operation("R2");
            this.unit_operation("L2");
            this.cube_rotate("x2");
        } else if (op == "S2") {
            this.unit_operation("F2");
            this.unit_operation("B2");
            this.cube_rotate("z2");
        }
    }
    double_operation(cmd) {
        let times;
        let raw_op = cmd[0];
        let idx_op = this.center_to_num[raw_op];
        // let op = raw_op;
        let inv_op =
            this.num_to_center[idx_op % 2 == 0 ? idx_op + 1 : idx_op - 1];
        let idx_rotate =
            this.double_rotate[Math.floor(this.center_to_num[raw_op] / 2)];
        let rotate_times = 0;
        if (cmd.length == 2) {
            times = "";
            rotate_times = "URF".includes(raw_op) ? "" : "'";
        } else if (cmd.slice(-1) == "2") {
            times = "2";
            rotate_times = "2";
        } else if (cmd.slice(-1) == "'") {
            times = "'";
            rotate_times = "URF".includes(raw_op) ? "'" : "";
        }
        // console.log(inv_op+times,idx_rotate+rotate_times)
        this.unit_operation(inv_op + times);
        this.cube_rotate(idx_rotate + rotate_times);
    }
    seq_operation(seq) {
        let s = seq.split(" "); //.replace("'2", "2")
        for (let c of s) {
            // console.log(c);
            if (c.length <= 0) {
                continue;
            } else if (!"UFRDBLxyzEMS".includes(c[0])) {
                console.log(`unknown operator:${c}`);
                continue;
            } else if (!c.includes("w")) {
                let op_turn = c[0];
                if ("UFRDBL".includes(op_turn)) {
                    this.unit_operation(c);
                } else if ("xyz".includes(op_turn)) {
                    this.cube_rotate(c);
                } else if ("MES".includes(op_turn)) {
                    this.slice_operation(c);
                }
            } else {
                if (c[1] != "w" || "EMSxyz".includes(c[0])) {
                    console.log(`unknown operator:${c}`);
                    continue;
                }
                this.double_operation(c);
            }
            // this.operation(c);
            // console.log(`op:${c}`);
            this.history += " " + c;
        }
    }
    copy() {
        let copy = new RubiksCubeFlat();
        copy.cp = [...this.cp];
        copy.co = [...this.co];
        copy.ep = [...this.ep];
        copy.eo = [...this.eo];
        copy.center = [...this.center];
        copy.history = this.history;
        return copy;
    }
    isCrossDone(index) {
        if (index > 3) {
            return;
        }
        return (
            listIsEquall(this.ep.slice(0, index + 1), rangeList(index + 1)) &&
            listSum(this.eo.slice(0, index + 1)) == 0
        );
    }
    isF2lRegular(index) {
        let c_pos = this.cp.indexOf(index);
        let e_pos = this.ep.indexOf(index + 4);
        // console.log(c_pos,e_pos)
        let isCRegular = c_pos == index || c_pos >= 4;
        // console.log(`cregular:${isCRegular}`)
        let isERegular = e_pos == index + 4 || e_pos >= 8;
        // console.log(`eregular:${isERegular}`)
        return isCRegular && isERegular;
    }
    isF2lDone(index) {
        let cp_done = listIsEquall(
            this.cp.slice(0, index + 1),
            rangeList(index + 1)
        );
        // console.log(this.cp.slice(0, index+1))
        let co_done = listSum(this.co.slice(0, index + 1)) == 0;
        let ep_done = listIsEquall(
            this.ep.slice(0, index + 5),
            rangeList(index + 5)
        );
        let eo_done = listSum(this.eo.slice(0, index + 5)) == 0;
        return cp_done && ep_done && co_done && eo_done;
    }
    isAllF2lDone() {
        return this.isF2lDone(3);
    }
    isOllDone() {
        let cp_done = listIsEquall(this.cp.slice(0, 4), rangeList(4));
        // console.log(cp_done);
        let co_done = listSum(this.co) == 0;
        // console.log(co_done);
        let ep_done = listIsEquall(rangeList(8), this.ep.slice(0, 8));
        let eo_done = listSum(this.eo) == 0;
        return ep_done && cp_done && eo_done && co_done;
    }
    isPllDone() {
        return (
            listIsEquall(rangeList(8), this.cp) &&
            listIsEquall(Array(8).fill(0), this.co) &&
            listIsEquall(rangeList(12), this.ep) &&
            listIsEquall(Array(12).fill(0), this.eo)
        );
    }
}
