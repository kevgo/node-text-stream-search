import { Subscription } from "./types/subscription"

/**
 * SubscriptionList contains all current subscriptions.
 */
export class SubscriptionList extends Array<Subscription> {
  /**
   * Looks for new matches in the received text.
   *
   * Called each time the text or search terms change.
   * Subscriptions notify their subscribers on their own if they match,
   * so this method returns nothing.
   */
  checkText(text: string) {
    for (const subscription of this) {
      subscription.check(text)
    }
  }
}
