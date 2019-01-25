
export default function buildData(props){
    let cls = props.cls;
    let assignments = props.selections.assignments;
    console.log(cls);
    console.log(assignments);
    let hits = {};
    for (let assignment in assignments) {
        let classifications = assignments[assignment].fields.classifications;
        for (let c in classifications) {
            let cl = classifications[c];
            let current = cls[cl];
            while (current !== undefined) {
                if (hits[current.id] !== undefined) {
                    hits[current.id]++;
                } else {
                    hits[current.id] = 1;
                }
                current = cls[current.parent];
            }
        }
    }
    console.log(hits);

    let out = [];
    for (let c in cls) {
        if (cls[c]['depth'] === 1) {
            let obj = {};
            let value = hits[c] !== undefined ? hits[c] : 0;
            obj['name'] = cls[c]['id'] + ": " + value;
            obj['value'] = value + 10;
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
    let hits = {};
    for (let assignment in assignments) {
        let classifications = assignments[assignment].fields.classifications;
        for (let c in classifications) {
            let cl = classifications[c];
            let current = cls[cl];
            while (current !== undefined) {
                if (hits[current.id] !== undefined) {
                    hits[current.id]++;
                } else {
                    hits[current.id] = 1;
                }
                current = cls[current.parent];
            }
        }
    }
    let data = {max: []};
    let out = [];
    let links = [];
    for (let a in cls) {
        let o = cls[a];
        let value = hits[o.id] !== undefined ? hits[o.id] : 0;
        if (o.parent === undefined) {
            out[out.length] = {
                id: o.id,
                depth: o.depth,
                hits: value,
            };
        }
        else {
            let p = cls[o.parent];
            if (hits[p.id] !== 0 && hits[p.id] !== undefined) {
                out[out.length] = {
                    id: o.id,
                    depth: o.depth,
                    hits: value,
                };
                links[links.length] = {'source': o.id, 'target': p.id, 'hits': value};

                data.max[o.depth] = data.max[o.depth] > value ? data.max[o.depth] : value;
            }
        }
    }
    data['nodes'] = out;
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
