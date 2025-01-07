import type { ResourceIF } from '@/types/general'
import Group from '@mui/icons-material/Group'

import { UserCreate, UserEdit, UserList, UserShow } from '../../pages/Users'
import { ReadingList, ReadingCreate, ReadingEdit, ReadingShow } from '../../pages/Reading'
import { Dashboard } from '@mui/icons-material'
import { TestBankList, TestBankCreate, TestBankEdit, TestBankShow } from '../../pages/TestBanks'
import { WritingList, WritingCreate, WritingEdit, WritingShow } from '../../pages/Writing'
import { SpeakingList, SpeakingCreate, SpeakingEdit, SpeakingShow } from '../../pages/Speaking'
import { ListeningList, ListeningCreate, ListeningEdit, ListeningShow } from '../../pages/Listening'

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
    list: SpeakingList,
    edit: SpeakingEdit,
    create: SpeakingCreate,
    show: SpeakingShow,
    icon: Dashboard,
    resource: 'speakings',
    label: 'Speaking'
  },
  {
    list: ListeningList,
    edit: ListeningEdit,
    create: ListeningCreate,
    show: ListeningShow,
    icon: Dashboard,
    resource: 'listenings',
    label: 'Listening'
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
  {
    list: WritingList,
    edit: WritingEdit,
    create: WritingCreate,
    show: WritingShow,
    icon: Dashboard,
    resource: 'writings',
    label: 'Writings'
  },
  {
    list: TestBankList,
    edit: TestBankEdit,
    create: TestBankCreate,
    show: TestBankShow,
    icon: Dashboard,
    resource: 'test-banks',
    label: 'BỘ ĐỀ'
  },




]

export default Resources
