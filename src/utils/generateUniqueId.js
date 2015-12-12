// cf. [Create GUID / UUID in JavaScript?](http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript)

const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export default () => {
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
