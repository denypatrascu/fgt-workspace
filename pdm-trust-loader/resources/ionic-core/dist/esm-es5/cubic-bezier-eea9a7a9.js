var getTimeGivenProgression=function(t,r,a,e,o){return solveCubicBezier(t[1],r[1],a[1],e[1],o).map((function(o){return solveCubicParametricEquation(t[0],r[0],a[0],e[0],o)}))};var solveCubicParametricEquation=function(t,r,a,e,o){var i=3*r*Math.pow(o-1,2);var n=-3*a*o+3*a+e*o;var u=t*Math.pow(o-1,3);return o*(i+o*n)-u};var solveCubicBezier=function(t,r,a,e,o){t-=o;r-=o;a-=o;e-=o;var i=solveCubicEquation(e-3*a+3*r-t,3*a-6*r+3*t,3*r-3*t,t);return i.filter((function(t){return t>=0&&t<=1}))};var solveQuadraticEquation=function(t,r,a){var e=r*r-4*t*a;if(e<0){return[]}else{return[(-r+Math.sqrt(e))/(2*t),(-r-Math.sqrt(e))/(2*t)]}};var solveCubicEquation=function(t,r,a,e){if(t===0){return solveQuadraticEquation(r,a,e)}r/=t;a/=t;e/=t;var o=(3*a-r*r)/3;var i=(2*r*r*r-9*r*a+27*e)/27;if(o===0){return[Math.pow(-i,1/3)]}else if(i===0){return[Math.sqrt(-o),-Math.sqrt(-o)]}var n=Math.pow(i/2,2)+Math.pow(o/3,3);if(n===0){return[Math.pow(i/2,1/2)-r/3]}else if(n>0){return[Math.pow(-(i/2)+Math.sqrt(n),1/3)-Math.pow(i/2+Math.sqrt(n),1/3)-r/3]}var u=Math.sqrt(Math.pow(-(o/3),3));var s=Math.acos(-(i/(2*Math.sqrt(Math.pow(-(o/3),3)))));var v=2*Math.pow(u,1/3);return[v*Math.cos(s/3)-r/3,v*Math.cos((s+2*Math.PI)/3)-r/3,v*Math.cos((s+4*Math.PI)/3)-r/3]};export{getTimeGivenProgression as g};