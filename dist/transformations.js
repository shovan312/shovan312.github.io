//@ts-ignore
import * as THREE from './three/build/three.module.js';
export function wave(arr, A, k, w, time) {
    let ret = [];
    for (let i = 0; i < arr.length; i += 3) {
        let x = arr[i + 0];
        let y = arr[i + 1];
        let z = arr[i + 2];
        let posVec = new THREE.Vector3(x, y, z);
        posVec = displace(posVec, A, k, w, time);
        ret.push(posVec.x, posVec.y, posVec.z);
    }
    return ret;
}
function displace(vec, A, k, w, time) {
    //Plane waves along axes
    // vec.x +=  A*Math.sin(k*vec.x + w*time)
    // vec.y +=  A*Math.sin(k*vec.y + w*time)
    //     vec.z +=  A*Math.sin(k*vec.z + w*time)
    //Sin waves along axes
    // vec.x += A*Math.sin(k*vec.y + w*time/5)
    // vec.y += A*Math.cos(k*vec.z + w*time/5)
    // vec.z += A*Math.sin(k*vec.x + w*time/5)
    //Composite waves
    // vec.x += 0.1*vec.x*A*Math.sin(k*vec.z + k*vec.y + w*time)
    vec.y += Math.sin((vec.x + time) * 0.5) + Math.sin((vec.y + time) * 0.7);
    //3D Radial waves
    // let r = vec.length()
    // let disp = A*Math.sin(r - w*time);
    // vec.multiplyScalar(k + disp)
    //2D Radial waves
    // let r = Math.sqrt(vec.x*vec.x + vec.y*vec.y)
    // let disp = 0.1*Math.sin(r - 5*time)
    // vec.multiplyScalar(1 + disp)
    return vec;
}
export function burn(arr, time) {
    const len = arr.length / 3;
    const ret = [];
    const winLen = Math.floor(len / 2);
    const winStart = time * 70000 % (len);
    const winEnd = (winLen + winStart) % (len);
    for (let i = 0; i < arr.length; i += 3) {
        const ind = Math.floor(i / 3);
        let isValid = false;
        if (winEnd > winStart) {
            isValid = ind > winStart && ind < winEnd;
        }
        else {
            isValid = (ind > 0 && ind < winEnd) || (ind > winStart && ind < len);
        }
        if (isValid) {
            ret.push(arr[i + 0]);
            ret.push(arr[i + 1]);
            ret.push(arr[i + 2]);
        }
    }
    return ret;
}
export function morph(from, to, time) {
    const maxLength = Math.max(from.length, to.length);
    // const t = THREE.MathUtils.clamp(Math.sin(time), 0, 1);
    const t = time - Math.floor(time);
    const ret = [];
    for (let i = 0; i < maxLength; i += 3) {
        ret.push(from[i % from.length] + t * (to[i % to.length] - from[i % from.length]));
        ret.push(from[i % from.length + 1] + t * (to[i % to.length + 1] - from[i % from.length + 1]));
        ret.push(from[i % from.length + 2] + t * (to[i % to.length + 2] - from[i % from.length + 2]));
    }
    return ret;
}
export function rearrangeArr(inp, fn) {
    let inp2Vec = [];
    for (let i = 0; i < inp.length; i += 3) {
        inp2Vec.push(new THREE.Vector3(inp[i], inp[i + 1], inp[i + 2]));
    }
    inp2Vec.sort(fn);
    let out = [];
    for (let i = 0; i < inp2Vec.length; i++) {
        out.push(inp2Vec[i].x);
        out.push(inp2Vec[i].y);
        out.push(inp2Vec[i].z);
    }
    return out;
}
export function byX(a, b) {
    if (a.x < b.x)
        return -1;
    else if (a.x > b.x)
        return 1;
    return 0;
}
export function byY(a, b) {
    if (a.y < b.y)
        return -1;
    else if (a.y > b.y)
        return 1;
    return 0;
}
export function byZ(a, b) {
    if (a.z < b.z)
        return -1;
    else if (a.z > b.z)
        return 1;
    return 0;
}
export function byR(a, b) {
    let r1 = a.length();
    let r2 = b.length();
    let delta = r2 - r1;
    if (delta > 0.0001)
        return -1;
    else if (delta < -0.0001)
        return 1;
    let theta1 = Math.atan2(a.y, a.x);
    let theta2 = Math.atan2(b.y, b.x);
    // let theta1:number = a.angleTo(new THREE.Vector3(1,0,0))
    // let theta2:number = b.angleTo(new THREE.Vector3(1,0,0))
    if (theta1 < theta2)
        return -1;
    else if (theta1 > theta2)
        return 1;
    let phi1 = Math.atan2(a.y, a.z);
    let phi2 = Math.atan2(b.y, b.z);
    // let phi1:number = a.angleTo(new THREE.Vector3(0,0,1))
    // let phi2:number = b.angleTo(new THREE.Vector3(0,0,1))
    if (phi1 < phi2)
        return -1;
    else if (phi1 > phi2)
        return 1;
    return 0;
}
export function byRandom(a, b) {
    if (Math.random() - 0.5 < 0)
        return -1;
    else
        return 1;
}
