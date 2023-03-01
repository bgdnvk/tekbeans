import { tekbean, IoContainer } from "../src/main";

class Example{

    constructor() {
        console.log('creating Example class')
    }
    public talk(): void {
        console.log('Hello, World!');
    }
}

@tekbean()
class InjectedBean{
  private example: Example;

  constructor(example: Example) {
    console.log('init injected bean class')
    this.example= example;
  }

  public doSomething(): void {
    this.example.talk();
  }
}

// use the container to track the DIs
const container = new IoContainer();
const injectedBean = container.resolve(InjectedBean);
injectedBean.doSomething();