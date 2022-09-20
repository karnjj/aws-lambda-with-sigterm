# aws-lambda-with-sigterm

add SIGTERM support for aws lambda

example usage
```ts
import { onSIGTERM } from 'aws-lambda-with-sigterm'
const callback1 = async () => {
  return new Promise<void>((resolve) =>
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
```

Thank inspiration from [aws-lambda-go/enableSIGTERM](https://github.com/aws/aws-lambda-go/blob/main/lambda/sigterm.go)