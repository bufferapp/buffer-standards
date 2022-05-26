- Props declaration
  ```typescript
      const upgradeCTA = ({ label = 'upgrade' }: { label?: string}) : React.Element => …
  ```
- useful React props types ([ref](https://github.com/typescript-cheatsheets/react#useful-react-prop-type-examples).)
  ```typescript
      export declare interface AppProps {
        children: React.ReactNode;
        functionChildren: (name: string) => React.ReactNode; // recommended function as a child render prop type
        style?: React.CSSProperties; // to pass through style props
        onChange?: React.FormEvent<HTMLInputElement>; // form events! the generic parameter is the type of event.target
        onClick?: React.MouseEventHandler<HTMLButtonElement>,
      }
  ```
- Custom hooks
  ```typescript
      // If you are returning an array in your Custom Hook, you will want to avoid type inference as TypeScript will infer a union type ([ref](https://github.com/typescript-cheatsheets/react#custom-hooks).)
      export function useMath(a: number, b: number) {
        const done = false;
        const [sum, setSum] = useState(0);
        …
        return [sum, done] as const; 
        // infers [number, boolean] instead of (number | boolean)[]
      }
  ```
- Annotatinmg Styled components
  ```typescript
  // This will throw the following error:
  // Type error: Property 'images' does not exist on type 'ReactNode | Detail'.
  //  Property 'images' does not exist on type 'string'.
  margin: 2px 0 ${({content}) => content.images ? '6px' : '0px'} 0;

  //To fix it, you need to specify the Type of the prop
  margin: 2px 0 ${({ content } : { content: Detail }) => content.images ? '24px' : '0px'} 0;
  ```
  
- Generics
  ```typescript
  import React, { useState } from 'react'

  // For props
  interface WithName {
    name: string|null;
  }

  const Foo: React.FC<WithName> = ({ name }) => {
    return <div>{name}</div>
  }

  // To strongly type hooks
  const Bar: React.FC = () => {
    const [state, setState] = useState<WithName>({ name: 'bar' })
    return <div>{state.name}</div>
  }
  ```
