module.exports = (fn) => {
  return (response, request, next) => {
    fn(response, request, next).catch(next);
  };
};
