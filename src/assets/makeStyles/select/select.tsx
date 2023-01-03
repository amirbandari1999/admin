import {makeStyles} from '@mui/styles'
import {border, colors} from '../../muiVariables'

const useStylesSelect = makeStyles({
  selectStyle: {
    '& div': {
      borderRadius: '30px',
      color: 'gray',
      minWidth: '45px',
    },
    '& fieldset': {
      borderRadius: '30px',
      border: `${border.b1}  ${colors.grayBorder} solid`,
    },
  },
})

export default useStylesSelect
