export function merge(source, target){
  // console.log('source', source)

  // console.log('before merge', {...target})
  // console.log('target.width', target.width)
  // console.log('target.height', target.height)

  Object.keys(source).forEach(key => {
    if(source[key] && typeof source[key] === 'object'){
      merge(source[key], target[key]);
    }else{
      target[key] = source[key];
    }
  });
  // console.log('after merge', target)
  // console.log('target.width', target.width)
  // console.log('target.height', target.height)
}
export default {
  merge
};
