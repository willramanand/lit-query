import { createContext } from "@lit/context";
import { QueryClient } from "@tanstack/query-core";

export const queryClientContext = createContext<QueryClient>("queryClient");
