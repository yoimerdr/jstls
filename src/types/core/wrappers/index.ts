import {Instanceable} from "../index";
import {Singleton} from "../../../core/wrappers/singleton";

export interface SingletonConstructor<T extends Singleton<T>> extends Instanceable<T> {}
