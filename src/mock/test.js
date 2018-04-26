/**
 * Created by Zwh on 2017/10/14.
 */
export const test = [
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
    path: '/add',
    type: 'post',
    data: {
      result: 'success'
    }
  },

  {
    path: '/getHistory/ApplicationInformation/pageNum',
    type: 'get',
    data: {
      result: 'success',
      total: 2
    }
  },
  {
    path: '/getHistory/ApplicationInformation?page=1',
    type: 'get',
    data: {
      result: 'success',
      history: [
        {date: '2017-12-10',
          html: '<!DOCTYPE html>' +
          '<html>' +
          ' <head>' +
          ' </head>' +
          ' <form action="/add" id="table0" method="post">' +
          '  <table border="1" style="border-collapse: collapse; width: 100%;">' +
          '   <tbody>' +
          '    <tr style="height: 57px;">' +
          '     <td colspan="5" style="width: 96.246%; height: 55px;">' +
          '     </td>' +
          '    </tr>' +
          '    <tr style="height: 51px;">' +
          '     <td style="width: 11.1458%; height: 55px;">' +
          '      Name' +
          '     </td>' +
          '     <td style="width: 25%; height: 51px;">' +
          '<html>' +
          ' <body>' +
          '  <input name="0" type="text"/>' +
          ' </body>' +
          '</html>' +
          '     </td>' +
          '     <td style="width: 12.8125%; height: 51px;">' +
          '      Sex' +
          '     </td>' +
          '     <td style="width: 24.6541%;">' +
          '<html>' +
          ' <body>' +
          '  <input name="1" type="radio" value="female"/>' +
          '  female' +
          ' </body>' +
          '</html><html>' +
          ' <body>' +
          '  <input name="1" type="radio" value="male"/>' +
          '  male' +
          ' </body>' +
          '</html>' +
          '     </td>' +
          '     <td style="width: 22.6336%; height: 51px;">' +
          '     </td>' +
          '    </tr>' +
          '    <tr style="height: 49px;">' +
          '     <td style="width: 11.1458%; height: 55px;">' +
          '      City' +
          '     </td>' +
          '     <td style="width: 25%; height: 49px;">' +
          '<html>' +
          ' <body>' +
          '  <input name="2" type="t"/>' +
          ' </body>' +
          '</html>' +
          '     </td>' +
          '     <td style="width: 12.8125%; height: 49px;">' +
          '     </td>' +
          '     <td style="width: 24.6541%;">' +
          '     </td>' +
          '     <td style="width: 22.6336%; height: 49px;">' +
          '     </td>' +
          '    </tr>' +
          '    <tr style="height: 65px;">' +
          '     <td colspan="5" style="width: 11.1458%; height: 55px;">' +
          '      Are you a citizen of the United States?                            If so, when?' +
          '<html>' +
          ' <body>' +
          '  <input name="3" type="radio" value="no"/>' +
          '  no' +
          ' </body>' +
          '</html><html>' +
          ' <body>' +
          '  <input name="3" type="radio" value="yes"/>' +
          '  yes' +
          ' </body>' +
          '</html>' +
          '     </td>' +
          '    </tr>' +
          '   </tbody>' +
          '  </table>' +
          '<html>' +
          ' <body>' +
          '  <input type="submit"/>' +
          ' </body>' +
          '</html>' +
          ' </form>' +
          '</html>'},
        {date: '2017-12-19',
          html: "<!DOCTYPE html>\n<html>\n <head>\n </head>\n <body>\n  <table border=\"1\" style=\"border-collapse: collapse; width: 100%;\">\n   <tbody>\n    <tr style=\"height: 57px;\">\n     <td colspan=\"5\" style=\"width: 96.246%; height: 55px;\">\n     </td>\n    </tr>\n    <tr style=\"height: 51px;\">\n     <td style=\"width: 11.1458%; height: 55px;\">\n      Name\n     </td>\n     <td style=\"width: 25%; height: 51px;\">\n      111\n     </td>\n     <td style=\"width: 12.8125%; height: 51px;\">\n      Sex\n     </td>\n     <td style=\"width: 24.6541%;\">\n<html>\n <body>\n  <input checked=\"checked\" disabled=\"\" type=\"radio\"/>\n  male\n </body>\n</html><html>\n <body>\n  <input disabled=\"\" type=\"radio\"/>\n  female\n </body>\n</html>\n     </td>\n     <td style=\"width: 22.6336%; height: 51px;\">\n     </td>\n    </tr>\n    <tr style=\"height: 49px;\">\n     <td style=\"width: 11.1458%; height: 55px;\">\n      City\n     </td>\n     <td style=\"width: 25%; height: 49px;\">\n     </td>\n     <td style=\"width: 12.8125%; height: 49px;\">\n     </td>\n     <td style=\"width: 24.6541%;\">\n     </td>\n     <td style=\"width: 22.6336%; height: 49px;\">\n     </td>\n    </tr>\n    <tr style=\"height: 65px;\">\n     <td colspan=\"5\" style=\"width: 11.1458%; height: 55px;\">\n      Are you a citizen of the United States? \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0If so, when?\n<html>\n <body>\n  <input disabled=\"\" type=\"radio\"/>\n  yes\n </body>\n</html><html>\n <body>\n  <input checked=\"checked\" disabled=\"\" type=\"radio\"/>\n  no\n </body>\n</html>\n     </td>\n    </tr>\n   </tbody>\n  </table>\n </body>\n</html>\n"}]
    }
  },
  {
    path: '/update/ApplicationInformation',
    type: 'post',
    data: {
      result: 'success',
      data: '<!DOCTYPE html>' +
      '<html>' +
      ' <head>' +
      ' </head>' +
      ' <form action="/add" id="table0" method="post">' +
      '  <table border="1" style="border-collapse: collapse; width: 100%;">' +
      '   <tbody>' +
      '    <tr style="height: 57px;">' +
      '     <td colspan="5" style="width: 96.246%; height: 55px;">' +
      '     </td>' +
      '    </tr>' +
      '    <tr style="height: 51px;">' +
      '     <td style="width: 11.1458%; height: 55px;">' +
      '      Name' +
      '     </td>' +
      '     <td style="width: 25%; height: 51px;">' +
      '<html>' +
      ' <body>' +
      '  <input name="0" type="text"/>' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '     <td style="width: 12.8125%; height: 51px;">' +
      '      Sex' +
      '     </td>' +
      '     <td style="width: 24.6541%;">' +
      '<html>' +
      ' <body>' +
      '  <input name="1" type="radio" value="female"/>' +
      '  female' +
      ' </body>' +
      '</html><html>' +
      ' <body>' +
      '  <input name="1" type="radio" value="male"/>' +
      '  male' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '     <td style="width: 22.6336%; height: 51px;">' +
      '     </td>' +
      '    </tr>' +
      '    <tr style="height: 49px;">' +
      '     <td style="width: 11.1458%; height: 55px;">' +
      '      City' +
      '     </td>' +
      '     <td style="width: 25%; height: 49px;">' +
      '<html>' +
      ' <body>' +
      '  <input name="2" type="t"/>' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '     <td style="width: 12.8125%; height: 49px;">' +
      '     </td>' +
      '     <td style="width: 24.6541%;">' +
      '     </td>' +
      '     <td style="width: 22.6336%; height: 49px;">' +
      '     </td>' +
      '    </tr>' +
      '    <tr style="height: 65px;">' +
      '     <td colspan="5" style="width: 11.1458%; height: 55px;">' +
      '      Are you a citizen of the United States?                            If so, when?' +
      '<html>' +
      ' <body>' +
      '  <input name="3" type="radio" value="no"/>' +
      '  no' +
      ' </body>' +
      '</html><html>' +
      ' <body>' +
      '  <input name="3" type="radio" value="yes"/>' +
      '  yes' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '    </tr>' +
      '   </tbody>' +
      '  </table>' +
      '<html>' +
      '</html>' +
      ' </form>' +
      '</html>'
    }
  },
  {
    path: '/ApplicationInformation/download?page=1',
    type: 'get',
    data: {
      result: 'success'
    }
  },
  {
    path: '/submit/ApplicationInformation',
    type: 'post',
    data: {
      result: 'success'
    }
  },
  {
    path: '/getFormDetail/ApplicationInformation',
    type: 'get',
    data: {
      result: 'success',
      data: '<!DOCTYPE html>' +
      '<html>' +
      ' <head>' +
      ' </head>' +
      ' <form action="/add" id="table" method="post">' +
      '  <table border="1" style="border-collapse: collapse; width: 100%;">' +
      '   <tbody>' +
      '    <tr style="height: 57px;">' +
      '     <td colspan="5" style="width: 96.246%; height: 55px;">' +
      '     </td>' +
      '    </tr>' +
      '    <tr style="height: 51px;">' +
      '     <td style="width: 11.1458%; height: 55px;">' +
      '      Name' +
      '     </td>' +
      '     <td style="width: 25%; height: 51px;">' +
      '<html>' +
      ' <body>' +
      '  <input name="0" type="text"/>' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '     <td style="width: 12.8125%; height: 51px;">' +
      '      Sex' +
      '     </td>' +
      '     <td style="width: 24.6541%;">' +
      '<html>' +
      ' <body>' +
      '  <input name="1" type="radio" value="female"/>' +
      '  female' +
      ' </body>' +
      '</html><html>' +
      ' <body>' +
      '  <input name="1" type="radio" value="male"/>' +
      '  male' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '     <td style="width: 22.6336%; height: 51px;">' +
      '     </td>' +
      '    </tr>' +
      '    <tr style="height: 49px;">' +
      '     <td style="width: 11.1458%; height: 55px;">' +
      '      City' +
      '     </td>' +
      '     <td style="width: 25%; height: 49px;">' +
      '<html>' +
      ' <body>' +
      '  <input name="2" type="t"/>' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '     <td style="width: 12.8125%; height: 49px;">' +
      '     </td>' +
      '     <td style="width: 24.6541%;">' +
      '     </td>' +
      '     <td style="width: 22.6336%; height: 49px;">' +
      '     </td>' +
      '    </tr>' +
      '    <tr style="height: 65px;">' +
      '     <td colspan="5" style="width: 11.1458%; height: 55px;">' +
      '      Are you a citizen of the United States?                            If so, when?' +
      '<html>' +
      ' <body>' +
      '  <input name="3" type="radio" value="no"/>' +
      '  no' +
      ' </body>' +
      '</html><html>' +
      ' <body>' +
      '  <input name="3" type="radio" value="yes"/>' +
      '  yes' +
      ' </body>' +
      '</html>' +
      '     </td>' +
      '    </tr>' +
      '   </tbody>' +
      '  </table>' +
      '<html>' +
      '</html>' +
      ' </form>' +
      '</html>'
    }
  },
  // {
  //   path: '/getFormDetail/ApplicationInformation',
  //   type: 'get',
  //   data: {
  //     result: 'success',
  //     data: {
  //       name: 'ApplicationInformation',
  //       rows: [
  //         {
  //           columns: [{label: 'Last Name', field: 'last_name', type: 'text', required: 'true'}, {label: 'First', field: 'first_name', type: 'text'}, {label: 'M.I', field: 'M_I', type: 'text'}]
  //         },
  //         {
  //           columns: [{label: 'Street Address', field: 'street_Address', type: 'text'}, {label: 'Apartment/Unit #', field: 'apartment', type: 'text'}]
  //         },
  //         {
  //           columns: [{label: 'City', field: 'city', type: 'text'}, {label: 'State', field: 'state', type: 'text'}, {label: 'ZIP', field: 'zip', type: 'text'}]
  //         },
  //         {
  //           columns: [{label: 'Phone #', field: 'phone', type: 'text'}, {label: 'Alternate #', field: 'alternate', type: 'text'}]
  //         },
  //         {
  //           columns: [{label: 'Email Address', field: 'email_Address', type: 'text'}, {label: 'Hired Date', field: 'hired_Date', type: 'text'}, {label: 'Terminated Date', field: 'terminated_Date', type: 'text'}]
  //         },
  //         {
  //           columns: [{label: 'Driver’s License #', field: 'driver_License', type: 'text'}, {label: 'Issued State', field: 'issued_State', type: 'text'}, {label: 'Expiration Date', field: 'expiration_Date', type: 'text'}]
  //         },
  //         {
  //           columns: [{label: 'Are you a citizen of the United States?', field: 'citizenOfUS', type: 'radio', option: 'YES,NO'},
  //             {label: 'If no, are you authorized to work in the U.S.?', field: 'workInUS', type: 'radio', option: 'YES,NO'}]
  //         },
  //         {
  //           columns: [{label: 'Have you ever worked for this company?', field: 'workForConmpany', type: 'radio', option: 'YES,NO'},
  //             {label: 'If so, when?', field: 'timeWorkForConmpany', type: 'text'}]
  //         },
  //         {
  //           columns: [{label: 'Have you ever been convicted of a felony?', field: 'isFelony', type: 'radio', option: 'YES,NO'},
  //             {label: 'If yes, explain', field: 'reasonForFelony', type: 'text'}]
  //         }
  //       ]
  //     }
  //   }
  // },
  // {
  //   path: '/getHistory/ApplicationInformation?page=1',
  //   type: 'get',
  //   data: {
  //     result: 'success',
  //     data: {
  //       historyTable: [
  //         {
  //           date: '2017-11-21',
  //           last_name: '123dasasdsadasdasdasas',
  //           first_name: '456',
  //           M_I: 'asd',
  //           alternate: 'asd',
  //           apartment: 'asd',
  //           citizenOfUS: 'NO',
  //           city: 'asd',
  //           driver_License: 'asd',
  //           email_Address: 'asd',
  //           expiration_Date: 'asd',
  //           hired_Date: 'asd',
  //           isFelony: 'YES',
  //           issued_State: 'asd',
  //           phone: 'asd',
  //           reasonForFelony: 'asd',
  //           state: 'asd',
  //           street_Address: 'asd',
  //           terminated_Date: 'asd',
  //           timeWorkForConmpany: 'asd',
  //           workForConmpany: 'YES',
  //           workInUS: 'YES',
  //           zip: 'asd'
  //         },
  //         {
  //           date: '2017-11-20',
  //           last_name: '123',
  //           first_name: '4',
  //           M_I: 'ad',
  //           alternate: 'ad',
  //           apartment: 'asd',
  //           citizenOfUS: 'NO',
  //           city: 'asd',
  //           driver_License: 'asd',
  //           email_Address: 'ad',
  //           expiration_Date: 'asd',
  //           hired_Date: 'asd',
  //           isFelony: 'YES',
  //           issued_State: 'asd',
  //           phone: 'asd',
  //           reasonForFelony: 'ad',
  //           state: 'asd',
  //           street_Address: 'ad',
  //           terminated_Date: 'ad',
  //           timeWorkForConmpany: 'ad',
  //           workForConmpany: 'YES',
  //           workInUS: 'YES',
  //           zip: 'asd'
  //         }
  //       ]
  //     }
  //   }
  // }
]
