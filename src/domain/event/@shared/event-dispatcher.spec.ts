import CustomerCreatedEvent from "../product/customer-created.event";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import SendLogOneWhenCustomerIsCreatedHandler from "../product/handler/send-log-one-when-customer-is-created.handler";
import SendLogTwoWhenCustomerIsCreatedHandler from "../product/handler/send-log-two-when-customer-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  describe("#productEvents", () => {
    it("should register an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

      eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

      eventDispatcher.unregisterAll();

      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined;
      expect(eventDispatcher.getEventHandlers).toStrictEqual({});
    });

    it("should notify all event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendEmailWhenProductIsCreatedHandler();
      const spyEventHandler = jest.spyOn(eventHandler, "handle");

      eventDispatcher.register("ProductCreatedEvent", eventHandler);

      expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

      const productCreatedEvent = new ProductCreatedEvent({
        name: "Product 1",
        description: "Product 1 description",
        price: 10.0
      });

      // quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
      eventDispatcher.notify(productCreatedEvent);

      expect(spyEventHandler).toHaveBeenCalled();
    });
  });

  describe("#customerEvents", () => {
    it("should register customer events handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandlerOne = new SendLogOneWhenCustomerIsCreatedHandler();
      const eventHandlerTwo = new SendLogTwoWhenCustomerIsCreatedHandler();

      eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
      eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerOne);
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandlerTwo);
    });

    it.only("should notify all event handlers when a customer is created", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandlerOne = new SendLogOneWhenCustomerIsCreatedHandler();
      const eventHandlerTwo = new SendLogTwoWhenCustomerIsCreatedHandler();

      const spyEventHandlerOne = jest.spyOn(eventHandlerOne, "handle");
      const spyEventHandlerTwo = jest.spyOn(eventHandlerTwo, "handle");

      eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
      eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerOne);
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandlerTwo);

      const customerCreatedEvent = new CustomerCreatedEvent({
        id: "123",
        name: "Customer 1",
      })

      eventDispatcher.notify(customerCreatedEvent);

      expect(spyEventHandlerOne).toHaveBeenCalled();
      expect(spyEventHandlerTwo).toHaveBeenCalled();
    });
  });
});
