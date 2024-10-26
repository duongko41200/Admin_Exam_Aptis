export const typeText = [
  {
    id: '1',
    name: 'sentence'
  },

  {
    id: '2',
    name: 'word'
  }
]

export const typeName = {
  sentence: 1,
  word: 2
}

const roleApiDesktopApp = ['text','video','speak','writting','flash-card']

export const validUrlApi = (resource: string): boolean => {
  
  return roleApiDesktopApp.includes(resource)
}
