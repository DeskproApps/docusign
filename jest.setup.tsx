/* eslint-disable @typescript-eslint/no-explicit-any */
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";

global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextDecoder = TextDecoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.React = React;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => jest.fn(),
  useParams: () => ({ submitType: "file" }),
}));

jest.mock("./src/components/LogoAndLinkButton/LogoAndLinkButton", () => ({
  LogoAndLinkButton: () => <div>LogoAndLinkButton</div>,
}));

jest.mock("./src/styles.ts", () => ({
  ...jest.requireActual("./src/styles.ts"),
  StyledLink: () => <div>StyledLink</div>,
}));

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproAppClient: () => ({
    client: {
      setHeight: () => {},
      getEntityAssociation: () => ({
        list: () => {},
        delete: () => {},
        set: () => {},
      }),
    },
  }),
  useDeskproAppEvents: (
    hooks: { [key: string]: (param: Record<string, unknown>) => void },
    deps: [] = []
  ) => {
    const deskproAppEventsObj = {
      data: {
        ticket: {
          id: 1,
          subject: "Test Ticket",
        },
      },
    };
    React.useEffect(() => {
      !!hooks.onChange && hooks.onChange(deskproAppEventsObj);
      !!hooks.onShow && hooks.onShow(deskproAppEventsObj);
      !!hooks.onReady && hooks.onReady(deskproAppEventsObj);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  },
  useDeskproAppTheme: () => ({
    theme: {
      colors: {},
    },
  }),
  useInitialisedDeskproAppClient: (
    callback: (param: Record<string, unknown>) => void
  ) => {
    callback({
      registerElement: () => {},
      deregisterElement: () => {},
      setHeight: () => {},
      setTitle: () => {},
    });
  },
  proxyFetch: async () => fetch,
  HorizontalDivider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useQueryWithClient: (queryKey: string, queryFn: () => any, options: any) => {
    queryKey;
    options;
    if (!options || options?.enabled == null || options?.enabled == true) {
      return {
        isSuccess: true,
        data: queryFn(),
        isLoading: false,
      };
    }
    return {
      isSuccess: false,
      data: null,
      isLoading: false,
    };
  },
  useMutationWithClient: () => {
    return {
      mutate: () => {},
      isSuccess: true,
      isLoading: false,
      data: {
        result: {
          id: 1,
          name: {
            displayName: "Michael Something",
          },
          description: "This is a contact description",
          email: "email@email.com",
          phone: "123456789",
          account: "Company",
          owner: {
            name: "John Doe",
          },
          tags: ["Test tag"],
          address: {
            "--primary": {
              address_1: "123 Main Street",
              address_2: "Apt 1",
              adress_3: "Suite 1",
            },
          },
          leads: [],
          notes: [],
        },
      },
    };
  },
  useDeskproLatestAppContext: () => ({
    context: {
      data: {
        user: {
          primaryEmail: "email@email.com",
        },
      },
    },
  }),
}));
