// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilSignOutAlt,
} from "@iconscout/react-unicons";

// Analytics Cards imports
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";

// Recent Card Imports


// Sidebar Data
export const SidebarData = [
  {
    icon: UilEstate,
    heading: "Dashboard",
  },
  {
    icon: UilClipboardAlt,
    heading: "Orders",
  },
  {
    icon: UilUsersAlt,
    heading: "Customers",
  },
  {
    icon: UilPackage,
    heading: 'Products'
  },
  {
    icon: UilChart,
    heading: 'Analytics'
  },
];

// Analytics Cards Data
export const cardsData = [
  {
    title: "11",
    color: {
      backGround: "#F2F3F5",
      boxShadow: "0px 10px 20px 0px #F2F3F5",
    },
    barValue: 70,
    value: "25,970",
    png: UilUsdSquare,
    series: [
      {
        name: "Sales",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: "12",
    color: {
      backGround: "#F2F3F5",
      boxShadow: "0px 10px 20px 0px #F2F3F5",
    },
    barValue: 80,
    value: "14,270",
    png: UilMoneyWithdrawal,
    series: [
      {
        name: "Revenue",
        data: [10, 100, 50, 70, 80, 30, 40],
      },
    ],
  },
  // {
  //   title: "1",
  //   color: {
  //     backGround:
  //       "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
  //     boxShadow: "0px 10px 20px 0px #F9D59B",
  //   },
  //   barValue: 60,
  //   value: "4,270",
  //   png: UilClipboardAlt,
  //   series: [
  //     {
  //       name: "Expenses",
  //       data: [10, 25, 15, 30, 12, 15, 20],
  //     },
  //   ],
  // },
];



export const ListData = [
  {
    text: 'connect',
    translate: 'Kết nối',
    structure:'',
    type: 'word',
    createAt: '26-11-2023',
    repeat:'0'
  },
  {
    text: 'I want to school',
    translate: 'Tôi muốn tới trường',
    structure:'V+ Want + to + S',
    type: 'sentence',
    createAt: '26-11-2023',
    repeat:'0'
  },
  {
    text: 'dog',
    translate: 'con chó, con cún',
    structure:'',
    type: 'word',
    createAt: '26-1-2024',
    repeat:'0'
  },
  {
    text: 'I want to school',
    translate: 'Tôi muốn tới trường',
    structure:'V+ Want + to + S',
    type: 'sentence',
    createAt: '26-11-2023',
    repeat:'0'
  },
  {
    text: 'I want to school',
    translate: 'Tôi muốn tới trường',
    structure:'V+ Want + to + S',
    type: 'sentence',
    createAt: '26-11-2023',
    repeat:'0'
  },
]
