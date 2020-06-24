export default abstract class ISmsNotification<
  SmsList,
  TransportType,
  SmsRequestContentType
> {
  protected transport!: TransportType;

  sms: Partial<SmsList> = {};

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
  async sendSms(
    pushRequestContent: SmsRequestContentType,
    callback?: (error: any, info: any) => void
  ) {}
}
