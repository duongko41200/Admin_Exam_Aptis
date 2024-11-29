import type {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  PaginationPayload,
  SortPayload,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from "react-admin";
import { fetchUtils } from "react-admin";
// import removeEmptyProperties from '@repo/utils/removeEmptyProperties';
// import { exclude } from '@repo/utils/excludeKey';
import {
  GetPutPresignedUrlparams,
  PutObjectViaPresignedUrlParams,
} from "@/types/dataProvider";
import { HEADER_FORMAT, HEADER } from "../../consts/header";
import { validUrlApi } from "../..//consts/text";
import { pushId } from "../..//utils/pushId";

const apiUrlApp = `https://bot-app-english-apiss.vercel.app/v1/api`;
const apiUrlDesktopApp = `http://localhost:3333/v1/api`;
const httpClient = fetchUtils.fetchJson;

const baseDataProvider: DataProvider = {
  // get a list of records based on sort, filter, and pagination
  getList: async (
    resource: string,
    params: GetListParams
  ): Promise<GetListResult> => {
    const { page, perPage } = params.pagination as PaginationPayload;
    const { field, order } = params.sort as SortPayload;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };

    const requestParams = `sort=${query.sort}&&range=${query.range}&&filter=${query.filter}`;

    const url = `${apiUrlDesktopApp}/${resource}/?${requestParams}`;

    const request = new Request(`${url}`, {
      method: "GET",
      headers: new Headers(HEADER),
    });
    const response = await fetch(request);

    console.log("response.ok", response.ok);

    console.log("response laf:", response);
    if (response.ok === false) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const resData = pushId(data.metadata);

    return {
      data: resData.slice((page - 1) * perPage, page * perPage),
      total: parseInt(data.metadata?.length, 10),
    };
  },
  // get a single record by id
  getOne: async (
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult> => {
    console.log("param;", params);
    const url = `${apiUrlDesktopApp}/${resource}/get-id/${params.id}`;

    console.log({ url });

    const request = new Request(`${url}`, {
      method: "GET",
      headers: new Headers(HEADER),
    });

    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log({ data });
    data.metadata.id = data.metadata._id;
    const resData = data.metadata;

    return {
      data: resData,
    };
  },
  // get a list of records based on an array of ids
  getMany: async (
    resource: string,
    params: GetManyParams
  ): Promise<GetManyResult> => {
    const url = `${apiUrlDesktopApp}/${resource}?id=${params.ids}`;
    const {
      json: { metadata },
    } = await httpClient(url);

    return {
      data: metadata,
    };
  },

  getAll: async (resource: string): Promise<GetOneResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/batch/`;

    const request = new Request(`${url}`, {
      method: "GET",
      headers: new Headers(HEADER),
    });

    const response = await fetch(request);
    console.log("response :", response);
    if (!response.ok) {
      console.log("Error");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log({ data });

    console.log(":::metadata", data.metadata);
    return {
      data: data.metadata,
    };
  },
  // get the records referenced to another record, e.g. comments for a post
  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult> => {
    const query = JSON.stringify(params);

    const url = `${apiUrlDesktopApp}/${resource}/refer?${query}`;
    const {
      json: { metadata },
    } = await httpClient(url);

    return metadata;
  },
  // create a record
  create: async (
    resource: string,
    params: CreateParams
  ): Promise<CreateResult> => {
    const url = `${apiUrlDesktopApp}/${resource}`;

    console.log({ params });
    let body = JSON.stringify(params.data);

    console.log({ body });

    const request = new Request(`${url}`, {
      method: "POST",
      headers: new Headers(HEADER),
      body,
    });

    const response = await fetch(request);

    console.log("response :", response);
    if (!response.ok) {
      console.log("Error");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log({ data });

    console.log(":::metadata", data.metadata);
    return {
      data: data.metadata,
    };
  },

  createMany: async (
    resource: string,
    params: CreateParams
  ): Promise<CreateResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/batch`;

    const body = JSON.stringify(params.data);

    const response = await httpClient(url, {
      method: "POST",
      body,
    });
    const {
      json: { metadata },
    } = response;

    return {
      data: metadata,
    };
  },

  // update a record based on a patch
  update: async (
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/${params.id}`;

    console.log({ params });

    // let body
    // if (params.data instanceof FormData) {
    //   body = params.data
    // } else {
    //   body = JSON.stringify('tesst')
    // }
    let body = JSON.stringify(params.data);

    const response = await fetch(url, {
      method: "PUT",
      headers: new Headers(HEADER),
      body,
    });

    console.log("response :", response);
    if (!response.ok) {
      console.log("Error");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      data: data.metadata,
    };
  },

  // getAll: async (resource: string) => {
  //   const url = `${apiUrlDesktopApp}/${resource}/batch`
  //   const {
  //     json: { metadata }
  //   } = await httpClient(url)

  //   return {
  //     data: metadata
  //   }
  // },

  // update a list of records based on an array of ids and a common patch
  updateMany: async (
    resource: string,
    params: UpdateManyParams
  ): Promise<UpdateManyResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/batch`;
    const body = JSON.stringify(params.data);

    const response = await httpClient(url, {
      method: "PUT",
      body,
    });
    const {
      json: { metadata },
    } = response;

    return {
      data: metadata,
    };
  },
  // delete a record by id
  delete: async (
    resource: string,
    params: DeleteParams
  ): Promise<DeleteResult> => {
    console.log("params", params);
    const url = `${apiUrlDesktopApp}/${resource}/${params.id}`;
    const response = await httpClient(url, {
      method: "DELETE",
      headers: new Headers(HEADER),
    });
    const {
      json: { metadata },
    } = response;

    return {
      data: metadata,
    };
  },
  // delete a list of records based on an array of ids
  deleteMany: async (
    resource: string,
    params: DeleteManyParams
  ): Promise<DeleteManyResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/batch`;
    const body = JSON.stringify(params.ids);

    console.log({ body });

    const response = await httpClient(url, {
      method: "DELETE",
      body,
    });

    const {
      json: { metadata },
    } = response;
    console.log("deleteMany");

    return {
      data: metadata,
    };
  },
  getFiltersRecord: async (resource: string, params: any) => {
    const url = `${apiUrlDesktopApp}/${resource}/filters`;
    const body = JSON.stringify(params);
    console.log({ body });

    const request = new Request(`${url}`, {
      method: "POST",
      headers: new Headers(HEADER),
      body,
    });

    const response = await fetch(request);

    console.log("response :", response);
    if (!response.ok) {
      console.log("Error");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log({ data });

    console.log(":::metadata", data.metadata);
    return {
      data: data.metadata,
    };
  },

  getPutPresignedUrl: async (
    resource: string,
    params: GetPutPresignedUrlparams
  ) => {
    console.log({ resource, params });
    const url = `${apiUrlDesktopApp}/${resource}`;
    const body = JSON.stringify(params.data);

    const response = await httpClient(url, {
      method: "POST",
      body,
    });

    const {
      json: { presignedUrl },
    } = response;

    return {
      data: { presignedUrl },
    };
  },

  putObjectViaPresignedUrl: async (
    resource: string,
    params: PutObjectViaPresignedUrlParams
  ) => {
    const url = `${resource}`;
    const { body, type } = params;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": type,
      },
      body,
    });
    console.log(":::response", response);

    return {
      data: response,
    };
  },

  resetData: async (resource: string) => {
    console.log({ resource });
    const url = `${apiUrlDesktopApp}/${resource}/resetData`;

    const request = new Request(`${url}`, {
      method: "GET",
      headers: new Headers(HEADER),
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log({ data });

    return {
      data: response,
    };
  },

  synchData: async (resource: string) => {
    console.log({ resource });
    const url = `${apiUrlDesktopApp}/${resource}/synch`;

    const request = new Request(`${url}`, {
      method: "GET",
      headers: new Headers(HEADER),
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log({ data });

    return {
      data: response,
    };
  },

  getTranscriptYT: async (resource: string, videoID: string) => {
    console.log({ resource, videoID });
    const url = `${apiUrlDesktopApp}/${resource}/transcript?videoID=${videoID}`;

    console.log("url", url);

    const request = new Request(`${url}`, {
      method: "GET",
      headers: new Headers(HEADER),
    });
    const response = await fetch(request);
    console.log({ response });

    const data = await response.json();
    console.log({ data });

    return {
      data: data.metadata,
    };
  },

  runVoiceGoogle: async (resource: string) => {
    const url = `${apiUrlDesktopApp}/${resource}/voice-gg`;
    const response = await fetch(url, {
      method: "POST",

      body: "",
    });
    const data = await response.json();
    console.log({ data });

    return {
      data: data.metadata,
    };
  },

  checkAndClickVoice: async (resource: string) => {
    const url = `${apiUrlDesktopApp}/${resource}/start-record-voice`;
    const response = await fetch(url, {
      method: "POST",

      body: "",
    });
    const data = await response.json();
    console.log({ data });

    return {
      data: data.metadata,
    };
  },

  checkAndClickVoiceStop: async (resource: string) => {
    const url = `${apiUrlDesktopApp}/${resource}/stop-record-voice`;
    const response = await fetch(url, {
      method: "POST",

      body: "",
    });
    const data = await response.json();
    console.log({ data });

    return {
      data: data.metadata,
    };
  },

  getRecordVoice: async (resource: string) => {
    const url = `${apiUrlDesktopApp}/${resource}/get-record-voice`;
    const response = await fetch(url, {
      method: "POST",

      body: "",
    });
    const data = await response.json();
    console.log({ data });

    return {
      data: data.data,
    };
  },
  getSummaryVideo: async (resource: string) => {
    const url = `${apiUrlDesktopApp}/${resource}/summary`;
    const response = await fetch(url, {
      method: "POST",

      body: "",
    });
    const data = await response.json();
    console.log({ data });

    return {
      data: data.data,
    };
  },
  updateAndCreate: async (
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/update-create/${params.id}`;

    let body = JSON.stringify(params.data);

    const response = await httpClient(url, {
      method: "PUT",
      body,
    });
    const {
      json: { metadata },
    } = response;

    return {
      data: metadata,
    };
  },

  exportDataByJson: async (resource: string) => {
    console.log({ resource });
    const url = `${apiUrlDesktopApp}/${resource}/export-json`;

    console.log("url", url);

    const request = new Request(`${url}`, {
      method: "GET",
      headers: new Headers(HEADER),
    });
    const response = await fetch(request);
    console.log({ response });

    const data = await response.json();
    console.log({ data });

    return {
      data: "export success",
    };
  },

  updateFileUpload: async (
    resource: string,
    params: UpdateParams
  ): Promise<UpdateResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/update-file-upload`;

    let body = JSON.stringify(params.data);
    console.log({ body });
    const response = await httpClient(url, {
      method: "POST",
      body,
    });
    const {
      json: { metadata },
    } = response;

    return {
      data: metadata,
    };
  },
  createAndUploadImage: async (
    resource: string,
    params: CreateParams
  ): Promise<CreateResult> => {
    const url = `${apiUrlDesktopApp}/${resource}/create-part-image`;

    console.log({ params });
    let body: any;

    if (resource === "speakings") {
      body = params.data;
    } else {
      body = JSON.stringify(params.data);
    }

    console.log({ body });

    const request = new Request(`${url}`, {
      method: "POST",
      headers: new Headers(HEADER_FORMAT),
      body,
    });

    const response = await fetch(request);

    console.log("response :", response);
    // if (!response.ok) {
    //   console.log("Error");
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    const data = await response.json();

    console.log({ data });

    console.log(":::metadata", data.metadata);
    return {
      data: data.metadata,
    };
  },

  // GetUserLogin: async (resource: string, params: GetPutPresignedUrlparams) => {
  //   const url = `${validUrlApi(resource) ? apiUrlDesktopApp :  apiUrlApp}/${resource}`;
  //   const body = JSON.stringify(params.data);

  //   const response = await httpClient(url, {
  //     method: 'POST',
  //     body,
  //   });

  //   const {
  //     json: { presignedUrl },
  //   } = response;

  //   return {
  //     data: { presignedUrl },
  //   };
  // },
};

export default baseDataProvider;
