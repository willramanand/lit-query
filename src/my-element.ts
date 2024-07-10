import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { provide } from "@lit/context";
import { queryClientContext } from "./query/queryClient";
import { QueryClient } from "@tanstack/query-core";
import { QueryController } from "./query/QueryController";
import axios from "axios";

type RepoData = {
  name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
};

@customElement("my-element")
export class MyElement extends LitElement {
  @provide({ context: queryClientContext })
  @property({ attribute: false })
  public client: QueryClient = new QueryClient();

  private query = new QueryController(this, this.client, {
    queryKey: ["repoData"],
    queryFn: async () => {
      return axios
        .get<RepoData>("https://api.github.com/repos/tannerlinsley/react-query")
        .then((res) => res.data);
    },
  });

  render() {
    const { data, isLoading, error } = this.query.result;

    if (isLoading) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    return html`
      <div>
        <h1>${data.name}</h1>
        <p>${data.description}</p>
        <strong>👀 ${data.subscribers_count}</strong>
        <strong>✨ ${data.stargazers_count}</strong>
        <strong>🍴 ${data.forks_count}</strong>
        <button
          @click="${() => {
            this.client.refetchQueries();
          }}"
        >
          refetch
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
