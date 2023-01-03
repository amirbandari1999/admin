import {makeStyles} from '@mui/styles'
import {colors, fontSize, fontWeight, margin} from '../../muiVariables'

const useStylesTabs = makeStyles({
  tabButton: {
    '& div': {
      padding: `${margin.m0}`,
    },
    '& button': {
      padding: `${margin.m22}  ${margin.m10}  ${margin.m20} ${margin.m10}`,
    },
  },
  tabStyle: {
    fontSize: fontSize.fSn14,
    '& button.Mui-selected': {
      fontWeight: 'bold',
      color: colors.black,
    },
    '& button': {
      color: colors.black,
      marginLeft: margin.m28,
      fontWeight: fontWeight.w400,
      textTransform: 'capitalize',
      lineHeight: margin.m22,
      '& span': {
        fontWeight: 'bold',
        color: colors.black,
      },
    },
    '@media (max-width: 790px)': {
      '& button': {
        padding: margin.m10,
        display: 'flex',
        '& div': {
          display: 'flex',
          flexDirection: 'column',
        },
        marginLeft: margin.m0,
      },
    },
  },
  indicator: {
    background: colors.blue,
    height: '3px',
  },
})

export default useStylesTabs
