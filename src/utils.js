import React from 'react';


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

    let i = 0;
    for (let item in cSet) {
        let curr = cls[item];
        i += cSet[item];

        while (curr !== undefined) {
            curr.hits += cSet[item];
            curr = cls[curr.parent];
        }
    }

    let out = []
    for (let c in cls) {
        out[c] = {};
        out[c]['name'] = cls[c]['id'];
        out[c]['value'] = cls[c]['hits'] * 5;
        out[c].children = [];
    }

    for (let c in cls) {
        if(cls[c].parent) {
            out[cls[c].parent].children.push(out[c]);
        }
    }

    let root = {};
    for (let c in cls) {
        if(!cls[c].parent) {
            root = out[c];
        }
    }

    console.log(root);

    return root;
}