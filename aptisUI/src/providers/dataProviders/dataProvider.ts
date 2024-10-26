import { withLifecycleCallbacks } from 'react-admin'

import baseDataProvider from './baseDataProvider'

/**
 * NOTE:Limitation of withLifecycleCallbacks
 * Ref: https://marmelab.com/react-admin/withLifecycleCallbacks.html#limitations
 * For some cases, withLifecycleCallbacks is hard to handle errors and can not guarantee data consistency. If needed, we can change business logic to handleSave function of Form: See `src\views\Animals\AnimalEdit.tsx`
 */
const dataProvider = withLifecycleCallbacks(baseDataProvider, [
  // userCallbackHandler,
  // productsCallbackHandler,
])

export default dataProvider
