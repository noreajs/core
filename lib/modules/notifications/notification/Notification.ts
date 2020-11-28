import {
  IEmailNotification,
  IPushNotification,
  ISmsNotification,
} from "../interfaces";

export declare type NotificationConstructorType<Notifications> = {
  emailNotification?: IEmailNotification<Notifications, any, any>;
  pushNotification?: IPushNotification<Notifications, any, any>;
  smsNotification?: ISmsNotification<Notifications, any, any>;
};

export default class Notification<Notifications> {
  private email: Notifications;
  private push: Notifications;
  private _sms: Notifications;

  constructor(params: NotificationConstructorType<Notifications>) {
    // initialize notifications
    this.email = (params.emailNotification?.email ?? {}) as Notifications;
    this.push = (params.pushNotification?.push ?? {}) as Notifications;
    this._sms = (params.smsNotification?.sms ?? {}) as Notifications;
  }

  async emails(key: keyof Notifications, ...args: any[]) {
    if (Object.keys(this.email).includes(key as any)) {
      const method = (this.email as any)[key];
      // call the method
      await method(...args);
    } else {
      throw Error(
        `Email Notification Error: The method ${key} is not defined.`
      );
    }
  }

  async pushs(key: keyof Notifications, ...args: any[]) {
    if (Object.keys(this.push).includes(key as any)) {
      const method = (this.push as any)[key];
      // call the method
      await method(...args);
    } else {
      throw Error(`Push Notification Error: The method ${key} is not defined.`);
    }
  }

  async sms(key: keyof Notifications, ...args: any[]) {
    if (Object.keys(this._sms).includes(key as any)) {
      const method = (this._sms as any)[key];
      // call the method
      await method(...args);
    } else {
      throw Error(`Sms Notification Error: The method ${key} is not defined.`);
    }
  }
}
