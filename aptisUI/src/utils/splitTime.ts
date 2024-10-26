function splitTime(totalTime, chunkSize) {
    // Tính số lượng khoảng thời gian đầy đủ
    const numChunks = Math.floor(totalTime / chunkSize);
    
    // Tính thời gian còn lại
    const remainder = totalTime % chunkSize;
    
    // Tạo mảng với các khoảng thời gian đầy đủ
    const result = Array(numChunks)
    .fill(null)
    .map(() => ({
      name: 'time',
      time: chunkSize,
      isActive: false
    }))

  // Thêm đối tượng cho thời gian còn lại vào mảng nếu có
  if (remainder > 0) {
    result.push({
      name: 'time',
      time: remainder,
      isActive: false
    })
  }
    return result;
}

export {splitTime}