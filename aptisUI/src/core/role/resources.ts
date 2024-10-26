import type { ResourceIF } from '@/types/general'
import Group from '@mui/icons-material/Group'

import { UserCreate, UserEdit, UserList, UserShow } from '../../pages/Users'
import { ReadingList, ReadingCreate, ReadingEdit, ReadingShow } from '../../pages/Reading'
import { Dashboard } from '@mui/icons-material'



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

  {
    list: ReadingList,
    edit: ReadingEdit,
    create: ReadingCreate,
    show: ReadingShow,
    icon: Dashboard,
    resource: 'readings',
    label: 'Reading'
  },



]

export default Resources
