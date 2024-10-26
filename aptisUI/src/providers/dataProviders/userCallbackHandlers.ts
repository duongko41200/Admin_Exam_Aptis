// import type {
//   CreateResult,
//   DataProvider,
//   DeleteResult,
//   GetListResult,
//   GetManyReferenceResult,
//   GetOneResult,
//   UpdateParams,
//   UpdateResult
// } from 'react-admin'
// import dayjs from 'dayjs'
// const userCallbackHandler = {
//   resource: 'users',

//   afterGetList: async (
//     response: GetListResult,
//     dataProvider: DataProvider
//   ): Promise<GetListResult> => {
//     // const { classificationId } = response.data;

//     const fake = [
//       {
//         id: 1,
//         username: 'xx1',
//         name: 'duong',
//         date: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         role: 1,
//         createAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         updateAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM')
//         //   email: 'susdoidfjsd@gmail.com',
//       },
//       {
//         id: 2,
//         username: 'xx2',
//         name: 'duong',
//         date: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         role: 2,
//         createAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         updateAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM')
//         //   email: 'susdoidfjsd@gmail.com',
//       },
//       {
//         id: 3,
//         username: 'xx3',
//         name: 'duongsdfsdf',
//         date: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         role: 3,
//         createAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         updateAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM')
//         //   email: 'susdoidfjsd@gmail.com',
//       },
//       {
//         id: 5,
//         username: 'xx3',
//         name: 'duongsdfsdf',
//         date: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         role: 3,
//         createAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         updateAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM')
//         //   email: 'susdoidfjsd@gmail.com',
//       },
//       {
//         id: 4,
//         username: 'xx3',
//         name: 'duongsdfsdf',
//         date: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         role: 1,
//         createAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//         updateAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM')
//         //   email: 'susdoidfjsd@gmail.com',
//       }
//     ]

//     return {
//       data: fake,
//       total: 1
//     }
//   },

//   afterGetOne: async (
//     response: GetOneResult,
//     dataProvider: DataProvider
//   ): Promise<GetOneResult> => {
//     // const { classificationId } = response.data;
//     const fake = {
//       id: 2,
//       username: 'xx1',
//       name: 'duong',
//       date: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//       role: 2,
//       createAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//       updateAt: dayjs(new Date()).format('YYYY.MM.DD HH:MM'),
//       updateBy: 'duongabc',
//       CreateBy: 'duongko',
//       newPassword: ''
//       //   email: 'susdoidfjsd@gmail.com',
//     }

//     return {
//       data: fake
//     }
//   }
// }

// export default userCallbackHandler
