import EventHandlerInterface from "../../@shared/event-handler.interface";
import EventInterface from "../../@shared/event.interface";
import CustomerCreatedEvent from "../../customer/customer-created.event";

export default class SendLogOneWhenCustomerIsCreatedHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: EventInterface): void {
    console.log("Esse é o primeiro console.log do evento: CustomerCreated");
  }

}
