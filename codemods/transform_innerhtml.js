// jscodeshift can take a parser, like "babel", "babylon", "flow", "ts", or "tsx"
// Read more: https://github.com/facebook/jscodeshift#parser
export const parser = 'babel'

// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;

  //find "document.write" and
  return j(file.source)
    .find(j.AssignmentExpression, {
    	left: {
      		type: 'MemberExpression',
      		property: {
        		name: 'innerHTML',
      		},
    	}
  	})
  	.filter(path =>  {
    	if (typeof path.value.right.callee === "undefined"){
          	return true;
        }else if (typeof path.value.right.callee.object === "undefined"){
          	return true;
        }else if (path.value.right.callee.object.name != 'mypolicy' && path.value.right.callee.property.name != 'createHTML'){
          	return true;
        }else{
          return false;
        }
    	
  	})
    .forEach(path => {
    	j(path).replaceWith(nodePath => {
        	const {node} = nodePath;
          	node.right = j.callExpression(
                j.memberExpression(
                        j.identifier('mypolicy'),
                        j.identifier('createHTML'),
                        false
                ),
            	[node.right]);
          	const remake = j.assignmentExpression(
            	'=',
                node.left,
              	node.right
            );
          	node.body = [remake];
          	return node;
          })
      })
    .toSource();
}

