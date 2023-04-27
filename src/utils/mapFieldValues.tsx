import { ReactElement } from "react";
import { IJson } from "../types/json";
import { capitalizeFirstLetter } from "./utils";

export const mapFieldValues = (
  metadataFields: IJson["view"][0],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
): {
  key: string | number;
  value: string | number | ReactElement;
}[] => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date": {
        if (!field[metadataField.name]) {
          value = null;

          break;
        }

        (() => {
          const date = new Date(field[metadataField.name] as string);

          value = `${date.toLocaleDateString(
            "en-UK"
          )} at ${date.getHours()}:${date.getMinutes()}`;
        })();

        break;
      }
      case "text": {
        value = capitalizeFirstLetter(field[metadataField.name]);

        break;
      }

      default:
        value = field[metadataField.name];
    }

    return {
      key: metadataField.label,
      value: value as string | number | ReactElement,
    };
  });
};
