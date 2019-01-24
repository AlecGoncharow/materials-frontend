
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

    let nodes = [];
    for (let item in cSet) {
        if (cls[item] !== undefined) {
            let curr = {id: cls[item].id, parent: cls[item].parent, depth: cls[item].depth, hits: cSet[item]};
            while (curr !== undefined) {
                nodes[nodes.length] = curr;
                if (cls[curr.parent] !== undefined) {
                    curr = {
                        id: cls[curr.parent].id,
                        parent: cls[curr.parent].parent,
                        depth: cls[curr.parent].depth,
                        hits: cSet[curr.parent]
                    };
                } else {
                    break;
                }
            }
        }
    }

    console.log(nodes);
    let out = [];
    for (let c in nodes) {
        if (nodes[c]['depth'] === 1) {
            let obj = {};
            obj['name'] = nodes[c]['id'] + ": " + nodes[c].hits;
            obj['value'] = nodes[c]['hits'] + 10;
            out.push(obj);
        }
    }

    console.log(out);

    return {children: out};
}

export function buildTreeData(props) {
    let cls = props.cls;
    let assignments = props.selections.assignments;
    let ignore = props.ignore;
    let cSet = {};
    for (let assignment in assignments) {
        let classifications = assignments[assignment].fields.classifications;
        for (let c in classifications) {
            let cl = classifications[c];
            if (cl.startsWith(ignore)) {
                continue;
            } else {
                if (cSet[cl] !== undefined) {
                    cSet[cl]++;
                } else {
                    cSet[cl] = 1;
                }
            }
        }
    }

    let nodes = [];
    for (let item in cSet) {
        if (cls[item] !== undefined) {
            let curr = {id: cls[item].id, parent: cls[item].parent, depth: cls[item].depth, hits: cSet[item]};
            while (curr !== undefined) {
                nodes[nodes.length] = curr;
                if (cls[curr.parent] !== undefined) {
                    curr = {
                        id: cls[curr.parent].id,
                        parent: cls[curr.parent].parent,
                        depth: cls[curr.parent].depth,
                        hits: cSet[curr.parent]
                    };
                } else {
                    break;
                }
            }
        }
    }

    let data = {max: []};
    let out = [];
    let links = [];
    for (let a in cls) {
        if (a.startsWith(ignore)) {
            continue;
        }
        let o = cls[a];
        if (o.parent === undefined) {
            out[out.length] = o;
        }
        else {
            let p = cls[o.parent];
            if (p.hits !== 0) {
                out[out.length] = o;
                links[links.length] = {'source': o.id, 'target': p.id, 'hits': o.hits};

                data.max[o.depth] = data.max[o.depth] > o.hits ? data.max[o.depth] : o.hits;
            }
        }
    }
    data['nodes'] = nodes;
    data['links'] = links;
    return data;
}

export function similarityData(props) {
    let assignments = props.selections.assignments;
    let cls = props.selections.classifications;
    let similarity = {};
    for (let assignment in assignments) {
        let classifications = assignments[assignment].fields.classifications;
        for (let c in classifications) {
            let cl = classifications[c];
            if (!cl.startsWith("PDC")) {
                if (similarity[cl] === undefined) {
                    similarity[cl] = [];
                }
                for (let b in classifications) {
                    let bl = classifications[b];
                    if (bl.startsWith("PDC")) {
                        let ele = similarity[cl].findIndex(function (e) {
                            return e.id === bl;
                        });
                        if (ele === -1) {
                            similarity[cl].push({'id': bl, 'value': 1});
                        } else {
                            similarity[cl][ele].value++;
                        }
                    }
                }
            }
        }
    }

    let data = {};
    let links = [];
    let nodes = [];
    console.log(similarity);
    for (let cl in cls) {
        nodes[nodes.length] = {id: cls[cl]};
        let curr = similarity[cls[cl]];
        if (curr !== undefined) {
            for (let other in curr) {
                if (curr[other].value > 3) {
                    links[links.length] = {'source': cls[cl], 'target': curr[other].id, 'value': curr[other].value};
                }
            }
        }
    }
    data['nodes'] = nodes;
    data['links'] = links;

    return data;
}

 export function compareAssignments(props) {
    let from = props.from;
    let to = props.to;
    let threshold = 2;

     let data = {};
     let links = [];
     let nodes = [];
     for (let from_a in from) {
         console.log(from[from_a]);
         nodes[nodes.length] = {id: from[from_a].fields.title, to: false};
         let from_cls = from[from_a].fields.classifications;
         for (let to_a in to) {
             let sim = 0;
             let to_cls = to[to_a].fields.classifications;
             let lab = "";
             for (let cls in from_cls) {
                 let c = from_cls[cls];
                 if (to_cls.includes(c)) {
                     sim++;
                     lab += c + ";";
                 }
             }
             if (sim >= threshold) {
                 links[links.length] = {
                     'source': from[from_a].fields.title,
                     'target': to[to_a].fields.title,
                     'value': sim,
                     'label': lab,
                 };
                 console.log(links[links.length - 1]);
             }
         }
     }
     for (let to_a in to) {
         nodes[nodes.length] = {id: to[to_a].fields.title, to: true};
     }
     data['nodes'] = nodes;
     data['links'] = links;

     return data;
 }
