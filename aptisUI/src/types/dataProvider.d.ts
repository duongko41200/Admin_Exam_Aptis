export interface UpdateAnimalClassificationCount {
  classificationId: number
  dataProvider: DataProvider
  decrement?: boolean
}

export interface GetPutPresignedUrlparams {
  data: {
    fileKey: string
  }
}

export interface PutObjectViaPresignedUrlParams {
  body: File
  type: string
}
