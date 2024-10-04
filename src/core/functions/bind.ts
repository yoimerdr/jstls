export function bind<F extends (...args: any) => any>(fn: F, thisArg: ThisParameterType<F>): OmitThisParameter<F> {
  return fn.bind(thisArg);
}
