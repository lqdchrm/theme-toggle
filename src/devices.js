const { exec } = require('node:child_process');

async function run(cmd) {
    return new Promise((res, rej) => {
        exec(`cmd /c chcp 65001>nul && ${cmd}`, { encoding: "latin1" }, (error, stdout, stderror) => {
            if (error) {
                rej({ error, stdout, stderror});
            } else {
                res({stdout, stderror});
            }
        });
    });
}

async function getDeviceId(name, clazz) {
    let result = await run(`pnputil /enum-devices /class ${clazz}`);
    let lines = result.stdout.split("\r\n");
    
    // skip first two lines
    lines = lines.slice(2);
    
    // to array of objects
    let objs = lines.reduce((acc, line) => {
        line = line.trim();
        if (acc.length == 0 || line.length == 0) {
            acc.push({});
        }
        if (line.length) {
            let obj = acc[acc.length - 1];
            let tokens = line.split(":").map(t => t.trim());
            obj[tokens[0]] = tokens[1];
        }
        return acc;
    }, []);
    objs = objs.filter(obj => Object.keys(obj).length);
    
    // find by name
    let match = objs.filter(obj => obj["Gerätebeschreibung"] == name && ["Gestarted", "Deaktiviert"].includes(obj["Status"]));
    
    // get id
    if (!match.length) {
        throw new Error("Not found");
    }

    match = match[0];
    let id = match["Instanz-ID"];
    console.log("ID: ", id);
    return id;
}

async function enableDevice(name = "NVIDIA GeForce RTX 3070 Ti", clazz = "Display") {
    let id = await getDeviceId(name, clazz);
    let result = await run(`pnputil /enable-device "${id}"`);
    if (result.stdout)
        console.log(result.stdout);
    if (result.stderr)
        console.error(result.stderr);
}

async function disableDevice(name = "NVIDIA GeForce RTX 3070 Ti", clazz = "Display") {
    try {
        let id = await getDeviceId(name, clazz);
        let result = await run(`pnputil /disable-device "${id}"`);
        if (result.stdout)
            console.log(result.stdout);
        if (result.stderr)
            console.error(result.stderr);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    enableDevice, disableDevice
}