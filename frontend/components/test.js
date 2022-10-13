
const output= {};
output.isNew = output.isNew;

export function getOutput(){
    console.log("THE ONE TO CHECK ", output.isNew);
    return output.isNew;
}
export function test(x){
    output.isNew = x; 
}
function updateOutput(){
    getOutput();
}

