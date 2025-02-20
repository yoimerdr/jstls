import {IncludeThisParameter, Instanceable, Keys} from "../index";
import {KeyableObject, ThisObjectKeys} from "../objects";

export type ES5ClassPrototypeDescriptor<T> = {
  [P in Keys<T>]?: IncludeThisParameter<T[P], T, never> & Required<ThisType<T>>;
}

export type ES5ClassStaticDescriptor<I extends Instanceable> = {
  [P in Keys<I>]?: IncludeThisParameter<I[P], I, I[P]>;
}

export interface ES5ClassOptions<T, I extends Instanceable = any> {
  statics?: Partial<ThisObjectKeys<I>>
  statidescriptor?: KeyableObject<PropertyDescriptor & ThisType<I>>;
  prototype: Partial<ThisObjectKeys<T>>;
  protodescriptor?: KeyableObject<PropertyDescriptor> & ThisType<T>;
}
