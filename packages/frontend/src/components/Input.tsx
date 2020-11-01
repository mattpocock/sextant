import React, {KeyboardEvent, useEffect, useMemo, useRef, useState} from 'react';

interface ChangeEvent {
  target: {
    value: string
  }
  nativeEvent: React.ChangeEvent<HTMLTextAreaElement>
}

const BASE_CH_UNIT = 2.5;

export const Input = (props: {
  classNames?: {
    input?: string,
    wrapper?: string,
  }
  ignoreKeys?: Array<KeyboardEvent["key"]>
  style?: Record<string, any>
  label: string
  value: string
  onChange: (event: ChangeEvent) => void
}) => {
  const [textareaHeight, setTextareaHeight] = useState<number>(BASE_CH_UNIT); // ch is the measure
  const textareaRef = useRef(null);
  const keysToIgnore = useMemo(() => props.ignoreKeys ? new RegExp(`${props.ignoreKeys.join('|')}`, 'gi') : null, [props.ignoreKeys])
  useEffect(() => {
    const element: HTMLElement | null = textareaRef.current;
    if(element) {
      const width = (element as HTMLElement).getBoundingClientRect().width;
      const charSize = Number(window.getComputedStyle(element).getPropertyValue('font-size').replace('px', ''));
      const charNumberOnCurrentWidth = width / charSize;
      const numberOfLinesOnText = props.value.length / charNumberOnCurrentWidth;
      setTextareaHeight(Math.max(BASE_CH_UNIT ,Math.round(BASE_CH_UNIT * Math.floor(numberOfLinesOnText))) + 0.5) // some extra space
    }
  }, [props.value])

  return (<div
    className={"flex items-center appearance-none break-all mx-0 " + props.classNames?.wrapper || ''}>
      <textarea
        ref={textareaRef}
        className={"appearance-none break-all resize-none w-full bg-transparent " + props.classNames?.input || ''}
        aria-label={props.label}
        value={props.value}
        style={{
          ...props.style || {},
          height: textareaHeight + 'ch'
        }}
        onChange={(e) => {
          if(keysToIgnore){
          console.log('value ', e.target.value.replace(keysToIgnore, ''), e.target.value, keysToIgnore.test(e.target.value), keysToIgnore)
          }
          props.onChange({
            target: {
              value: keysToIgnore ? e.target.value.replace(keysToIgnore, '') : e.target.value // dont append the ignore keys
            },
            nativeEvent: e
          })
        }}
      />
  </div>)
}
