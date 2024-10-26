import type { ResourceIF } from '@/types/general'
import Group from '@mui/icons-material/Group'

import { UserCreate, UserEdit, UserList, UserShow } from '../../pages/Users'




const Resources: ResourceIF[] = [

  {
    list: UserList,
    edit: UserEdit,
    create: UserCreate,
    show: UserShow,
    icon: Group,
    resource: 'users',
    label: 'User'
  },



]

export default Resources
