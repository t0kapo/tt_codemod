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
      		object: {
        		name: 'document',
      		},
      		property: {
        		name: 'writeln',
      		},
    	}
  	})
  	.filter(path => {
    	if (typeof path.value.arguments[0].callee === "undefined"){
          	return true;
        }else if (typeof path.value.arguments[0].callee.object === "undefined"){
          	return true;
        }else if ( path.value.arguments[0].callee.property.name != 'createHTML'){
          	return true;
        }else{
          return false;
        }
    })
    .forEach(path => {
    	j(path).replaceWith(nodePath => {
        	const {node} = nodePath;
          	const remake = j.callExpression(
            	j.memberExpression(
                	j.identifier('mypolicy'),
                  	j.identifier('createHTML'),
                  	false  	
                ),
              	node.arguments
            );
          	node.arguments = [remake];
          	return node;
        })
      })
    .toSource();
}
