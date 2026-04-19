/**
 * Adapter: adapts a legacy-shaped notification API to our application's NotificationSender port.
 * Problem: third-party SDK expects different method names / payload shape.
 */
export class LegacyVendorClient {
  sendLegacyPing({ recipientEmail, headline, copy }) {
    return { ok: true, vendorId: `LEG-${recipientEmail}-${headline}`, copy };
  }
}

export class LegacyEmailAdapter {
  constructor(legacyClient = new LegacyVendorClient()) {
    this._legacy = legacyClient;
  }

  /** @param {{to:string, subject:string, body:string}} message */
  send(message) {
    return this._legacy.sendLegacyPing({
      recipientEmail: message.to,
      headline: message.subject,
      copy: message.body,
    });
  }
}
