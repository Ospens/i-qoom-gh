import React from 'react'
import DMSLayout from '../../DMSLayout'
import DocFieldsTable from './DocFieldsTable'
import Tabs from '../../../../../elements/Tabs'
import DmsSideBar from '../../DmsSideBar'

const renderTab = () => (
  <div className='dms-content bordered edit-convention'>
    <DocFieldsTable />
  </div>
)

const Content = () => (
  <Tabs className='big-tabs'>
    <div label='Convention - 1' >{renderTab()}</div>
    <div label='Convention - 2' >{renderTab()}</div>
    <div label='Convention - 3' >{renderTab()}</div>
  </Tabs>
)

const EditConvention = () => (
  <DMSLayout
    sidebar={<DmsSideBar />}
    content={<Content />}
  />
)

export default EditConvention