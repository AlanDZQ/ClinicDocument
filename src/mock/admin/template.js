export const manageTemplate = [
  {
    path: /\/admin\/getTemplate\/\d/,
    type: 'get',
    data: {
      result: 'success',
      treeData: [
        {
          id: 111,
          label: 'PersonnelManagement',
          name: 'Personnel Management',
          children: [{
            id: 222,
            label: 'DoctorInformation',
            name: 'Doctor Information',
            finished: true
          }]
        }, {
          id: 555,
          label: 'equipment',
          name: 'equipment',
          children: [{
            id: 666,
            label: 'Leveltwo2-1',
            name: 'Level two 2-1',
            finished: true
          }, {
            id: 777,
            label: 'Leveltwo2-2',
            name: 'Level two 2-2',
            finished: true
          }]
        }
        ]
    }
  },
  {
    path: '/admin/getAllFinishedTemplate',
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
              id: 111,
              label: 'PersonnelManagement',
              name: 'Personnel Management',
              children: [{
                id: 222,
                label: 'DoctorInformation',
                name: 'Doctor Information',
                finished: true
              },
              {
                id: 333,
                label: 'NurseInformation',
                name: 'Nurse Information',
                finished: false
              }]
            }, {
              id: 555,
              label: 'equipment',
              name: 'equipment',
              children: [{
                id: 666,
                label: 'Leveltwo2-1',
                name: 'Level two 2-1',
                finished: true
              }, {
                id: 777,
                label: 'Leveltwo2-2',
                name: 'Level two 2-2',
                finished: true
              }]
            }
          ]
        }]
    }
  },
  {
    path: /\/admin\/deleteTemplate\/\d/,
    type: 'delete',
    data: {
      result: 'success'
    }
  },
  {
    path: '/admin/getAllCategory',
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
              id: 111,
              label: 'PersonnelManagement',
              name: 'Personnel Management',
              children: []
            }, {
              id: 555,
              label: 'equipment',
              name: 'equipment',
              children: []
            }
          ]
        }]
    }
  },
  {
    path: '/admin/getAllTemplate',
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
              id: 111,
              label: 'PersonnelManagement',
              name: 'Personnel Management',
              children: [{
                id: 222,
                label: 'DoctorInformation',
                name: 'Doctor Information',
                finished: true
              },
              {
                id: 333,
                label: 'NurseInformation',
                name: 'Nurse Information',
                finished: false
              },
              {
                id: 444,
                label: 'PatientInformation',
                name: 'Patient Information',
                finished: false
              }]
            }, {
              id: 555,
              label: 'equipment',
              name: 'equipment',
              children: [{
                id: 666,
                label: 'Leveltwo2-1',
                name: 'Level two 2-1',
                finished: true
              }, {
                id: 777,
                label: 'Leveltwo2-2',
                name: 'Level two 2-2',
                finished: false
              }]
            }
          ]
        }]
    }
  },
  {
    path: '/admin/createTemplate',
    type: 'post',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/admin\/getTemplateDetail\/\d/,
    type: 'get',
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
        '<td style="width: 17.2317%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;No.1</td>',
        '<td style="width: 11.9048%; height: 49px;">',
        '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; First</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; No.2</td>',
        '<td style="width: 16.6667%; height: 49px;">',
        '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; M.I.</p>',
        '</td>',
        '<td style="width: 16.6667%; height: 49px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;No.3</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 5.06387%; height: 230px; text-align: center;" rowspan="5"><br />',
        '<p>&nbsp;</p>',
        '<p>Work Experience</p>',
        '<p>&nbsp;</p>',
        '<p>&nbsp;</p>',
        '</td>',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">Starting and Ending Months</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">Work Unit</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">Main Duty</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">',
        '<p>No.4</p>',
        '</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">',
        '<p>No.5</p>',
        '</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">',
        '<p>No.6</p>',
        '</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="height: 46px; width: 29.7139%; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '<td style="height: 46px; width: 31.9856%; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '<td style="height: 46px; width: 33.2713%; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '</tr>',
        '<tr style="height: 46px;">',
        '<td style="width: 29.7139%; height: 46px; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '<td style="width: 31.9856%; height: 46px; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '<td style="width: 33.2713%; height: 46px; text-align: center;" colspan="2">',
        '<p></p>',
        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</body>',
        '</html>'].join(''),
      questionForm: [
        { position: 1, type: 'text' },
        { position: 2, type: 'text' },
        { position: 3, type: 'radio' },
        { type: 'table', row: 4, col: [{position: 4, type: 'table:1-1'}, {position: 5, type: 'table:1-2'}, {position: 6, type: 'table:1-3'}] }
      ],
      Nub: 4
    }
  },
  {
    path: /\/admin\/getFinishedTemplateDetail\/\d/,
    type: 'get',
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
        '</tbody>',
        '</table>',
        '</body>',
        '</html>'].join(''),
      title: '123',
      introduction: '123456',
      questionForm: [
        {
          label: 'Id',
          loading: true,
          option: '',
          position: 1,
          relation: false,
          required: true,
          selectedCategory: [],
          selectedPosition: '',
          type: 'text',
          unique: true
        },
        {
          label: 'Name',
          loading: true,
          option: '',
          position: 2,
          relation: false,
          required: true,
          selectedCategory: [],
          selectedPosition: '',
          type: 'text',
          unique: true
        },
        {
          label: 'Gender',
          loading: true,
          option: 'male,female',
          position: 3,
          relation: false,
          required: true,
          selectedCategory: [],
          selectedPosition: '',
          type: 'select',
          unique: false
        }
      ],
      Nub: 3
    }
  },
  {
    path: /\/admin\/postQuestion\/\d/,
    type: 'post',
    data: {
      result: 'success'
    }
  },
  {
    path: /\/admin\/getQuestion\/\d/,
    type: 'get',
    data: {
      result: 'success',
      data: [
        {
          value: 1,
          label: 'First Name?'
        },
        {
          value: 2,
          label: 'Please enter Last Name'
        },
        {
          value: 3,
          label: 'Please enter phone number'
        }
      ]
    }
  }
]
