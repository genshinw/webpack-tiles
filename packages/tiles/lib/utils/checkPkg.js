function _isInstall(pkg) {
  try {
    require.resolve(pkg, { paths: [process.cwd()] });
    return true;
  } catch (e) {
    return false;
  }
}
function checkPkgs(pkgsName) {
  const toCheckPkg = Array.isArray(pkgsName) ? pkgsName : [pkgsName];
  let needInstallPkg = '';
  toCheckPkg.forEach((name) => {
    if (!_isInstall(name)) {
      needInstallPkg += ` ${name}`;
    }
  });
  if (needInstallPkg) {
    console.error(`use "npm i -D${needInstallPkg}" to install dependencies`);
    throw Error(`lack some dependence`);
  }
  return true;
}
module.exports = checkPkgs;
