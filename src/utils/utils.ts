import { IDeskproClient } from "@deskpro/app-sdk";
import { IEnvelopeWithRecipients } from "../api/types";
import { Buffer } from "buffer";
import * as ApiFns from "../api/api";

export const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

export const addToState = async (
  client: IDeskproClient,
  data: IEnvelopeWithRecipients,
  allTime: boolean
) => {
  const currentState = JSON.parse(
    ((await client.getState(`emailsWithIds/${encodeHex(data.email)}`))?.[0]
      ?.data as string) ?? "{}"
  );

  await client.setState(
    `emailswithids/${encodeHex(data.email)}`,
    JSON.stringify(
      allTime
        ? data
        : {
            ...data,
            envelopeIds: [
              ...(currentState.envelopeIds || []),
              ...(data.envelopeIds || []),
            ].filter((e, i, a) => a.indexOf(e) === i),
          }
    )
  );
};

export const encodeHex = (data: string) => {
  return Buffer.from(data).toString("hex");
};

export const parseArray = (data: { data: unknown }[] | undefined): unknown => {
  try {
    return data?.map((e) => JSON.parse(e.data as string));
  } catch (e) {
    return [];
  }
};

export const promiseAllEnvelopes = (
  client: IDeskproClient,
  data: IEnvelopeWithRecipients | null | undefined
) => {
  return Promise.all(
    data?.envelopeIds.map((id) => ApiFns.getEnvelopeById(client, id)) ?? []
  );
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const base64 = event.target.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    try {
      reader.readAsDataURL(file);
      // eslint-disable-next-line no-empty
    } catch (e) {
      resolve(1);
    }
  });
