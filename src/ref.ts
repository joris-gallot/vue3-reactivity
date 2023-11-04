type Dep = Set<any>;
type KeyToDepMap = Map<any, Dep>;

const targetMap = new Map<any, KeyToDepMap>();
let activeEffect: any = null;

const track = (target: any) => {
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get("value");

  if (!deps) {
    deps = new Set();
    depsMap.set("value", deps);
  }

  deps.add(activeEffect);
};

const trigger = (target: object) => {
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    return;
  }

  depsMap.forEach((dep) => dep.forEach((eff) => eff()));
};

export const ref = <T>(target: T) => {
  return new Proxy(
    { value: target },
    {
      get(target, key) {
        track(target);

        const k = key as keyof typeof target;
        return target[k];
      },
      set(target, key, value) {
        const k = key as keyof typeof target;
        target[k] = value;

        trigger(target);

        return true;
      },
    }
  );
};

export const effect = (fn: () => void) => {
  activeEffect = fn;
  fn();
  activeEffect = null;
};
