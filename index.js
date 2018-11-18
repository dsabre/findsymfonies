#!/usr/bin/env node

const Table = require('cli-table');
const childProcess = require('child_process');
const prettyjson = require('prettyjson');
const pathExists = require('path-exists');
require('colors');

function execCommand(command){
  let output = childProcess.execSync(command).toString();
  output = output.split('\n');
  output.splice(-1,1);

  return output;
}

function launchError(string) {
  console.error(string.red);
  process.exit(1);
}

function getSymfonyVersion(symfonyPath, phpPaths, callback) {
  for(let i = 0; i < phpPaths.length; i++){
    try{
      let consolePath = symfonyPath + '/bin/console';
      if (!pathExists.sync(consolePath)) {
        consolePath = symfonyPath + '/app/console';
      }

      const command = phpPaths[i] + ' "' + consolePath + '" |head -n1';
      return execCommand(command)[0].replace('Symfony version ', '').replace('Symfony ', '').split(' ')[0];
    }
    catch(e){}
  }
}

const dir = process.argv[2];
const phpPaths = process.argv[3] || null;
const format = process.argv[4] || 'table';

if (dir) {
  pathExists(dir).then(exists => {
      if (!exists) {
        throw Error('IVALID PATH');
      }

      const command = 'find ' + dir + ' -print |grep "\\(app\\|bin\\)/console$" |sed "s/\\/\\(bin\\|app\\)\\/console//g"';
      const symfonies = execCommand(command);

      for(let i = 0; i < symfonies.length; i++){
        symfonies[i] = {
          path: symfonies[i],
          version: format != 'json' ? 'NO PHP PROVIDED'.yellow : 'NO PHP PROVIDED',
          mainVersion: format != 'json' ? 'NO PHP PROVIDED'.yellow : 'NO PHP PROVIDED'
        };

        if (phpPaths) {
          const version = getSymfonyVersion(symfonies[i].path, phpPaths.split('|'));

          symfonies[i].version = version;
          symfonies[i].mainVersion = version[0];
        }
      }

      switch (format) {
        case 'json':
          console.log(symfonies);
          break;
        case 'table':
          let header = Object.keys(symfonies[0]);
          for(let i = 0; i < header.length; i++){
            header[i] = header[i].green;
          }

          const table = new Table({
            head: header
          });

          for(let i = 0; i < symfonies.length; i++){
            table.push(Object.values(symfonies[i]));
          }

          console.log('SYMFONIES FOUND:\n' + table.toString());
          break;
        case 'pretty':
          console.log('SYMFONIES FOUND:\n' + prettyjson.render(symfonies));
          break;
        default:
          launchError('INVALID FORMAT');
      }
  }).catch(e => {
    launchError(e.message);
  });
}
else{
  launchError('NO DIRECTORY PROVIDED');
}
