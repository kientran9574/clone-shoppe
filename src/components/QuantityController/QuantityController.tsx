import { useState } from 'react'
import InputNumber from '../InputNumber'
import { InputNumberProps } from '../InputNumber/InputNumber'

interface Props extends InputNumberProps {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  classNameWrapper?: string
  onFocusOut?: (value: number) => void
}

const QuantityController = ({ max, onIncrease, onDecrease, onType, value, onFocusOut, ...rest }: Props) => {
  const [localValue, setLocalValue] = useState<number>(Number(value || 1))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }
    onType && onType(_value)
    setLocalValue(_value)
  }
  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }
  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }
  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    // onFocusOut là được truyền từ bên ngoài vào
    // khi mà chúng ta onFocusOut ra thì chúng ta sẽ xuất ra cái value
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div className='ml-10 flex items-center'>
      <button
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
        onClick={decrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        value={value || localValue}
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        onChange={handleChange}
        {...rest}
        onBlur={handleBlur}
      ></InputNumber>
      <button
        className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
        onClick={increase}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}

export default QuantityController
