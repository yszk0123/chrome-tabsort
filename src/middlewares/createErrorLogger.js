// Chrome extensions の場合は、Chrome が catch されなかった Promise を補足して
// console に表示してくれるため、この処理は必要ないかもしれない
export default (options = {}) => {
  return () => (next) => (action) => {
    const returnedValue = next(action);

    // catch 後の Promise を返すと
    // テストなどで reject された Promise を受け取れなくなる
    if (returnedValue && returnedValue.catch) {
      returnedValue.catch((error) => console.error(error));
    }

    return returnedValue;
  };
};
