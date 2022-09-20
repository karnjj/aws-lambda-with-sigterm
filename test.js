const { onSIGTERM } = require('./dist/index');

const callback1 = async () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log('callback1');
      resolve();
    }, 2000),
  );
};

const callback2 = () => {
  console.log('callback2');
};

const main = async () => {
  await onSIGTERM(callback1, callback2);
  setTimeout(() => {
    console.log('Exiting');
  }, 60000);
};

main();
