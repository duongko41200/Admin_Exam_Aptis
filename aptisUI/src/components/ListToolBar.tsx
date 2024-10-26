import { Button } from '@mui/material'
import { UPDATED_SUCCESS } from '../consts/general'
import dataProvider from '../providers/dataProviders/dataProvider'
import { CreateButton, TopToolbar, useNotify } from 'react-admin'

export const ListToolBar = ({
  isShowCreate,
  resource
}: {
  isShowCreate: boolean
  resource?: any
}) => {
  const notify = useNotify()

  const handleReset = async () => {
    try {
      const data = await dataProvider.resetData('text', {})

      await notify(UPDATED_SUCCESS, {
        type: 'success'
      })
    } catch (error) {
      notify('エラー: 生産管理の更新に失敗しました: ' + error, {
        type: 'warning'
      })
    }
  }

  const handleExport = async () => {
    try {
      const data = await dataProvider.exportDataByJson('writting', {})
      await notify('Export thành công', {
        type: 'success'
      })
    } catch (error) {
      notify('エラー: 生産管理の更新に失敗しました: ' + error, {
        type: 'warning'
      })
    }
  }

  const handleSynch = async () => {
    try {
      const data = await dataProvider.synchData('text')

      await notify(UPDATED_SUCCESS, {
        type: 'success'
      })
    } catch (error) {
      notify('エラー: 生産管理の更新に失敗しました: ' + error, {
        type: 'warning'
      })
    }
  }
  return (
    <TopToolbar>
      {resource && (resource == 'text' || resource == 'writting') && (
        <>
          {resource == 'text' && (
            <>
              {' '}
              <Button
                variant="text"
                sx={{
                  '&.MuiButton-root': {
                    lineHeight: 'inherit !important',
                    padding: '4px 5px !important'
                  }
                }}
                onClick={handleSynch}
              >
                Đồng bộ
              </Button>
              <Button
                variant="text"
                sx={{
                  '&.MuiButton-root': {
                    lineHeight: 'inherit !important',
                    padding: '4px 5px !important'
                  }
                }}
                onClick={handleReset}
              >
                Reset
              </Button>
            </>
          )}

          {resource == 'writting' && (
            <Button
              variant="text"
              sx={{
                '&.MuiButton-root': {
                  lineHeight: 'inherit !important',
                  padding: '4px 5px !important'
                }
              }}
              onClick={handleExport}
            >
              Export
            </Button>
          )}
        </>
      )}

      {isShowCreate && <CreateButton label="新規登録" />}
    </TopToolbar>
  )
}
