//----------
//  React Imports
//----------
import { useEffect, useState } from 'react'

//----------
//  MUI Lib
//----------
import { Card, Avatar, Stack } from '@mui/material'

//----------
//  Ant Design
//----------
import { Table, Input } from 'antd'

//----------
//  Other Library Imports
//----------
import { toast } from 'react-hot-toast'
import axios from 'axios'

//----------
//  Other Library Imports
//----------
import { useAuth } from 'src/hooks/useAuth'

//----------
//  Constants
//----------
const sorter = ['ascend', 'descend']

const DueRequest = () => {
  const auth = useAuth()
  //----------
  // States
  //----------
  const [history, setHistory] = useState([])
  const [pagination, setPagination] = useState({
    pageSize: 10, // Initial page size
    current: 1 // Initial current page
  })
  const [searchedText, setSearchedText] = useState('')
  useEffect(() => {
    const loadData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/franchisepanel/dues/report`, {
          headers: {
            Authorization: `Bearer ${localStorage.accessToken}`
          }
        })
        .then(response => {
          const tempData = response.data.map((d, key) => {
            return { key, ...d }
          })
          setHistory(tempData)
        })
        .catch(error => {
          if (error) {
            toast.error(
              `${error.response ? error.response.status : ''}: ${error.response ? error.response.data.message : error}`
            )
            if (error.response && error.response.status == 401) {
              auth.logout()
            }
          }
        })
    }
    loadData()
  }, [])

  const openImageinNewTab = url => {
    window.open(url, '_blank')
  }

  //----------
  //  Json Array
  //----------
  const columns = [
    {
      title: 'SN#',
      dataIndex: 'key',
      width: 60,
      render: (text, record, index) => index + 1,
      sorter: (a, b) => a.key - b.key
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 250,
      render: (text, record) => `${record.first_name} ${record.last_name}`,
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.first_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.last_name)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.amount)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.payment_mode)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.posted_date)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim()) ||
          String(record.status)
            .replace(' ', '')
            .toLowerCase()
            .trim()
            .includes(value.replace(' ', '').toLowerCase().trim())
        )
      }
    },
    {
      title: `Amount (${process.env.NEXT_PUBLIC_CURRENCY})`,
      dataIndex: 'amount',
      width: 150,
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Pay Proof',
      dataIndex: 'pp',
      width: 200,
      render: (text, record) => (
        <Stack direction='row' spacing={2}>
          <Avatar
            alt='Remy Sharp'
            src={record.pay_proof}
            onClick={() => {
              openImageinNewTab(record.pay_proof)
            }}
          />
        </Stack>
      )
    },
    {
      title: 'Payment Mode',
      dataIndex: 'payment_mode',
      width: 200,
      sorter: (a, b) => a.payment_mode.localeCompare(b.payment_mode)
    },
    {
      title: 'Request Date',
      dataIndex: 'posted_date',
      width: 150,
      render: (text, record) => new Date(record.posted_date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.posted_date) - new Date(b.posted_date)
    },
    {
      title: 'Remark',
      dataIndex: 'admin_remark',
      width: 250,
      sorter: (a, b) => a.admin_remark.localeCompare(b.admin_remark)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 250,
      render: (text, record) => (record.status === 0 ? 'Pending' : record.status === 2 ? 'Cancelled' : 'Approved'),
      sorter: (a, b) => a.status - b.status
    }
  ]

  return (
    <>
      <h4>View Due Request</h4>

      {/* Search Input */}
      <Card component='div' sx={{ position: 'relative', mb: 7, p: 7 }}>
        <Input.Search
          placeholder='Search here.....'
          style={{ maxWidth: 300, marginBottom: 8, display: 'block', height: 50, float: 'right', border: 'black' }}
          onSearch={value => {
            setSearchedText(value)
          }}
          onChange={e => {
            setSearchedText(e.target.value)
          }}
        />

        {/* Table */}
        <Table
          columns={columns}
          dataSource={history}
          loading={false}
          sortDirections={sorter}
          pagination={
            history?.length > 0
              ? {
                  defaultCurrent: 1,
                  total: history?.length,
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) => `Total: ${total}`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  locale: { items_per_page: '' }
                }
              : false
          }
          onChange={pagination => setPagination(pagination)}
        />
      </Card>
    </>
  )
}

export default DueRequest
