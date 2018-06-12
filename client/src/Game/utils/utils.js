//this method searches array for value and returns true if value is found in array

const searchArray = (array, value) => {
  const temp = [...array];
  let result = temp.find((coord) => JSON.stringify(coord) === JSON.stringify(value));
  if(typeof(result) === "undefined")
  {
    //the value was not found
    return false;
  }else
  {
    return true;
  }
}

export {searchArray}