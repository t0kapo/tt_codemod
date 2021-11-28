// jscodeshift can take a parser, like "babel", "babylon", "flow", "ts", or "tsx"
// Read more: https://github.com/facebook/jscodeshift#parser
export const parser = 'babel'

// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;

  //find "document.write" and changing arguments
  return j(file.source)
    .find(j.CallExpression, {
    	callee: {
      		type: 'MemberExpression',
      		property: {
        		name: 'insertAdjacentHTML',
      		},
    	}
  	})
    
  	.filter(path => {
    	if (typeof path.value.arguments[1].callee === "undefined"){
          	return true;
        }else if (typeof path.value.arguments[1].callee.object === "undefined"){
          	return true;
        }else if (path.value.arguments[1].callee.property.name != 'createHTML'){
          	return true;
        }else{
          return false;
        }
    })
    
    .forEach(path => {
    	j(path).replaceWith(nodePath => {
        	const {node} = nodePath;
          	const arg_2 = [node.arguments[1]];
          	const remake = j.callExpression(
            	j.memberExpression(
                	j.identifier('mypolicy'),
                  	j.identifier('createHTML'),
                  	false  	
                ),
                arg_2
            );
          	node.arguments[1] = remake;
          	return node;
        })
      })
    .toSource();
}