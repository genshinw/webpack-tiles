class Foo {
  constructor() {
    console.log('Bar constructor');
  }
  classPropertyFunction = ()=>{ // stage3 @babel/plugin-proposal-class-properties, https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html
    console.log('函数是作为this的一个属性定义的，某个对象都有这个function', this);
  }

  thefunction() {
    console.log('函数作为Bar原型定义，只有一个function, 被所有创建的对象共用');
  }
}
export const  arrowFunction = ()=>{
  console.log('arrowFunction');
}
const bar = new Foo();
export default Foo;
