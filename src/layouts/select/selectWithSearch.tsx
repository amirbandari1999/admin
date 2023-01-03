import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  ListItemText,
  OutlinedInput,
} from '@mui/material'
import React, {ChangeEvent, Dispatch, useEffect, useState} from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import SelectWithInputSearch from '../../assets/makeStyles/selectWithInputSearch/selectWithInputSearch'
import SearchIcon from '../../assets/images/Icons/searchIcon'
import useStylesSelect from '../../assets/makeStyles/select/select'

const SelectWithSearch = ({
  data,
  id,
  setId,
  isLoading,
  label,
}: {
  data: {name: string; id: number}[]
  id: number
  setId: Dispatch<React.SetStateAction<number>>
  isLoading: boolean
  label: string
}) => {
  const classes = MakeStyles()
  const classesSelects = useStylesSelect()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<{name: string; id: number}[]>([])

  useEffect(() => {
    const results = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setSearchResults(results)
  }, [searchTerm])

  const stopImmediatePropagation = (e: {
    stopPropagation: () => void
    preventDefault: () => void
  }) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const renderMenuItem = () =>
    data && data.length ? (
      data.map((user) => (
        <MenuItem
          className={classes.menuItemNoWrap}
          onClick={() => setId(user.id)}
          key={user.id}
          value={user.id}
        >
          {user.name}
        </MenuItem>
      ))
    ) : (
      <Box className="text-center mt-22 mb-22">No Data</Box>
    )

  const renderSearchList = () => {
    if (!searchTerm.length) {
      return isLoading ? (
        <Box className="mt-22 mb-22 width-100 text-center">
          <CircularProgress />
        </Box>
      ) : (
        renderMenuItem()
      )
    }
    return searchResults.length ? (
      searchResults.map((user) => (
        <MenuItem onClick={() => setId(user.id)} key={user.id} value={user.id}>
          <ListItemText primary={user.name} />
        </MenuItem>
      ))
    ) : (
      <Box className="w-100 text-center mt-22 mb-22">No Data</Box>
    )
  }

  return (
    <FormControl size="small" className={`${classes.w100} ${classesSelects.selectStyle}`}>
      <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        className={`${classes.bgWhite}`}
        value={id}
        input={<OutlinedInput label={label} />}
        MenuProps={SelectWithInputSearch}
      >
        <Box onClickCapture={stopImmediatePropagation}>
          <Box className="text-field-search-with-icon">
            <IconButton className="icon-button" aria-label="directions">
              <SearchIcon />
            </IconButton>
            <InputBase
              onKeyUp={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              value={searchTerm}
              onChange={handleChangeSearch}
              className={`${classes.w100} input-base border-radius-30`}
              placeholder="Search user"
              inputProps={{'aria-label': '0'}}
            />
          </Box>
        </Box>
        {renderSearchList()}
      </Select>
    </FormControl>
  )
}

export default SelectWithSearch
