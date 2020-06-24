export default abstract class IPushNotification<
  Pushs,
  TransportType,
  PushRequestContentType
> {
  protected transport!: TransportType;

  push: Partial<Pushs> = {};

  constructor() {
    this.initTransport();
  }

  /**
   * Initialize transport within this method
   */
  protected initTransport(): void {}

  /**
   * Send mail with the transport
   * @param mailData mail data
   * @param callback callback
   */
  async sendPush(
    pushRequestContent: PushRequestContentType,
    callback?: (error: any, info: any) => void
  ) {}
}
