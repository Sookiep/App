exports.main = async (event, context) => {
  console.log(event);
  let data = {
      "message": "Hello World 1111"
  };
  return data;
};