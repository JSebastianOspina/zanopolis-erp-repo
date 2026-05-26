import { Provider, Type } from '@nestjs/common';

export default function factoryProvider(
  token: string,
  ConcreteImplementation: Type<unknown>,
  MemoryImplementation: Type<unknown>,
): Provider {
  return {
    provide: token,
    useClass:
      process.env.NODE_ENV === 'test'
        ? MemoryImplementation
        : ConcreteImplementation,
  };
}
