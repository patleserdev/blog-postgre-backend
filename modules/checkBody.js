function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) 
    {
      console.log(field,isValid)
    if (!body[field] || body[field] === '') {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody };
