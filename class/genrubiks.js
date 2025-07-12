class GenRubiks {
    constructor(n, dict, p) {
        //描画するp5インスタンス
        this.p = p;
        //色の設定
        this.colordict = dict;
        //色のナンバリング
        this.orange = 0;
        this.red = 1;
        this.white = 2;
        this.yellow = 3;
        this.blue = 4;
        this.green = 5;
        this.black = 6;
        //全体の大きさ
        this.order = n;
        //小方体の大きさ
        this.cubesize = 11;
        //隙間
        this.gap = 1;
        //本体づくり
        let list1 = [];
        for (let i = 0; i < n; i += 1) {
            let list2 = [];
            for (let j = 0; j < n; j += 1) {
                let list3 = [];
                for (let k = 0; k < n; k += 1) {
                    let colorlist = Array(6).fill(this.black);
                    if (i == 0) {
                        colorlist[0] = this.orange;
                    } else if (i == n - 1) {
                        colorlist[1] = this.red;
                    }
                    if (j == 0) {
                        colorlist[2] = this.white;
                    } else if (j == n - 1) {
                        colorlist[3] = this.yellow;
                    }
                    if (k == 0) {
                        colorlist[4] = this.blue;
                    } else if (k == n - 1) {
                        colorlist[5] = this.green;
                    }
                    let sub = new SubCube(
                        p,
                        i + n * j + n * n * k,
                        colorlist,
                        dict,
                        this.cubesize
                    );
                    list3.push(sub);
                }
                list2.push(list3);
            }
            list1.push(list2);
        }
        this.body = list1;
        //アニメーション用変数
        this.isAnimating = false;
        this.movingaxis = 0;
        this.movingnum = new Set();
        this.turnnum = 0;
        this.movingangle = 0;
        //最小で10（3秒で回転）、最大で0（1フレームで回転）
        this.movespeed = 1;
        //操作用文字列
        this.animationString = "";
    }
    #turnAxisPermute(axis, i, j, k) {
        let x, y, z;
        if (axis == 0) {
            [x, y, z] = [k, i, j];
        } else if (axis == 1) {
            [x, y, z] = [i, k, j];
        } else if (axis == 2) {
            [x, y, z] = [i, j, k];
        }
        return [x, y, z];
    }
    #dispPermute(axis, spec, other) {
        let x, y, z;
        if (axis == 0) {
            [x, y, z] = [spec, other, other];
        } else if (axis == 1) {
            [x, y, z] = [other, spec, other];
        } else if (axis == 2) {
            [x, y, z] = [other, other, spec];
        }
        return [x, y, z];
    }
    #dispAxisPermute(axis, i, j, k) {
        let x, y, z;
        if (axis == 0) {
            [x, y, z] = [i, j, k];
        } else if (axis == 1) {
            [x, y, z] = [j, i, k];
        } else if (axis == 2) {
            [x, y, z] = [k, j, i];
        }
        return [x, y, z];
    }
    turn(axis, num, turn = 1) {
        if (axis >= 0 && axis <= 2) {
            if (num >= 0 && num < this.order) {
                let x, y, z;
                let size = this.order;
                for (let i = 0; i < size; i += 1) {
                    for (let j = 0; j < size; j += 1) {
                        [x, y, z] = this.#turnAxisPermute(axis, i, j, num);
                        this.body[x][y][z].turn(turn, axis);
                    }
                }
                let newM = [...Array(size)].map((_) =>
                    [...Array(size)].fill(0)
                );
                for (let i = 0; i < size; i += 1) {
                    for (let j = 0; j < size; j += 1) {
                        [x, y, z] = this.#turnAxisPermute(axis, i, j, num);
                        if (turn % 4 == 1) {
                            newM[size - 1 - j][i] = this.body[x][y][z].copy();
                        } else if (turn % 4 == 2) {
                            newM[size - 1 - i][size - 1 - j] =
                                this.body[x][y][z].copy();
                        } else if (turn % 4 == 3) {
                            newM[j][size - 1 - i] = this.body[x][y][z].copy();
                        } else {
                            newM[i][j] = this.body[x][y][z].copy();
                        }
                    }
                }
                for (let i = 0; i < size; i += 1) {
                    for (let j = 0; j < size; j += 1) {
                        [x, y, z] = this.#turnAxisPermute(axis, i, j, num);
                        this.body[x][y][z] = newM[i][j];
                    }
                }
            } else {
                console.log("paramaters invalid");
            }
        }
    }
    endRotate() {
        if (this.turnnum == 1 || this.turnnum == 2) {
            //時計回りの終了
            if (this.movingangle >= (this.turnnum * Math.PI) / 2) {
                for (let num of this.movingnum) {
                    this.turn(this.movingaxis, num, this.turnnum);
                }
                this.isAnimating = false;
                this.movingangle = 0;
                this.movingaxis = 0;
                this.movingnum = new Set();
                this.turnnum = 0;
                return;
            }
        } //反時計回りの終了
        else if (this.turnnum == 3) {
            if (this.movingangle <= -Math.PI / 2) {
                for (let num of this.movingnum) {
                    this.turn(this.movingaxis, num, this.turnnum);
                }
                this.isAnimating = false;
                this.movingangle = 0;
                this.movingaxis = 0;
                this.movingnum = new Set();
                this.turnnum = 0;
                return;
            }
        } else {
            return;
        }
    }
    updateRotate() {
        //時計回りの更新
        if (this.turnnum == 1 || this.turnnum == 2) {
            if (this.movespeed != 0) {
                this.movingangle += this.p.map(
                    this.movespeed,
                    10,
                    0,
                    this.p.PI / 360,
                    this.p.PI / 20
                );
            } else {
                this.movingangle += this.p.PI / 2;
            }
        }
        //反時計回りの更新
        else if (this.turnnum == 3) {
            if (this.movespeed != 0) {
                this.movingangle -= this.p.map(
                    this.movespeed,
                    10,
                    0,
                    this.p.PI / 200,
                    this.p.PI / 20
                );
            } else {
                this.movingangle -= this.p.PI / 2;
            }
        } else {
            return;
        }
    }
    display() {
        this.p.push();
        //原点に持ってくる
        this.p.translate(
            (-this.cubesize * this.order) / 2,
            (-this.cubesize * this.order) / 2,
            (-this.cubesize * this.order) / 2
        );
        //線を消す
        this.p.noStroke();
        //動いていないとき
        if (!this.isAnimating) {
            for (let i = 0; i < this.order; i += 1) {
                for (let j = 0; j < this.order; j += 1) {
                    for (let k = 0; k < this.order; k += 1) {
                        this.p.push();
                        this.p.translate(
                            this.cubesize * i + this.gap * (i - 1),
                            this.cubesize * j + this.gap * (j - 1),
                            this.cubesize * k + this.gap * (k - 1)
                        );
                        this.body[i][j][k].display();
                        this.p.pop();
                    }
                }
            }
        }
        //動いているとき
        else {
            //アニメーションの終了
            this.endRotate();
            for (let i = 0; i < this.order; i += 1) {
                for (let j = 0; j < this.order; j += 1) {
                    for (let k = 0; k < this.order; k += 1) {
                        this.p.push();
                        let [tx, ty, tz] = this.#dispPermute(
                            this.movingaxis,
                            0,
                            (this.cubesize * this.order) / 2
                        );
                        let [ex, ey, ez] = this.#dispPermute(
                            this.movingaxis,
                            this.movingaxis == 1 ? -1 : 1,
                            0
                        );
                        let [x, y, z] = this.#dispAxisPermute(
                            this.movingaxis,
                            i,
                            j,
                            k
                        );
                        if (this.movingnum.has(i)) {
                            this.p.translate(tx, ty, tz);
                            // this.p.rotateX(this.movingangle);
                            this.p.rotate(
                                this.movingangle,
                                this.p.createVector(ex, ey, ez)
                            );
                            this.p.translate(-tx, -ty, -tz);
                        }
                        this.p.translate(
                            this.cubesize * x + this.gap * (x - 1),
                            this.cubesize * y + this.gap * (y - 1),
                            this.cubesize * z + this.gap * (z - 1)
                        );
                        this.body[x][y][z].display();
                        this.p.pop();
                    }
                }
            }
            this.updateRotate();
        }
    }
    startanimate(axis, num, turn) {
        if (!this.isAnimating) {
            this.movingaxis = axis;
            this.movingnum = num;
            this.turnnum = turn % 4;
            this.isAnimating = true;
        }
    }
    randomPosGenerate(length) {
        for (let i = 0; i < length; i += 1) {
            let axis = floor(Math.random() * 3);
            let num = floor(Math.random() * this.order);
            let dir = floor(Math.random() * 3) + 1;
            this.turn(axis, num, dir);
        }
    }
}
