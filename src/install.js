var path = require('path');
var cp = require('child_process');

let handleSquirrelEvent = function(app) {
    if (process.platform != 'win32') { return false; }

    const appFolder = path.dirname(process.execPath)
    const updateExe = path.resolve(appFolder, '..', 'Update.exe')
    const exeName = path.basename(process.execPath)

    app.setLoginItemSettings({
      openAtLogin: true,
      path: updateExe,
      args: [
        '--processStart', `"${exeName}"`,
        '--process-start-args', '"--hidden"'
      ]
    })

    function executeSquirrelCommand(args, done) {
       var updateDotExe = path.resolve(path.dirname(process.execPath), 
          '..', 'update.exe');
       var child = cp.spawn(updateDotExe, args, { detached: true });
 
       child.on('close', function(code) { done(); });
    };
 
    function install(done) {
       var target = path.basename(process.execPath);
       executeSquirrelCommand(["--createShortcut", target], done);
    };
 
    function uninstall(done) {
       var target = path.basename(process.execPath);
       executeSquirrelCommand(["--removeShortcut", target], done);
    };
 
    var squirrelEvent = process.argv[1];
 
    switch (squirrelEvent) {
        case '--squirrel-install':
          install(app.quit);
          return true;
 
       case '--squirrel-updated':
          install(app.quit);
          return true;
 
       case '--squirrel-obsolete':
          app.quit();
          return true;
 
       case '--squirrel-uninstall':
          uninstall(app.quit);
          return true;
    }
 
    return false;
 };

 module.exports = handleSquirrelEvent;