export const pronunciationToString = (str: string) => {
  const regex = /\/(.*?)\// // Biểu thức chính quy để tìm giá trị giữa hai dấu gạch chéo

  const match = str.match(regex) // Sử dụng match để tìm kiếm
  let ipaValue = ''
  if (match) {
    ipaValue = match[0] // Giá trị bao gồm cả dấu gạch chéo
    console.log(ipaValue) // In ra giá trị /səkˈsɛs/
  } else {
    console.log('Không tìm thấy giá trị IPA.')
	}
	
	return ipaValue
}
