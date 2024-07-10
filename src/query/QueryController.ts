import {
  QueryClient,
  QueryObserver,
  QueryObserverOptions,
} from "@tanstack/query-core";
import { ReactiveController, ReactiveControllerHost } from "lit";

export class QueryController implements ReactiveController {
  host: ReactiveControllerHost;

  private observer;
  private defaultedOptions;
  private client: QueryClient;
  private unsub?: () => void;

  result;

  constructor(
    host: ReactiveControllerHost,
    client: QueryClient,
    queryOptions: QueryObserverOptions
  ) {
    (this.host = host).addController(this);

    this.client = client;
    this.defaultedOptions = client.defaultQueryOptions(queryOptions);
    this.observer = new QueryObserver(client, this.defaultedOptions);
    this.result = this.observer.getOptimisticResult(this.defaultedOptions);
  }
  hostConnected() {
    this.client.mount();

    this.unsub = this.observer.subscribe(() => {
      console.log("update");
      this.result = this.observer.trackResult(
        this.observer.getOptimisticResult(this.defaultedOptions)
      );
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.unsub?.();
    this.client.unmount();
  }
}
