export const actionDDitems = (projectId, documentId) => (
  [
    {
      title: 'Email',
      icon: 'email-action-icon-2'
    },
    {
      title: 'Copy to folder',
      icon: 'folder-icon'
    },
    {
      title: 'Show details',
      icon: 'common-file-icon',
      link: `/dashboard/projects/${projectId}/documents/${documentId}`
    },
    {
      title: 'Download Files',
      icon: 'download-icon'
    },
    {
      title: 'Edit document',
      icon: 'file-edit-icon',
      link: `/dashboard/projects/${projectId}/documents/${documentId}/edit`
    },
    {
      title: 'Add revision',
      icon: 'revision-icon'
    },
    {
      title: 'Review document',
      icon: 'review-icon'
    }
  ]
)

export const columns = [
  { title: 'DOC-ID', divider: true },
  { title: 'Document Title', divider: true },
  { title: 'DL', divider: true },
  { title: 'Native', divider: true },
  { title: 'Additional', divider: true },
  { title: 'Revision date', divider: true },
  { title: 'Dicipline', divider: true },
  { title: 'Document types', divider: true },
  { title: 'Originating companies', divider: true }
]

export const DtOptions = [
  {
    key: 'certification',
    title: 'Certification'
  },
  {
    key: 'contracts',
    title: 'Contracts'
  },
  {
    key: 'dataSheets',
    title: 'Data Sheets'
  },
  {
    key: 'drawings',
    title: 'Drawings'
  },
  {
    key: 'hsse',
    title: 'HSSE'
  },
  {
    key: 'letters',
    title: 'Letters'
  },
  {
    key: 'reports',
    title: 'Reports'
  },
  {
    key: 'shedules',
    title: 'Shedules'
  }
]

export const reviewStatuses = [
  {
    title: 'Accepted',
    color: 'green',
    count: 23
  },
  {
    title: 'In progress',
    color: 'yellow',
    count: 77
  },
  {
    title: 'Rejected',
    color: 'red',
    count: 0
  },
  {
    title: 'IRF/IFA',
    color: 'gray',
    count: 0
  }
]
