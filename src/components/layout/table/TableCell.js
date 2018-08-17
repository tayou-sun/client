
class TableCell {
    constructor(name, parent, child, level,cell) {
        this.name = name;
        this.parent = parent;
        this.child = child;
        this.level = level;
        this.cell = cell;
    }
    SetSell(cell) {
        this.cell = cell;
    }
}


export default TableCell;