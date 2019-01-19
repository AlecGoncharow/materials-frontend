
export default function buildData(props){
    let cls = props.cls;
    let assignments = props.selections.assignments;
    console.log(cls);
    console.log(assignments);
    let cSet = {};
    for (let assignment in assignments) {
        let classifications = assignments[assignment].fields.classifications;
        for (let c in classifications) {
            let cl = classifications[c];
            if (cSet[cl] !== undefined) {
                cSet[cl]++;
            }
            else {
                cSet[cl] = 1;
            }
        }
    }

    for (let item in cSet) {
        let curr = cls[item];

        while (curr !== undefined) {
            curr.hits += cSet[item];
            curr = cls[curr.parent];
        }
    }

    let out = [];
    for (let c in cls) {
        if (cls[c]['depth'] === 1) {
            let obj = {};
            obj['name'] = cls[c]['id'] + ": " + cls[c].hits;
            obj['value'] = cls[c]['hits'] + 10;
            out.push(obj);
        }
    }

    console.log(out);

    return {children: out};
}