// import lernaTest from 'lerna-test'; // test add lerna project into
// import A from './modules/moudleCMD';   // test cmd
// import '../style/testSyle.css';  // test add style
import bar from './modules/testES6'; // test babel es transform
import foo from './modules/testES6_2'; // test babel es transform
import '../style/testSass.scss'; // test add sass
import { baz } from './modules/moduleES6'; // 通过	__webpack_require__.d()的方法得到的是对象的引用 （在模块里通过闭包返回，虽然模块执行完了）
import svg from '../style/feature/favor.svg';
// console.log('test4', foo, bar);

const objectRest = {
  key1: 1,
  key2: 2,
};

function tst() {
  const { key1 } = objectRest;
  // key1 = 2; // 编译时候将会转换为报错函数
  let { key2 } = objectRest;
  if (1) {
    // 块级作用域
    const key1 = 2;
    console.log(key1);
  }
  console.log('test', key1, key2);
  baz(2);
  let moduleName = 'moduleCJS.js';
  require(`./modules/${moduleName}`); // 因为不知道变量是什么，可能到导致所有文件被打包进去
}
tst();
// console.log('moduleHot', module.hot);

/*
if (module.hot) {
  module.hot.accept('./modules/moduleA', function (){
    console.log('after accept the update moduleA')
  })
}
*/
