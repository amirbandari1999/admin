import {makeStyles} from '@mui/styles'
import {borderRadius, boxShadow, colors, fontSize, fontWeight, margin} from '../../muiVariables'

const useStylesPopover = makeStyles({
  popover: {
    '& div': {
      borderRadius: borderRadius.bR100px,
    },
    '& .popover-container': {
      fontSize: fontSize.fSn14,
      fontWeight: fontWeight.w500,
      background: colors.darkGreen,
      padding: `${margin.m14} ${margin.m18} ${margin.m14} ${margin.m18}`,
      color: colors.white,
      boxShadow: `${boxShadow.bS0} ${boxShadow.bS4} ${boxShadow.bS8} rgba(0, 0, 0, 0.3)`,
    },
  },
})

export default useStylesPopover
