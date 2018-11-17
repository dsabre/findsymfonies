
# findsymfonies
Nodejs cli that list all symfonies in a provided directory.

## Installation
```bash
git clone https://github.com/raniel86/findsymfonies.git
cd findsymfonies
npm i -g
```

## Usage
```bash
findsymfonies PATH [PHP_PATHS] [FORMAT]
```
- PATH: the parent path where the symfonies are stored in;
- PHP_PATHS: pass a list of you php executables separated by '|' (eg. "/usr/bin/php|/opt/remi/php56/root/usr/bin/php");
- FORMAT: table (default), pretty or json.
