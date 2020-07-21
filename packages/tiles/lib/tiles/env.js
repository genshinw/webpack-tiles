const path = require('path');

const DIR_ROOT = process.cwd(); // context for webpack application run in\
class Env {
  constructor(_env) {
    this.init(_env); // start will init with undefined for default value
  }

  init(_env = {}, other = {}) {
    this.mode = _env.mode || 'prod';
    // mode: 'production' just use webpack.DefinePlugin,not change process.env ,see https://github.com/webpack/webpack/issues/7074
    process.env.NODE_ENV = _env.mode === 'dev' ? 'development' : 'production'; // for react-hot-loader/babel and other build use env
    this.target = _env.target || 'client';
    this.isAnalyze = _env.isAnalyze || _env.anly || false;
    this.isWds = _env.isWds || _env.wds || false;
    this.DIR_ROOT = DIR_ROOT;
    this.OUTPUT_BASE_PATH =
      _env.OUTPUT_BASE_PATH ||
      (this.modeIs('prod') ? path.resolve(DIR_ROOT, './dist') : path.resolve(DIR_ROOT, './.tmp'));
    this.OUTPUT_PATH = _env.OUTPUT_PATH || path.join(this.OUTPUT_BASE_PATH, this.target);
    this.PUBLIC_PATH = _env.PUBLIC_PATH || './'; // use in assets
    // different target & different mode will get different CACHE_DIR to avoid get wrong cache
    this.CACHE_DIR = path.join(
      DIR_ROOT,
      './node_modules/.cache', // default root cache dir
      `cache-loader_${this.get('target')}_${this.get('mode')}`
    );
    Object.assign(this, other);
  }

  get(key) {
    return this[key];
  }

  set(key, value) {
    this[key] = value;
  }

  test(key, testValue) {
    return testValue !== undefined ? this[key] === testValue : this[key];
  }

  modeIs(testMode) {
    return this.mode === testMode;
  }

  targetIs(testTarget) {
    return this.target === testTarget;
  }
}
module.exports = new Env();
