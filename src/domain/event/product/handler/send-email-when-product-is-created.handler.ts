import EventHandlerInterface from "../../@shared/event-handler.interface";
import eventInterface from "../../@shared/event.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductCreatedEvent> {
  handle(event: eventInterface): void {
    console.log("Sending email to..............");
  }

}
