export const template = [
  {
    path: /\/app\/preview/,
    type: 'post',
    data: {
      result: 'success',
      html: ['<!DOCTYPE html>',
        '<html>',
        '<head>',
        '</head>',
        '<body>',
        '<table style="border-collapse: collapse; width: 100%;" border="1">',
        '<tbody>',
        '<tr style="height: 52px;">',
        '<td style="width: 100%; height: 52px;" colspan="6">',
        '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Applicant Information</p>',
        '</td>',
        '</tr>',
        '<tr style="height: 49px;">',
        '<td style="width: 20.8636%; height: 49px;">',
        '<p>&nbsp; &nbsp; &nbsp; &nbsp; Last Name</p>',
        '</td>',
        '<td style="width: 17.2317%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1</td>',
        '<td style="width: 11.9048%; height: 49px;">',
        '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; First</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2</td>',
        '<td style="width: 16.6667%; height: 49px;">',
        '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; M.I.</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;3</td>',
        '</tr>',
        '<tr style="height: 78px;">',
        '<td style="width: 20.8636%; height: 78px;">',
        '<p>&nbsp; &nbsp; &nbsp;Street Address</p>',
        '</td>',
        '<td style="width: 45.8032%; height: 78px;" colspan="3">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 4</td>',
        '<td style="width: 16.6667%; height: 78px;">',
        '<p>&nbsp; &nbsp; &nbsp;Apartment/Unit #</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 78px;">&nbsp; &nbsp; &nbsp; &nbsp;5</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</body>',
        '</html>'].join('')
    }
  },
  {
    path: /\/app\/getTemplate\/\d/,
    type: 'get',
    data: {
      result: 'success',
      treeData: [
        {
          id: 1,
          label: 'PersonnelManagement',
          name: 'Personnel Management',
          children: [{
            id: 2,
            label: 'DoctorInformation',
            name: 'Doctor Information'
          }]
        }, {
          id: 5,
          label: 'equipment',
          name: 'equipment',
          children: [{
            id: 6,
            label: 'Leveltwo2-1',
            name: 'Level two 2-1'
          }, {
            id: 7,
            label: 'Leveltwo2-2',
            name: 'Level two 2-2'
          }]
        }]
    }
  },
  {
    path: /\/app\/modifyHistory\/\d/,
    type: 'put',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/app\/getTemplateIntroduction\/\d/,
    type: 'get',
    data: {
      result: 'success',
      title: '~~~Information',
      introduction: '~~~~~~~~Introduction~~~~~~~~Introduction<br>~~~~~~~~Introduction~~~~~~~~Introduction<br>~~~~~~~~Introduction\n' +
      '  aaa'

    }
  },
  {
    path: '/app/getTreeTable',
    type: 'get',
    data: {
      result: 'success',
      treeData: [
        {
          id: 0,
          label: 'Root',
          name: 'Root',
          children: [
            {
              id: 1,
              label: 'PersonnelManagement',
              name: 'Personnel Management',
              children: [{
                id: 2,
                label: 'DoctorInformation',
                name: 'Doctor Information'
              },
              {
                id: 3,
                label: 'NurseInformation',
                name: 'Nurse Information'
              },
              {
                id: 4,
                label: 'PatientInformation',
                name: 'Patient Information'
              }]
            }, {
              id: 5,
              label: 'equipment',
              name: 'equipment',
              children: [{
                id: 6,
                label: 'Leveltwo2-1',
                name: 'Level two 2-1'
              }, {
                id: 7,
                label: 'Leveltwo2-2',
                name: 'Level two 2-2'
              }]
            }
          ]
        }]
    }
  },
  {
    path: /\/app\/getQuestion\/\d/,
    type: 'get',
    data: {
      result: 'success',
      questionForm: [
        {
          position: 1,
          type: 'text',
          label: 'First Name?',
          option: '',
          required: true,
          relation: true,
          selectedCategory: [0, 1, 2],
          selectedPosition: 1
        },
        {
          position: 2,
          type: 'radio',
          label: 'Gender?',
          option: 'Male,Female',
          required: true,
          relation: true,
          selectedCategory: [0, 1, 2],
          selectedPosition: 2
        },
        {
          position: 3,
          type: 'select',
          label: 'City?',
          option: 'Beijing,Shanghai,Shenyang,Shenzhen,Guangzhou',
          required: true,
          relation: false,
          selectedCategory: [],
          selectedPosition: ''
        },
        {
          position: 4,
          type: 'textarea',
          label: 'Work Experience?',
          option: '',
          required: false,
          relation: false,
          selectedCategory: [],
          selectedPosition: ''
        },
        {
          position: 5,
          type: 'checkbox',
          label: 'Hobbies',
          option: 'sing,dance,piano,violin',
          required: true,
          relation: false,
          selectedCategory: [],
          selectedPosition: ''
        },
        {
          type: 'table',
          row: 4,
          title: 'Work Experience',
          col: [
            {label: 'Starting and Ending Months',
              type: 'table:1-1',
              position: [4, 7, 10, 13]
              // answer: ['a', 'a', 'a', 'a']
            },
            {label: 'Work Unit',
              type: 'table:1-2',
              position: [4, 7, 10, 13]
              // answer: ['1', '2', '3', '4']
            },
            {label: 'Main Duty',
              type: 'table:1-3',
              position: [4, 7, 10, 13]
              // answer: ['1', '2', '3', '4']
            }
          ]
        }
      ]
    }
  },
  {
    path: /\/app\/getHistory\/\d\?userId=\d&page=\d&limit=\d/,
    type: 'get',
    data: {
      result: 'success',
      total: 2,
      historyList: [
        {
          id: 1,
          date: '2018-01-31',
          name: '×××的个人信息 2018/3/27 10:49',
          info: [
            {
              position: 1,
              type: 'text',
              label: 'First Name?',
              option: '',
              required: true,
              relation: true,
              selectedCategory: [0, 1, 2],
              selectedPosition: 1,
              answer: 'Christopher',
              disabled: false,
              optionArray: [
                {
                  answer: 'Christopher',
                  id: 1
                },
                {
                  answer: 'James',
                  id: 2
                }
              ]
            },
            {
              position: 2,
              type: 'radio',
              label: 'Gender?',
              option: 'Male,Female',
              required: true,
              relation: false,
              selectedCategory: [0, 1, 2],
              selectedPosition: 2,
              disabled: true,
              optionArray: ['Male', 'Female'],
              answer: 'Female'
            },
            {
              position: 3,
              type: 'select',
              label: 'City?',
              option: 'Beijing,Shanghai,Shenyang,Shenzhen,Guangzhou',
              required: true,
              relation: false,
              selectedCategory: [],
              selectedPosition: '',
              disabled: false,
              optionArray: [],
              answer: 'Shenyang'
            },
            {
              position: 4,
              type: 'textarea',
              label: 'Work Experience?',
              option: '',
              required: false,
              relation: false,
              selectedCategory: [],
              selectedPosition: '',
              disabled: false,
              optionArray: [],
              answer: '~~~~~~~'
            },
            {
              position: 5,
              type: 'checkbox',
              label: 'Hobbies',
              option: 'sing,dance,piano,violin',
              required: true,
              relation: false,
              selectedCategory: [],
              selectedPosition: '',
              disabled: false,
              optionArray: ['sing', 'dance', 'piano', 'violin'],
              answer: ['sing', 'dance']
            }
            // {
            //   position: 6,
            //   type: 'picture',
            //   label: 'One inch photo',
            //   option: '',
            //   required: true,
            //   answer: 'url'
            // }
          ]
        },
        {
          id: 2,
          name: '×××的个人信息 2018/3/29 11:20',
          date: '2018-01-30',
          info: [
            {
              position: 1,
              type: 'text',
              label: 'First Name?',
              option: '',
              required: true,
              answer: 'Ferdinand'
            },
            {
              position: 2,
              type: 'radio',
              label: 'Gender?',
              option: 'Male,Female',
              required: true,
              answer: 'Male'
            },
            {
              position: 3,
              type: 'select',
              label: 'City?',
              option: 'Beijing,Shanghai,Shenyang,Shenzhen,Guangzhou',
              required: true,
              answer: 'Shenyang'
            },
            {
              position: 4,
              type: 'textarea',
              label: 'Work Experience?',
              option: '',
              required: false,
              answer: '~~~~~~~'
            },
            {
              position: 5,
              type: 'checkbox',
              label: 'Hobbies',
              option: 'sing,dance,piano,violin',
              required: true,
              answer: ['sing', 'dance']
            },
            {
              position: 6,
              type: 'picture',
              label: 'One inch photo',
              option: '',
              required: true,
              answer: 'url'
            }
          ]
        }
      ]
    }
  },
  {
    path: /\/app\/submitAnswer\/\d/,
    type: 'post',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/app\/deleteHistory\/\d\?userId=\d/,
    type: 'delete',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/app\/getQuestionAnswer\/\d\?QueId=\d&UserId=\d/,
    type: 'get',
    data: {
      result: 'success',
      data: [
        { id: 1, // historyId
          answer: 'Christopher'
        },
        { id: 2,
          answer: 'James'
        }
      ]
    }
  },
  {
    path: /\/app\/getAnswer\?CategoryId=\d&QueId=\d&HistoryId=\d&UserId=\d/,
    type: 'get',
    data: {
      result: 'success',
      answer: 'Female'
    }
  }
]
