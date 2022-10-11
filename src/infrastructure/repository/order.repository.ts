import sequelize from "sequelize";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrdemRepositoryInterface from "../../domain/repository/order-repository-interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrdemRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          unitPrice: item.unitPrice,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    let orderModel;
    try {
      await OrderModel.sequelize.transaction(async (t) => {
        await OrderItemModel.destroy({
          where: { order_id: entity.id },
          transaction: t,
        });

        const items = entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          unitPrice: item.unitPrice,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        }));

        await OrderItemModel.bulkCreate(items, { transaction: t });

        await OrderModel.update(
          { total: entity.total() },
          { where: { id: entity.id }, transaction: t }
        );
      });
    } catch (error) {
      throw new Error("Error to update order");
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const orderItens = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.unitPrice,
        item.product_id,
        item.quantity,
      )
    })

    const order = new Order(id, orderModel.customer_id, orderItens);

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    })

    const orders = orderModels.map((orderModel) => {
      const orderItens = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.unitPrice,
          item.product_id,
          item.quantity,
        )
      })

      const order = new Order(orderModel.id, orderModel.customer_id, orderItens);

      return order;
    });

    return orders;
  }
}
