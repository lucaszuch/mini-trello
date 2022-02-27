export function AutoBinder(_: any, _2: string, descriptor: PropertyDescriptor) {
  // _ and _2 are 'convetional' to declare something that won't be used
  const originalHandler = descriptor.value;
  const propDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const bindFunction = originalHandler.bind(this);
      return bindFunction;
    },
  };
  return propDescriptor;
}