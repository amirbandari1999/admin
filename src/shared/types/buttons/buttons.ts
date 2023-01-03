import {ReactElement} from 'react'

export interface IButtonBlue {
  handleClick: () => void
  title: string
  icon?: ReactElement
  width?: 'width128' | 'width150' | 'width174' | 'width183' | 'width190'
  fullWidth?: boolean
  padding?: 'padding34' | 'padding16'
  disabled?: boolean
  color?: 'colorGray' | 'colorLightBlue'
  size?: 'small' | 'medium' | 'large'
}
