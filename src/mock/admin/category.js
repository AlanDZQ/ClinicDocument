export const category = [
  {
    path: /\/admin\/category\/\d/,
    type: 'delete',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/admin\/category/,
    type: 'post',
    data: {
      result: 'success',
      category: {
        id: 100,
        label: 'NewCategory',
        name: 'New Category'
      }
    }
  },
  {
    path: /\/admin\/category\/changeName\/\d/,
    type: 'patch',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/admin\/category\/changeParent\/\d/,
    type: 'patch',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/admin\/category\/\d/,
    type: 'delete',
    data: {
      result: 'success'
    }
  }
]
