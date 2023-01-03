import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputBase,
  ListItemText,
  OutlinedInput,
} from '@mui/material'
import React, {ChangeEvent, Dispatch} from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useLocation} from 'react-router'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import SelectWithInputSearch from '../../assets/makeStyles/selectWithInputSearch/selectWithInputSearch'
import SearchIcon from '../../assets/images/Icons/searchIcon'
import {INameOfUsers} from '../../shared/types'

const SelectWithSearch2 = ({
  value,
  handleCheckedEvaluatee,
  searchTermEvaluate,
  handleChangeSearchEvaluate,
  view,
  afterStartEvent,
  isLoading,
  nameOfUsers,
  checkedIdOfEvaluatee,
  searchResultsEvaluates,
  setCheckedIdOfEvaluatee,
  checkedItemOfEvaluatee,
  setCheckedItemOfEvaluatee,
}: {
  value: any
  handleCheckedEvaluatee: (value: boolean) => void
  searchTermEvaluate: string
  handleChangeSearchEvaluate: (event: ChangeEvent<HTMLInputElement>) => void
  view: boolean
  afterStartEvent: boolean
  isLoading: boolean
  nameOfUsers: INameOfUsers[]
  searchResultsEvaluates: INameOfUsers[]
  checkedIdOfEvaluatee: {evaluateeId: number}[]
  setCheckedIdOfEvaluatee: Dispatch<React.SetStateAction<{evaluateeId: number}[]>>
  checkedItemOfEvaluatee: {evaluatorId?: number; evaluateeId: number; userName: string}[]
  setCheckedItemOfEvaluatee: Dispatch<
    React.SetStateAction<{evaluateeId: number; userName: string}[]>
  >
}) => {
  const classes = MakeStyles()

  const location = useLocation() as {
    state: {
      createNewEvent?: boolean
      id?: number
    }
  }

  const handleMenuItemEvaluatee = (id: number, userName: string) => {
    if (checkedItemOfEvaluatee.find((item) => item && item.evaluateeId === id)) {
      const removeItem = checkedItemOfEvaluatee
        .filter((item) => {
          if (item.evaluateeId !== id) {
            return true
          }
          return false
        })
        .map((item) => item)

      const removeId = checkedIdOfEvaluatee.filter((item) => item && item.evaluateeId !== id)
      setCheckedIdOfEvaluatee(removeId)

      setCheckedItemOfEvaluatee(removeItem)
    } else {
      setCheckedItemOfEvaluatee([...checkedItemOfEvaluatee, {evaluateeId: id, userName}])
      setCheckedIdOfEvaluatee([...checkedIdOfEvaluatee, {evaluateeId: id}])
    }
  }

  const renderSearchListEvaluates = () => {
    if (!searchTermEvaluate.length) {
      return isLoading ? (
        <Box className="mt-22 mb-22 width-100 text-center">
          <CircularProgress />
        </Box>
      ) : (
        nameOfUsers &&
          nameOfUsers.map((user) => (
            <MenuItem
              dense
              key={user.id}
              onClick={() => handleMenuItemEvaluatee(user.id, user.firstName)}
              value={user.id}
            >
              <Checkbox
                className={`${classes.checkboxColor}`}
                color="default"
                checked={checkedIdOfEvaluatee.some((item) => item && item.evaluateeId === user.id)}
              />
              <ListItemText primary={user.firstName} />
            </MenuItem>
          ))
      )
    }
    return searchResultsEvaluates.length ? (
      searchResultsEvaluates.map((user) => (
        <MenuItem
          dense
          key={user.id}
          onClick={() => handleMenuItemEvaluatee(user.id, user.firstName)}
          value={user.id}
        >
          <Checkbox
            className={`${classes.checkboxColor}`}
            color="default"
            checked={checkedIdOfEvaluatee.some((item) => item && item.evaluateeId === user.id)}
          />
          <ListItemText primary={user.firstName} />
        </MenuItem>
      ))
    ) : (
      <Box className="w-100 text-center mt-22 mb-22">There is not data</Box>
    )
  }

  const stopImmediatePropagation = (e: {
    stopPropagation: () => void
    preventDefault: () => void
  }) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <FormControl size="small" className={` ${classes.w100}`}>
      <InputLabel id="demo-multiple-checkbox-label">Select</InputLabel>
      <Select
        disabled={location.state.createNewEvent ? false : view || afterStartEvent}
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        className={`${classes.bgGray} ${classes.inputStyle}
                `}
        value={value}
        input={<OutlinedInput label="Select" />}
        renderValue={(selected) => selected && selected.join(', ')}
        MenuProps={SelectWithInputSearch}
      >
        <Box className="width-100" onClickCapture={stopImmediatePropagation}>
          <Box className="text-field-search-with-icon">
            <IconButton className="icon-button" aria-label="directions">
              <SearchIcon />
            </IconButton>
            <InputBase
              onKeyUp={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              value={searchTermEvaluate}
              onChange={handleChangeSearchEvaluate}
              className={`${classes.w100} input-base`}
              placeholder="Search user"
              inputProps={{'aria-label': '0'}}
            />
          </Box>
        </Box>
        <Box className="text-field-search-with-icon justify-center">
          <Button onClick={() => handleCheckedEvaluatee(true)}>Check all</Button>
          <Button onClick={() => handleCheckedEvaluatee(false)}>Uncheck all</Button>
        </Box>
        {renderSearchListEvaluates()}
      </Select>
    </FormControl>
  )
}

export default SelectWithSearch2
