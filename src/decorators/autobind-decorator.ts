namespace App {
  export function Autobind(
    _1: any,
    _2: string | Symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    // console.log("descriptor :>> ", descriptor, target, name);
    const originalMethod = descriptor.value;
    const newDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        const bindFn = originalMethod.bind(this);
        return bindFn;
      },
    };
    return newDescriptor;
  }
}
