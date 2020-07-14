// foo(); // error
// console.log(this); // 编译直接转换为undefined
// baz(); // Ok
export function bar(x) {
  // baz();
  // foo(); // ok
  console.log('fun2');
  return x;
}
export function baz(x) {
  // fun2.toString = ()=>{};
  //  console.log('baz', this);
   return x * x * x;
}

export const foo = ()=>{

}
