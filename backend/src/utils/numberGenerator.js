module.exports = () => {
  const y = new Date().getFullYear();
  return `${y}-${Date.now().toString().slice(-8)}`;
};
