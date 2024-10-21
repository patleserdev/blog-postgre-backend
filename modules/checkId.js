function checkId(id) {
  isValid = true;
  if (typeof id != "number") {
    isValid = false;
  }
//   console.log('1er test',isValid)
  if (isNaN(id)) {
    isValid = false;
  }
//   console.log('2eme test',isValid)

  return isValid
}

module.exports = {checkId};
