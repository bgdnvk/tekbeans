import 'reflect-metadata';

//define the injectable decorator
export const tekbean = (): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata('injectable', true, target);
  };
};

export class IoContainer {
  // The private instances property will be used to store instances of classes that have already been created.
  private instances: Map<Function, any> = new Map();

  // The resolve() method takes a constructor function as an argument and returns a new instance of that class.
  public resolve<T>(target: { new (...args: any[]): T }): T {
    // Retrieve the dependencies of the target class from its metadata. If no metadata is found, the injectables array will be empty.
    const injectables: any[] = Reflect.getMetadata('design:paramtypes', target) || [];

    // Create a stack to keep track of the dependencies that still need to be resolved.
    const stack = [...injectables];

    // Create an array to store the resolved dependencies.
    const dependencies = [];

    // Keep looping while there are dependencies on the stack.
    while (stack.length > 0) {
      // Get the next dependency from the stack.
      const dependency = stack.pop();

      // If the dependency has already been resolved, add it to the dependencies array.
      if (this.instances.has(dependency)) {
        dependencies.push(this.instances.get(dependency));
      } else {
        // Otherwise, resolve the dependency by creating a new instance of it and adding it to the instances map.
        const instance = new dependency();
        this.instances.set(dependency, instance);
        dependencies.push(instance);

        // Get the dependencies of the new instance and add them to the stack.
        const injectables = Reflect.getMetadata('design:paramtypes', dependency) || [];
        stack.push(...injectables);
      }
    }

    // If an instance of the target class has already been created, return it from the instances map.
    if (this.instances.has(target)) {
      return this.instances.get(target);
    }

    // Otherwise, create a new instance of the target class using the spread syntax and the dependencies array, and add it to the instances map.
    const instance = new target(...dependencies);
    this.instances.set(target, instance);

    // Return the new instance of the target class.
    return instance;
  }
}