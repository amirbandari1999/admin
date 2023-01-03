import {makeStyles} from '@mui/styles'
import {colors, margin, borderRadius, boxShadow, border} from '../muiVariables'

const MakeStyles = makeStyles({
  colorWhite: {
    color: colors.white,
  },
  textFieldFeedback: {
    minWidth: '350px',
    '& fieldset': {
      border: ' 1px solid rgba(163, 174, 208, 0.2)',
      boxShadow: '14px 17px 40px 2px rgba(112, 144, 176, 0.04)',
      // borderRadius: '30px',
    },
  },
  lightGray: {
    color: colors.lightGray3,
  },
  w100: {
    width: '100%',
  },
  boxShadowNone: {
    boxShadow: 'inherit',
  },
  marginAuto: {
    margin: margin.auto,
  },
  marginRight20: {
    marginRight: margin.m20,
  },
  marginRight10: {
    marginRight: margin.m10,
  },
  marginTop10: {
    marginTop: margin.m10,
  },
  marginTop20: {
    marginTop: margin.m20,
  },
  marginTop26: {
    marginTop: margin.m26,
  },
  marginTop35: {
    marginTop: margin.m36,
  },
  marginTop50: {
    marginTop: margin.m50,
  },
  widthPercent50: {
    width: '50%',
  },
  BorderRadiusRight0: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  bgWhite: {
    background: colors.white,
  },
  bgGray: {
    backgroundColor: colors.grayBorder,
  },
  displayNone: {
    display: 'none',
  },
  colorBlue: {
    color: colors.blue,
  },
  checkboxColor: {
    '& svg': {
      color: colors.checkboxColor,
    },
  },
  colorRed: {
    color: colors.red,
  },
  colorGreen: {
    color: colors.green,
  },
  colorOrange: {
    color: colors.orangePercent,
  },
  bgRed: {
    background: colors.red,
  },
  bgGreen: {
    background: colors.green,
  },
  bgBlue: {
    background: colors.blue,
  },
  bgGreen2: {
    background: colors.lightGreen,
  },
  bgPink: {
    background: colors.pink,
  },
  bgOrange: {
    background: colors.orangePercent,
  },
  colorGray: {
    color: colors.lightGray2,
  },
  textCenter: {
    textAlign: 'center',
  },
  pl0: {
    paddingLeft: margin.m0,
  },
  cardContainer: {
    padding: `${margin.m4}  ${margin.m14}  ${margin.m20} ${margin.m14}`,
  },
  menuItemNoWrap: {
    whiteSpace: 'inherit',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  percentFull: {
    borderRadius: `${borderRadius.bR100}`,
  },
  legendRoot: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
  legendLabel: {
    whiteSpace: 'nowrap',
  },
  mAuto: {
    margin: margin.auto,
    textAlign: 'center',
  },
  pLeft16: {
    paddingLeft: margin.m16,
  },
  active: {
    color: '#0056b3',
    fontWeight: 'bolder',
  },
  textFieldStyle: {
    maxWidth: '272px',
    height: '45px',
    '& fieldset': {
      border: ' 1px solid rgba(163, 174, 208, 0.2)',
      boxShadow: '14px 17px 40px 2px rgba(112, 144, 176, 0.04)',
      borderRadius: '30px',
    },
  },

  inputStyle: {
    borderRadius: '30px',
    color: 'gray',
    '& fieldset': {
      borderRadius: '30px',
      border: `${border.b1}  ${colors.grayBorder} solid`,
    },
    '& input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
      {
        borderRadius: '30px',
        '-webkit-box-shadow': `0 0 0 30px ${colors.grayBorder} inset !important`,
      },
    minWidth: '45px',
  },

  backgroundLightGrayInput: {
    backgroundColor: colors.grayBorder,
    borderTopLeftRadius: borderRadius.bR30,
    borderBottomLeftRadius: borderRadius.bR30,
  },
  creatEventContainer: {
    width: 'calc(100% - 205px)',
    background: colors.white,
    borderRadius: borderRadius.bR15,
    margin: `${margin.m0} auto`,
    marginTop: margin.m30,
    padding: `${margin.m70} ${margin.m0} ${margin.m70} ${margin.m0}`,
    boxShadow: `${boxShadow.bS0} ${boxShadow.bS3} ${boxShadow.bS5} rgba(0, 0, 0, 0.02)`,
    '@media (max-width: 1000px)': {
      width: '100%',
    },
  },
  calendarTextField: {
    '& fieldset': {
      borderRadius: borderRadius.bR30,
      borderColor: 'blue',
    },
  },
  textFieldBorderNone: {
    '& fieldset': {
      border: 'none',
    },
  },
})

export default MakeStyles
