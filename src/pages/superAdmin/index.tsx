import React from 'react'
import {Box, CircularProgress} from '@mui/material'
import EnhancedTable from '../../layouts/table/table'
import {UseSuperAdminContext} from '../../context/superAdminContext/superAdminContext'
import {ISuperAdminProps} from '../../context/superAdminContext/superAdminContext.props'

const SuperAdmin = () => {
  const {isLoadingSuperAdmin, rowsOfTable} = UseSuperAdminContext() as ISuperAdminProps

  return (
    <Box component="div" className="super-admin-container">
      <Box className="container-table">
        {!isLoadingSuperAdmin && rowsOfTable && rowsOfTable.length ? (
          <Box className="mb-22">
            <EnhancedTable table="super-admin" rows={rowsOfTable} />
          </Box>
        ) : (
          <Box className="d-flex justify-center mt-40">
            {isLoadingSuperAdmin ? <CircularProgress /> : 'There is not data'}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SuperAdmin
