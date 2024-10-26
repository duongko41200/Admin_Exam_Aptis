import { RecordValue } from '@/types/general'

const baseUploadFolder = 'src/app/api/_uploads/'

const REDIRECT_ROUTE = {
  list: 'list',
  show: 'show',
  create: 'create',
  edit: 'edit'
}

const MAP_RESOURE: Record<string, string> = {
  'term-of-uses': 'termsOfUse',
  acstas: 'acstaManagement',
  licenses: 'license',
  performances: 'performaceManagement',
  'forced-update-managements': 'forcedUpdateManagements',
  'application-masters': 'aplicationMaster'
}

const UPLOAD_FOLDER_MAP = {
  termOfUse: 'term-of-use',
  license: 'license',
  applicationMaster: 'application-master',
  performance: 'performance',
  acsta: 'acsta'
}

const OPERATE_SYSTEM = [
  { id: '0', name: 'IOS' },
  { id: '1', name: 'Android' }
]

const MAP_ACCEPT_TYPE_FILE: RecordValue = {
  performanceManagement: ['assetbundle'],
  applicationMaster: ['jpg', 'png', 'jpeg', 'html', 'hml', 'assetbundle']
}

const CREATED_SUCCESS = 'Tạo Thành Công'
const UPDATED_SUCCESS = 'Cập Nhập Thành Công'

export {
  baseUploadFolder,
  CREATED_SUCCESS,
  MAP_ACCEPT_TYPE_FILE,
  MAP_RESOURE,
  OPERATE_SYSTEM,
  REDIRECT_ROUTE,
  UPDATED_SUCCESS,
  UPLOAD_FOLDER_MAP
}
