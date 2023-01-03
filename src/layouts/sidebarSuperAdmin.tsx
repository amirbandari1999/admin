import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {Link} from 'react-router-dom'
import {useLocation, useNavigate} from 'react-router'
import LogoutIcon from '@mui/icons-material/Logout'
import clsx from 'clsx'
import '../assets/scss/layout/sidebar/sidebar.scss'
import MakeStyles from '../assets/makeStyles/makeStyles'
import useStylesSidebar from '../assets/makeStyles/sidebar/sidebar'
import UsersIcon from '../assets/images/Icons/usersIcon'
import AuthenticationsApi from '../api/authentication'

const SidebarSuperAdmin = () => {
  const classes = MakeStyles()
  const classesSideBar = useStylesSidebar()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await AuthenticationsApi.logOut()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <Drawer
      classes={{
        paper: clsx(classesSideBar.paper),
        root: classesSideBar.sidebarContainer,
      }}
      variant="permanent"
    >
      <Box component="div">
        <Box>
          <Box className="light-gray-border mt-40 color-light-gray" />
          <List className={`sidebar-menu-wrapper ${classes.lightGray}`}>
            <Box className="mt-20">
              <ListItem
                selected={location.pathname === '/super-admin'}
                button
                component={Link}
                to="/super-admin"
              >
                <ListItemIcon>
                  <UsersIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Box className={`${classesSideBar.textStyle}`}>Super Admin</Box>}
                />
              </ListItem>
            </Box>
          </List>
        </Box>
      </Box>
      <Box component="div" className="sidebar-logout">
        <List className={`sidebar-menu-wrapper ${classes.lightGray}`}>
          <ListItem button onClick={() => handleLogout()}>
            <ListItemIcon>
              <LogoutIcon className={classes.lightGray} />
            </ListItemIcon>
            <ListItemText primary={<Box className={`${classesSideBar.textStyle}`}>Log Out</Box>} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}
export default SidebarSuperAdmin
