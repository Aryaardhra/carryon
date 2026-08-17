import stripe from "../configs/stripe.js";
import { handleCheckoutCompleted, handleCheckoutExpired, handlePaymentFailed } from "../services/stripeService.js";


export const stripeWebhook = async (req, res) => {
   
  const signature = req.headers["stripe-signature"];
  let event;
  // 1. VERIFY STRIPE WEBHOOK SIGNATURE
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message,
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`,
    );
  }

  // 2. HANDLE STRIPE EVENT

  try {
    switch (event.type) {
      // CHECKOUT COMPLETED
      case "checkout.session.completed": {
        await handleCheckoutCompleted(
          event.data.object,
        );
        break;
      }

      // CHECKOUT EXPIRED

      case "checkout.session.expired": {
        await handleCheckoutExpired(
          event.data.object,
        );
        break;
      }

      // PAYMENT FAILED

      case "payment_intent.payment_failed": {
        await handlePaymentFailed(
          event.data.object,
        );

        break;
      }

      // OTHER EVENTS

      default: {
        console.log(`Unhandled Stripe event: ${event.type}`);
        break;
      }
    }

    // 3. ACKNOWLEDGE STRIPE
    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
};