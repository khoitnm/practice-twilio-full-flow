export default class CallEventType {
  /**
   * At this time, the Call is not Started yet, the Call is started when there's only at least one Accepted response
   */
  public static readonly REQUESTED: string = "Requested";
  public static readonly ACCEPTED: string = "Accepted";

  /**
   * The Call is canceled even before it's started (there's no Accepted response yet)
   */
  public static readonly CANCELED: string = "Canceled";
  public static readonly DECLINED: string = "Declined";
  public static readonly ENDED: string = "Ended";
}