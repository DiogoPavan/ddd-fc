import EventHandlerInterface from "../../@shared/event-handler.interface";
import EventInterface from "../../@shared/event.interface";
import CustomerCreatedEvent from "../../customer/customer-created.event";

export default class SendLogWhenCustomerAddressIsChangedHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: EventInterface): void {
    const { id, name, address } = event.eventData;

    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`);
  }

}
